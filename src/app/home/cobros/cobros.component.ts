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

  configuracion: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private cobrosService: CobrosService,
    private prestamosService: PrestamosService,
    private amortizacionesService: AmortizacionesService,
    private configuracionesService: ConfiguracionesService
  ) {
    this.cobroForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      mes: new FormControl(null, [Validators.required]),
    });
    this.amortizacionForm = new FormGroup({
      fecha_inicio: new FormControl(null, [Validators.required]),
      fecha_fin: new FormControl(null, [Validators.required]),
      dias: new FormControl(null, [Validators.required]),
      capital: new FormControl(null, [Validators.required]),
      interes: new FormControl(null, [Validators.required]),
      iva: new FormControl(null, [Validators.required]),
      cuota: new FormControl(null, [Validators.required]),
      saldo: new FormControl(null, [Validators.required]),
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
    let cobro = await this.cobrosService.postCobro(this.cobroForm.value);
    if (cobro.resultado) {

      let prestamos = await this.prestamosService.getPrestamosEstado('Acreditado');
      for (let p = 0; p < prestamos.length; p++) {
        let amortizaciones = await this.amortizacionesService.getAmortizacionesPrestamo(prestamos[p].id);
        this.calcAmortizacion(prestamos[p], amortizaciones);
      }

      await this.getCobros();
      this.alert.alertMax('Transaccion Correcta', cobro.mensaje, 'success');
      this.cobroForm.reset();
    }
    this.ngxService.stop();
  }

  calcAmortizacion(p: any, amortizaciones: any) {
    let monto_total = p.monto;
    let plazo_meses = parseFloat(p.plazo_meses);
    let intereses = parseFloat(p.intereses);
    let capital = monto_total / plazo_meses;

    let mes = this.cobroForm.controls['mes'].value;
    let fecha = this.cobroForm.controls['fecha'].value;

    let cuotas = [
      { 
        fecha_inicio: moment(mes).startOf('month').format('YYYY-MM-DD'),
        fecha_fin: moment(fecha).format('YYYY-MM-DD')
      },
      { 
        fecha_inicio: moment(fecha).add(1, 'day').format('YYYY-MM-DD'),
        fecha_fin: moment(mes).endOf('month').format('YYYY-MM-DD')
      }
    ]
    for (let i = 0; i < cuotas.length; i++) {
      let fecha_inicio = cuotas[i].fecha_inicio;
      let fecha_fin = cuotas[i].fecha_fin;
      if (fecha_inicio && fecha_fin) {
        let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days') + 1;
        let saldo_actual = monto_total;

        if (amortizaciones.length == 0) {
          capital = monto_total / plazo_meses;
          saldo_actual = monto_total;
        } else {
          capital = monto_total / plazo_meses;
          saldo_actual = parseFloat(amortizaciones[amortizaciones.length - 1].saldo);
        }
  
        let interes = (saldo_actual * (intereses / 100) / 365) * dias;
        let iva = interes * parseFloat(this.configuracion.porcentaje_iva) / 100;
        let cuota = capital + interes + iva;
        let saldo = saldo_actual - capital;
  
        console.log(saldo_actual);
        console.log('--------------');
  
        console.log(dias);
        console.log(interes);
        console.log(iva);
        console.log(cuota);
        console.log(saldo);
      }
    }

  }

  async postAmortizacion() {
    this.ngxService.start();
    let amortizacion = await this.amortizacionesService.postAmortizacion(this.amortizacionForm.value);
    if (amortizacion.resultado) {
      this.alert.alertMax('Transaccion Correcta', amortizacion.mensaje, 'success');
    }
    this.ngxService.stop();
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

  cancelarEdicion() {
    this.cobroForm.reset();
    this.cobro = null;
  }



}
