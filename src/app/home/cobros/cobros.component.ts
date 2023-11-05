import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { CobrosService } from 'src/app/services/cobros.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';
import * as moment from 'moment';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';
import { FacturasService } from 'src/app/services/documentos/facturas.service';
import { RecibosService } from 'src/app/services/documentos/recibos.service';
import { OrdenesPagosService } from 'src/app/services/ordenes_pagos.service';
import { FacturasDetallesService } from 'src/app/services/documentos/facturas_detalles.service';
import { RecibosDetallesService } from 'src/app/services/documentos/recibos_detalles.service';

@Component({
  selector: 'app-cobros',
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.css']
})
export class CobrosComponent {

  amortizacionForm: FormGroup;
  cobroForm: FormGroup;
  cobros: any = [];
  cobro: any;
  id_cobro: number = 0;

  amortizaciones: any = [];

  cobro_anterior: any;

  configuracion: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private cobrosService: CobrosService,
    private prestamosService: PrestamosService,
    private amortizacionesService: AmortizacionesService,
    private ordenes_pagosService: OrdenesPagosService,
    private facturasService: FacturasService,
    private factuas_detallesService: FacturasDetallesService,
    private recibosService: RecibosService,
    private recibos_detallesService: RecibosDetallesService,
    private configuracionesService: ConfiguracionesService
  ) {
    this.cobroForm = new FormGroup({
      codigo: new FormControl('NOV-A', [Validators.required]),
      fecha: new FormControl('2023-12-15', [Validators.required]),
      mes: new FormControl('2023-11', [Validators.required]),
    });
    this.amortizacionForm = new FormGroup({
      fecha_inicio: new FormControl(null, [Validators.required]),
      fecha_fin: new FormControl(null, [Validators.required]),
      dias: new FormControl(null, [Validators.required]),
      saldo_inicial: new FormControl(null, [Validators.required]),
      capital: new FormControl(null, [Validators.required]),
      interes: new FormControl(null, [Validators.required]),
      iva: new FormControl(null, [Validators.required]),
      cuota: new FormControl(null, [Validators.required]),
      saldo_final: new FormControl(null, [Validators.required]),
      id_prestamo: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getCobros();
    await this.getConfiguraciones();
    this.ngxService.stop();
  }

  async getConfiguraciones() {
    let configuraciones = await this.configuracionesService.getConfiguraciones();
    if (configuraciones) {
      this.configuracion = configuraciones[0];
    }
  }

  // CRUD Cobros
  async getCobros() {
    let cobros = await this.cobrosService.getCobros();
    if (cobros) {
      this.cobros = cobros;
    }
  }

  async postCobro() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let cobro_anterior = await this.cobrosService.getCobroUltimo();
    if (cobro_anterior) {
      this.cobro_anterior = cobro_anterior;
    }

    let cobro = await this.cobrosService.postCobro(this.cobroForm.value);
    if (cobro.resultado) {

      this.id_cobro = cobro.data.id;

      let prestamos = await this.prestamosService.getPrestamosEstado('Acreditado');
      for (let p = 0; p < prestamos.length; p++) {
        let amortizaciones = await this.amortizacionesService.getAmortizacionesPrestamo(prestamos[p].id);

        let fecha = this.cobro_anterior.fecha;
        let cuotas: any = [
          {
            fecha_inicio: moment(fecha).startOf('month').format('YYYY-MM-DD'),
            fecha_fin: moment(fecha).format('YYYY-MM-DD')
          },
          {
            fecha_inicio: moment(fecha).add(1, 'day').format('YYYY-MM-DD'),
            fecha_fin: moment(fecha).endOf('month').format('YYYY-MM-DD')
          }
        ];

        for (let c = 0; c < cuotas.length; c++) {
          let ordenes_pagos = await this.ordenes_pagosService.getOrdenesPagosPrestamoFecha(prestamos[p].id, cuotas[c].fecha_inicio, cuotas[c].fecha_fin);          
          if (ordenes_pagos.length) {
            for (let o = 0; o < ordenes_pagos.length; o++) {
              if (ordenes_pagos[o].no_desembolso == 1) {
                cuotas[0] = {
                  fecha_inicio: moment(ordenes_pagos[o].fecha).format('YYYY-MM-DD'),
                  fecha_fin: moment(fecha).format('YYYY-MM-DD')
                }
              } else {
                cuotas.push({
                  fecha_inicio: moment(cuotas[c].fecha_inicio).startOf('month').format('YYYY-MM-DD'),
                  fecha_fin: moment(ordenes_pagos[o].fecha).subtract(1, 'day').format('YYYY-MM-DD')
                });
                cuotas.push({
                  fecha_inicio: moment(ordenes_pagos[o].fecha).format('YYYY-MM-DD'),
                  fecha_fin: moment(cuotas[c].fecha_fin).format('YYYY-MM-DD')
                });
              }
            }
          }
        }

        await this.calcAmortizacion(prestamos[p], amortizaciones, cuotas);
      }

      await this.getCobros();
      this.limpiar();
      this.alert.alertMax('Transaccion Correcta', cobro.mensaje, 'success');
    }
    this.ngxService.stop();
  }

  async calcAmortizacion(p: any, amortizaciones: any, cuotas: any) {
    
    let monto_total = p.monto;
    let plazo_meses = parseFloat(p.plazo_meses);
    let intereses = parseFloat(p.intereses);
    let capital = monto_total / plazo_meses;

    let interes_iva = 0;

    let saldo = monto_total;
    
    for (let i = 0; i < cuotas.length; i++) {
      let fecha_inicio = cuotas[i].fecha_inicio;
      let fecha_fin = cuotas[i].fecha_fin;

      if (fecha_inicio && fecha_fin) {
        let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days') + 1;
        cuotas[i].saldo_inicial = saldo;

        if (amortizaciones.length > 0) {
          capital = monto_total / plazo_meses;
          saldo = parseFloat(amortizaciones[amortizaciones.length - 1].saldo_final);
        }

        cuotas[i].dias = dias;
        cuotas[i].capital = capital
        i == 1 ? cuotas[i].capital = cuotas[0].saldo_final : null;

        cuotas[i].interes = (saldo * (intereses / 100) / 365) * dias;
        i == 1 ? cuotas[i].interes = (cuotas[0].saldo_final * (intereses / 100) / 365) * dias : null;

        cuotas[i].iva = cuotas[i].interes * parseFloat(this.configuracion.porcentaje_iva) / 100;

        cuotas[i].cuota = cuotas[i].capital + cuotas[i].interes + cuotas[i].iva;
        i == 1 ? cuotas[i].cuota = cuotas[i].interes + cuotas[i].iva : null;

        cuotas[i].saldo_final = saldo - cuotas[i].capital;
        i == 1 ? cuotas[i].saldo_final = cuotas[0].saldo_final : null;

        i == 1 ? cuotas[i].capital = 0 : null;

        cuotas[i].id_prestamo = p.id;
        cuotas[i].id_cobro = this.id_cobro;

        let amortizacion = await this.amortizacionesService.postAmortizacion(cuotas[i]);
        this.amortizaciones.push(amortizacion)

        interes_iva += cuotas[i].interes + cuotas[i].iva;

      }

    }
        
    // let factura = await this.facturasService.postFactura({
    //   numero: p.id,
    //   fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
    //   nit: p.municipalidad.nit,
    //   nombre: p.municipalidad.municipio.nombre + ', ' + p.municipalidad.departamento.nombre,
    //   autorizacion: null,
    //   serie_fel: null,
    //   numero_fel: null,
    //   monto: interes_iva,
    //   estado: 'Vigente',
    // });

    // let factura_detalle = await this.factuas_detallesService.postFacturaDetalle({
    //   cantidad: 1,
    //   tipo: 'S',
    //   descripcion: ''
    // })

    // let recibo = await this.recibosService.postRecibo({
    //   numero: p.id,
    //   fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
    //   nit: p.municipalidad.nit,
    //   nombre: p.municipalidad.municipio.nombre + ', ' + p.municipalidad.departamento.nombre,
    //   monto: interes_iva,
    //   estado: 'Vigente',
    // });

  }

  async putCobro() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let cobro = await this.cobrosService.putCobro(this.cobro.id, this.cobroForm.value);
    if (cobro.resultado) {
      await this.getCobros();
      this.alert.alertMax('Transaccion Correcta', cobro.mensaje, 'success');
      this.cobroForm.reset();
      this.cobro = null;
    }
    this.ngxService.stop();
  }

  async deleteCobro(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let cobro = await this.cobrosService.deleteCobro(i.id);
        if (cobro.resultado) {
          this.cobros.splice(index, 1);
          this.alert.alertMax('Correcto', cobro.mensaje, 'success');
          this.cobro = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setCobro(i: any, index: number) {
    i.index = index;
    this.cobro = i;
    this.cobroForm.controls['codigo'].setValue(i.codigo);
    this.cobroForm.controls['fecha'].setValue(i.fecha);
    this.cobroForm.controls['mes'].setValue(i.mes);
  }

  async getAmortizaciones() {
    let amortizaciones = await this.amortizacionesService.getAmortizacionesCobro(this.cobro.id);
    this.amortizaciones = amortizaciones;
  }

  limpiar() {
    this.cobroForm.reset();
    this.cobro = null;
  }



}
