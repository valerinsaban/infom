import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { CobrosService } from 'src/app/services/cobros.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';
import { PrestamosService } from 'src/app/services/prestamos.service';
import * as moment from 'moment';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';
import { FacturasService } from 'src/app/services/documentos/facturas.service';
import { RecibosService } from 'src/app/services/documentos/recibos.service';
import { OrdenesPagosService } from 'src/app/services/ordenes_pagos.service';
import { FacturasDetallesService } from 'src/app/services/documentos/facturas_detalles.service';
import { RecibosDetallesService } from 'src/app/services/documentos/recibos_detalles.service';
import { ProyeccionesService } from 'src/app/services/proyecciones.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';
import { AmortizacionesDetallesService } from 'src/app/services/amortizaciones_detalles.service';
import { MegaPrintService } from 'src/app/services/megaprint.service';
import { md5 } from 'js-md5';

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

  amortizaciones: any = [];

  cobro_anterior: any;

  configuracion: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private cobrosService: CobrosService,
    private prestamosService: PrestamosService,
    private amortizacionesService: AmortizacionesService,
    private amortizaciones_detallesService: AmortizacionesDetallesService,
    private proyeccionesService: ProyeccionesService,
    private ordenes_pagosService: OrdenesPagosService,
    private movimientosService: MovimientosService,
    private facturasService: FacturasService,
    private factuas_detallesService: FacturasDetallesService,
    private recibosService: RecibosService,
    private recibos_detallesService: RecibosDetallesService,
    private configuracionesService: ConfiguracionesService,
    private megaprintService: MegaPrintService,
  ) {
    this.cobroForm = new FormGroup({
      codigo: new FormControl('SEP-A', [Validators.required]),
      fecha: new FormControl('2023-10-14', [Validators.required]),
      mes: new FormControl('2023-09', [Validators.required]),
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
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let cobro_anterior = await this.cobrosService.getCobroUltimo();
    if (cobro_anterior) {
      this.cobro_anterior = cobro_anterior;
    }

    let cobro = await this.cobrosService.postCobro(this.cobroForm.value);
    if (cobro.resultado) {

      this.cobro = cobro.data;

      let prestamos = await this.prestamosService.getPrestamosEstado('Acreditado');
      for (let p = 0; p < prestamos.length; p++) {

        let proyeccion = await this.proyeccionesService.getProyeccionesPrestamoMes(prestamos[p].id, this.cobro.mes);

        if (proyeccion) {

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
                  if (moment(ordenes_pagos[o].fecha) < moment(fecha)) {
                    cuotas[0] = {
                      fecha_inicio: moment(ordenes_pagos[o].fecha).format('YYYY-MM-DD'),
                      fecha_fin: moment(fecha).format('YYYY-MM-DD')
                    }
                  } else {
                    if (c == 1) {
                      cuotas.splice(1, 1);
                    }
                    cuotas[0] = {
                      fecha_inicio: moment(ordenes_pagos[o].fecha).format('YYYY-MM-DD'),
                      fecha_fin: moment(fecha).endOf('month').format('YYYY-MM-DD')
                    }
                  }
                } else {
                  // if (moment(ordenes_pagos[o].fecha) < moment(fecha)) {
                  //   cuotas[0] = {
                  //     fecha_inicio: moment(cuotas[c].fecha_inicio).startOf('month').format('YYYY-MM-DD'),
                  //     fecha_fin: moment(ordenes_pagos[o].fecha).subtract(1, 'day').format('YYYY-MM-DD')
                  //   }
                  //   cuotas[1] = {
                  //     fecha_inicio: moment(ordenes_pagos[o].fecha).format('YYYY-MM-DD'),
                  //     fecha_fin: moment(cuotas[c].fecha_fin).format('YYYY-MM-DD')
                  //   }
                  //   cuotas[2] = {
                  //     fecha_inicio: moment(cuotas[c].fecha_fin).format('YYYY-MM-DD'),
                  //     fecha_fin: moment(cuotas[c].fecha_fin).format('YYYY-MM-DD')
                  //   }
                  // } else {
                  //   cuotas[0] = {
                  //     fecha_inicio: moment(cuotas[c].fecha_inicio).startOf('month').format('YYYY-MM-DD'),
                  //     fecha_fin: moment(ordenes_pagos[o].fecha).subtract(1, 'day').format('YYYY-MM-DD')
                  //   }
                  //   cuotas[1] = {
                  //     fecha_inicio: moment(ordenes_pagos[o].fecha).format('YYYY-MM-DD'),
                  //     fecha_fin: moment(cuotas[c].fecha_fin).format('YYYY-MM-DD')
                  //   }
                  // }

                }
              }
            }
          }

          await this.calcAmortizacion(prestamos[p], cuotas, proyeccion);

        }

      }

      await this.getCobros();
      this.limpiar();
      this.alert.alertMax('Operacion Correcta', cobro.mensaje, 'success');
    }
    this.ngxService.stop();
  }

  async calcAmortizacion(p: any, cuotas: any, proyeccion: any) {
    let tasa = parseFloat(p.tasa);
    let dias = 0;
    let capital = parseFloat(proyeccion.capital);
    let interes = 0;
    let iva = 0;
    let interes_iva = 0;

    let ultimo_mivimiento = await this.movimientosService.getMovimientosUltimo(p.id);
    let saldo = ultimo_mivimiento ? ultimo_mivimiento.saldo_final : 0;

    let amortizacion = await this.amortizacionesService.postAmortizacion({
      mes: moment(this.cobro.mes).format('YYYY-MM'),
      fecha_inicio: null,
      fecha_fin: null,
      dias,
      capital,
      interes,
      iva,
      cuota: capital + interes + iva,
      saldo_inicial: saldo,
      saldo_final: saldo,
      tasa: p.tasa,
      id_cobro: this.cobro.id,
      id_prestamo: p.id,
      id_programa: p.id_programa
    });

    for (let i = 0; i < cuotas.length; i++) {
      let fecha_inicio = cuotas[i].fecha_inicio;
      let fecha_fin = cuotas[i].fecha_fin;

      if (fecha_inicio && fecha_fin) {
        let dias_cuota = moment(fecha_fin).diff(moment(fecha_inicio), 'days') + 1;

        cuotas[i].saldo_inicial = saldo;

        cuotas[i].dias = dias_cuota;
        cuotas[i].capital = capital
        i == 1 ? cuotas[i].capital = cuotas[0].saldo_final : null;

        cuotas[i].interes = (saldo * (tasa / 100) / 365) * dias_cuota;
        i == 1 ? cuotas[i].interes = (cuotas[0].saldo_final * (tasa / 100) / 365) * dias_cuota : null;

        cuotas[i].iva = cuotas[i].interes * parseFloat(this.configuracion.porcentaje_iva) / 100;

        cuotas[i].cuota = cuotas[i].capital + cuotas[i].interes + cuotas[i].iva;
        i == 1 ? cuotas[i].cuota = cuotas[i].interes + cuotas[i].iva : null;

        cuotas[i].saldo_final = saldo - cuotas[i].capital;
        i == 1 ? cuotas[i].saldo_final = cuotas[0].saldo_final : null;

        i == 1 ? cuotas[i].capital = 0 : null;

        cuotas[i].id_amortizacion = amortizacion.data.id;
        cuotas[i].mes = moment(fecha_fin).format('YYYY-MM');
        cuotas[i].tasa = p.tasa;

        await this.amortizaciones_detallesService.postAmortizacionDetalle(cuotas[i]);

        saldo = cuotas[i].saldo_final;
        dias += cuotas[i].dias;
        interes += cuotas[i].interes;
        iva += cuotas[i].iva;
        interes_iva += cuotas[i].interes + cuotas[i].iva;

      }

    }

    await this.amortizacionesService.putAmortizacion(amortizacion.data.id, {
      mes: moment(this.cobro.mes).format('YYYY-MM'),
      fecha_inicio: moment(cuotas[0].fecha_inicio).format('YYYY-MM-DD'),
      fecha_fin: moment(cuotas[cuotas.length - 1].fecha_fin).format('YYYY-MM-DD'),
      dias,
      capital,
      interes,
      iva,
      cuota: capital + interes + iva,
      saldo_inicial: ultimo_mivimiento ? ultimo_mivimiento.saldo_final : 0,
      saldo_final: saldo,
      tasa: p.tasa,
      id_cobro: this.cobro.id,
      id_prestamo: p.id,
      id_programa: p.id_programa
    });

  }

  async generarDocumentos() {

    this.ngxService.start();

    let data = await this.megaprintService.solicitarToken();
    if (data.resultado) {
      let token = data.res.token._text;

      for (let a = 0; a < this.amortizaciones.length; a++) {

        let amortizacion = this.amortizaciones[a];
        let cuota = parseFloat(amortizacion.capital) + parseFloat(amortizacion.interes) + parseFloat(amortizacion.iva);
        cuota = Math.round((cuota + Number.EPSILON) * 100) / 100;

        let interes_iva = parseFloat(amortizacion.interes) + parseFloat(amortizacion.iva);
        interes_iva = Math.round((interes_iva + Number.EPSILON) * 100) / 100;
        let impuestos = Math.round(((interes_iva / 1.12 * 0.12) + Number.EPSILON) * 100) / 100;
        let monto_gravable = interes_iva - impuestos;
        monto_gravable = Math.round(((monto_gravable) + Number.EPSILON) * 100) / 100;

        let info: any = {
          factura: {
            numero: 0,
            fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
            nit: amortizacion.prestamo.municipalidad.nit,
            nombre: `${amortizacion.prestamo.municipalidad.municipio.nombre}, ${amortizacion.prestamo.municipalidad.departamento.nombre}`,
            autorizacion: null,
            serie_fel: null,
            numero_fel: null,
            monto: parseFloat(amortizacion.interes) + parseFloat(amortizacion.iva),
            estado: 'Vigente',
            id_amortizacion: amortizacion.id
          },
          detalles: [{
            cantidad: 1,
            tipo: 'S',
            descripcion: `Cobro de intereses e IVA correspondiente al mes de ${moment(amortizacion.mes).format('MMMM YYYY')}. 
            Prestamo ${amortizacion.prestamo.no_prestamo}.
            Resolucion ${amortizacion.prestamo.resolucion.numero}.`,
            precio: interes_iva,
            precio_unitario: interes_iva,
            descuentos: 0,
            impuestos: impuestos,
            monto_gravable: monto_gravable,
            subtotal: interes_iva,
            // id_factura: factura.data.id
          }]
        }

        data = await this.megaprintService.certificar(token, info);
        if (data.resultado) {

          info.factura.uuid = data.res.uuid._text;
          let factura = await this.facturasService.postFactura(info.factura);

          if (factura.resultado) {

            info.detalles[0].id_factura = factura.data.id;
            await this.factuas_detallesService.postFacturaDetalle(info.detalles[0]);

            let desc = `AMORTIZACIÓN CORRESPONDIENTE AL
            MES DE ${moment(amortizacion.mes).format('MMMM YYYY')}, RECUPERADOS CON EL APORTE CONSTITUCIONAL, PRÉSTAMO ${amortizacion.prestamo.no_prestamo} RESOLUCIÓN ${amortizacion.prestamo.resolucion.numero} 
            SEGÚN FACTURA No. #${factura.data.id}`;

            let recibo = await this.recibosService.postRecibo({
              numero: 0,
              fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
              nit: amortizacion.prestamo.municipalidad.nit,
              nombre: `${amortizacion.prestamo.municipalidad.municipio.nombre}, ${amortizacion.prestamo.municipalidad.departamento.nombre}`,
              monto: cuota,
              estado: 'Vigente',
              descripcion: desc,
              firma: this.getFirma(moment().format('YYYY-MM-DD HH:mm:ss'), HomeComponent.usuario.nombre),
              id_factura: factura.data.id
            });

            if (recibo.resultado) {

              await this.recibos_detallesService.postReciboDetalle({
                cantidad: 1,
                tipo: 'S',
                descripcion: `CAPITAL`,
                precio_unitario: amortizacion.capital,
                descuentos: 0,
                impuestos: 0,
                subtotal: amortizacion.capital,
                id_recibo: recibo.data.id
              });
              await this.recibos_detallesService.postReciboDetalle({
                cantidad: 1,
                tipo: 'S',
                descripcion: `INTERÉS`,
                precio_unitario: amortizacion.interes,
                descuentos: 0,
                impuestos: 0,
                subtotal: amortizacion.interes,
                id_recibo: recibo.data.id
              });
              await this.recibos_detallesService.postReciboDetalle({
                cantidad: 1,
                tipo: 'S',
                descripcion: `IVA`,
                precio_unitario: amortizacion.iva,
                descuentos: 0,
                impuestos: 0,
                subtotal: amortizacion.iva,
                id_recibo: recibo.data.id
              });

              await this.movimientosService.postMovimiento({
                fecha: moment(this.cobro.fecha).format('YYYY-MM-DD'),
                saldo_inicial: amortizacion.saldo_inicial,
                cargo: 0,
                abono: amortizacion.capital,
                saldo_final: amortizacion.saldo_final,
                descripcion: `V/Amortizacion Capital. ${this.moneda(amortizacion.capital)} Interes ${this.moneda(amortizacion.interes)}. IVA ${this.moneda(amortizacion.iva)}.`,
                capital: amortizacion.capital,
                interes: amortizacion.interes,
                iva: amortizacion.iva,
                id_prestamo: amortizacion.prestamo.id,
                id_orden_pago: null,
                id_recibo: recibo.data.id
              });

            }

          }
        } else {
          this.alert.alertMax('Operacion Incorrecta', 'Error al certificar Factura MegaPrint', 'error');
        }


      }

      this.alert.alertMax('Operacion Correcta', 'Documentos Generados', 'success');

    } else {
      this.alert.alertMax('Operacion Incorrecta', 'Error al generar TOKEN MegaPrint', 'error');
    }

    this.ngxService.stop();
  }

  async putCobro() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let cobro = await this.cobrosService.putCobro(this.cobro.id, this.cobroForm.value);
    if (cobro.resultado) {
      await this.getCobros();
      this.alert.alertMax('Operacion Correcta', cobro.mensaje, 'success');
      this.cobroForm.reset();
      this.cobro = null;
    }
    this.ngxService.stop();
  }

  async deleteCobro(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
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

  regenerarCobro(i: any, index: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Regenerar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let cobro = await this.cobrosService.deleteCobro(i.id);
        if (cobro.resultado) {
          this.cobros.splice(index, 1);
          this.setCobro(i, index);
          await this.postCobro();
          this.alert.alertMax('Correcto', 'Regenerar Cobro', 'success');
          this.cobro = null;
        }
        this.ngxService.stop();
      }
    })
  }

  async getAmortizaciones() {
    this.ngxService.start();
    let amortizaciones = await this.amortizacionesService.getAmortizacionesCobro(this.cobro.id);
    this.amortizaciones = amortizaciones;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      let detalles = await this.amortizaciones_detallesService.getAmortizacionesDetallesAmortizacion(this.amortizaciones[a].id);
      if (detalles) {
        this.amortizaciones[a].amortizaciones_detalles = detalles;
      }
    }
    this.ngxService.stop();
  }

  getFirma(fecha: any, usuario: any) {
    // let no_recibo = this.reciboForm.controls['estado'].value;
    return md5(`${fecha}${usuario}`);
  }

  limpiar() {
    this.cobroForm.reset();
    this.cobro = null;
  }

  moneda(total: any) {
    let currency = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return currency.format(total);
  }

}
