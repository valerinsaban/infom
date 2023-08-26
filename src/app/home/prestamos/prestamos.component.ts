import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';
import { RegionalesService } from 'src/app/services/catalogos/regionales.service';
import { FuncionariosService } from 'src/app/services/funcionarios.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import Swal from 'sweetalert2';
import { TiposPrestamosService } from 'src/app/services/catalogos/tipos_prestamos.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios.service';
import { HomeComponent } from '../home.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from 'src/app/app.component';
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent {

  prestamoForm: FormGroup;
  amortizacionForm: FormGroup;

  prestamos: any = [];
  prestamo: any;

  file: any;

  tipos_prestamos: any = [];
  municipalidades: any = [];
  funcionarios: any = [];
  regionales: any = [];
  usuarios: any = [];

  amortizaciones: any = [];
  amortizacion: any;

  estado: string = 'Pendiente';

  counts: any = {
    pendientes: null,
    aprobados: null,
    acreditados: null,
    finalizados: null,
    rechazados: null,
  }

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private prestamosService: PrestamosService,
    private tipos_prestamosService: TiposPrestamosService,
    private municipalidadesService: MunicipalidadesService,
    private funcionariosService: FuncionariosService,
    private regionalesService: RegionalesService,
    private usuariosService: UsuariosService,
    private amortizacionesService: AmortizacionesService,
  ) {
    this.prestamoForm = new FormGroup({
      no_dictamen: new FormControl(null, [Validators.required]),
      no_pagare: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      fecha_vencimiento: new FormControl(null, [Validators.required]),
      monto: new FormControl(null, [Validators.required]),
      plazo_meses: new FormControl(null, [Validators.required]),
      fecha_acta: new FormControl(null, [Validators.required]),
      deposito_intereses: new FormControl(null, [Validators.required]),
      intereses: new FormControl(null, [Validators.required]),
      intereses_fecha_fin: new FormControl(null, [Validators.required]),
      tiempo_gracia: new FormControl(null, [Validators.required]),
      destino_prestamo: new FormControl(null, [Validators.required]),
      cobro_intereses: new FormControl(null, [Validators.required]),
      acta: new FormControl(null, [Validators.required]),
      punto: new FormControl(null, [Validators.required]),
      fecha_memorial: new FormControl(null, [Validators.required]),
      autorizacion: new FormControl(null, [Validators.required]),
      certficacion: new FormControl(null, [Validators.required]),
      oficioaj: new FormControl(null, [Validators.required]),
      oficioaj2: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      id_tipo_prestamo: new FormControl(null, [Validators.required]),
      id_municipalidad: new FormControl(null, [Validators.required]),
      id_funcionario: new FormControl(null, [Validators.required]),
      id_regional: new FormControl(null, [Validators.required]),
      id_usuario: new FormControl(HomeComponent.id_usuario, [Validators.required])
    });
    this.amortizacionForm = new FormGroup({
      fecha_inicio: new FormControl(null, [Validators.required]),
      fecha_fin: new FormControl(null, [Validators.required]),
      dias: new FormControl(null, [Validators.required]),
      capital: new FormControl(null, [Validators.required]),
      intereses: new FormControl(null, [Validators.required]),
      cuota: new FormControl(null, [Validators.required]),
      saldo: new FormControl(null, [Validators.required]),
      id_prestamo: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getPrestamos();
    await this.getCountPrestamos();
    this.getTiposPrestamos();
    this.getMunicipalidades();
    this.getRegionales();
    this.getFuncionarios();
    this.getUsuarios();
    this.ngxService.stop();
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');
  }

  // async getPrestamos() {
  //   this.ngxService.startBackground();
  //   let prestamos = await this.prestamosService.getPrestamos(this.fecha_inicio, this.fecha_fin);
  //   if (prestamos) {
  //     this.prestamos = prestamos;
  //   }
  //   this.ngxService.stopBackground();
  // }

  async getPrestamos() {
    this.ngxService.startBackground();
    let prestamos = await this.prestamosService.getPrestamosEstado(this.estado, this.fecha_inicio, this.fecha_fin);
    if (prestamos) {
      this.prestamos = prestamos;
    }
    this.ngxService.stopBackground();
  }

  async getCountPrestamos() {
    this.ngxService.startBackground();
    this.counts = {};
    this.counts.pendientes = await this.prestamosService.getCountPrestamosEstado('Pendiente', this.fecha_inicio, this.fecha_fin);
    this.counts.aprobados = await this.prestamosService.getCountPrestamosEstado('Aprobado', this.fecha_inicio, this.fecha_fin);
    this.counts.acreditados = await this.prestamosService.getCountPrestamosEstado('Acreditado', this.fecha_inicio, this.fecha_fin);
    this.counts.finalizados = await this.prestamosService.getCountPrestamosEstado('Finalizado', this.fecha_inicio, this.fecha_fin);
    this.counts.rechazados = await this.prestamosService.getCountPrestamosEstado('Rechazado', this.fecha_inicio, this.fecha_fin);
    this.ngxService.stopBackground();
  }

  async getTiposPrestamos() {
    let tipos_prestamos = await this.tipos_prestamosService.getTiposPrestamos();
    if (tipos_prestamos) {
      this.tipos_prestamos = tipos_prestamos;
    }
  }

  async getMunicipalidades() {
    let municipalidades = await this.municipalidadesService.getMunicipalidades();
    if (municipalidades) {
      this.municipalidades = municipalidades;
    }
  }

  async getFuncionarios() {
    let funcionarios = await this.funcionariosService.getFuncionarios();
    if (funcionarios) {
      this.funcionarios = funcionarios;
    }
  }

  async getRegionales() {
    let regionales = await this.regionalesService.getRegionales();
    if (regionales) {
      this.regionales = regionales;
    }
  }

  async getUsuarios() {
    let usuarios = await this.usuariosService.getUsuarios();
    if (usuarios) {
      this.usuarios = usuarios;
    }
  }

  async getAmortizaciones() {
    let amortizaciones = await this.amortizacionesService.getAmortizacionesPrestamo(this.prestamo.id);
    if (amortizaciones) {
      this.amortizaciones = amortizaciones;
    }
  }

  get fecha_inicio() {
    return sessionStorage.getItem('fecha_inicio');
  }

  get fecha_fin() {
    return sessionStorage.getItem('fecha_fin');
  }

  async postPrestamo() {
    this.ngxService.start();
    let prestamo = await this.prestamosService.postPrestamo(this.prestamoForm.value);
    if (prestamo.resultado) {
      await this.getPrestamos();
      await this.getCountPrestamos();
      this.alert.alertMax('Transaccion Correcta', prestamo.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putPrestamo() {
    let estado = this.prestamoForm.controls['estado'].value;
    if (estado == 'Finalizado') {
      let saldo = (this.amortizaciones.length ? parseFloat(this.amortizaciones[this.amortizaciones.length - 1].saldo) : this.prestamo.monto).toFixed(2);
      if (saldo != '0.00') {
        this.alert.alertMax('Transaccion Incorrecta', `Prestamo con Q${saldo} de saldo pendiente`, 'error');
        return;
      }
    }
    this.ngxService.start();
    let prestamo = await this.prestamosService.putPrestamo(this.prestamo.id, this.prestamoForm.value);
    if (prestamo.resultado) {
      await this.getPrestamos();
      await this.getCountPrestamos();
      this.alert.alertMax('Transaccion Correcta', prestamo.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async deletePrestamo(i: any, index: number) {
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
        let prestamo = await this.prestamosService.deletePrestamo(i.id);
        if (prestamo.resultado) {
          this.prestamos.splice(index, 1);
          await this.getCountPrestamos();
          this.alert.alertMax('Correcto', prestamo.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  async postAmortizacion() {
    this.ngxService.start();
    let amortizacion = await this.amortizacionesService.postAmortizacion(this.amortizacionForm.value);
    if (amortizacion.resultado) {
      await this.getAmortizaciones();
      this.alert.alertMax('Transaccion Correcta', amortizacion.mensaje, 'success');
      this.limpiar2();
    }
    this.ngxService.stop();
  }

  async putAmortizacion() {
    this.ngxService.start();
    let amortizacion = await this.amortizacionesService.putAmortizacion(this.amortizacion.id, this.amortizacionForm.value);
    if (amortizacion.resultado) {
      await this.getAmortizaciones();
      this.alert.alertMax('Transaccion Correcta', amortizacion.mensaje, 'success');
      this.limpiar2();
    }
    this.ngxService.stop();
  }

  async deleteAmortizacion(i: any, index: number) {
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
        let amortizacion = await this.amortizacionesService.deleteAmortizacion(i.id);
        if (amortizacion.resultado) {
          this.amortizaciones.splice(index, 1);
          this.alert.alertMax('Correcto', amortizacion.mensaje, 'success');
          this.limpiar2();
        }
        this.ngxService.stop();
      }
    })
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.prestamoForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }


  // Metodos para obtener data y id de registro seleccionado
  async setPrestamo(i: any, index: number) {
    i.index = index;
    this.prestamo = i;
    this.prestamoForm.controls['no_dictamen'].setValue(i.no_dictamen);
    this.prestamoForm.controls['no_pagare'].setValue(i.no_pagare);
    this.prestamoForm.controls['fecha'].setValue(moment.utc(i.fecha).format('YYYY-MM-DD'));
    this.prestamoForm.controls['fecha_vencimiento'].setValue(moment.utc(i.fecha_vencimiento).format('YYYY-MM-DD'));
    this.prestamoForm.controls['monto'].setValue(i.monto);
    this.prestamoForm.controls['plazo_meses'].setValue(i.plazo_meses);
    this.prestamoForm.controls['fecha_acta'].setValue(moment.utc(i.fecha_acta).format('YYYY-MM-DD'));
    this.prestamoForm.controls['deposito_intereses'].setValue(i.deposito_intereses);
    this.prestamoForm.controls['intereses'].setValue(i.intereses);
    this.prestamoForm.controls['intereses_fecha_fin'].setValue(moment.utc(i.intereses_fecha_fin).format('YYYY-MM-DD'));
    this.prestamoForm.controls['tiempo_gracia'].setValue(i.tiempo_gracia);
    this.prestamoForm.controls['destino_prestamo'].setValue(i.destino_prestamo);
    this.prestamoForm.controls['cobro_intereses'].setValue(i.cobro_intereses);
    this.prestamoForm.controls['acta'].setValue(i.acta);
    this.prestamoForm.controls['punto'].setValue(i.punto);
    this.prestamoForm.controls['fecha_memorial'].setValue(moment.utc(i.fecha_memorial).format('YYYY-MM-DD'));
    this.prestamoForm.controls['autorizacion'].setValue(i.autorizacion);
    this.prestamoForm.controls['certficacion'].setValue(i.certficacion);
    this.prestamoForm.controls['oficioaj'].setValue(i.oficioaj);
    this.prestamoForm.controls['oficioaj2'].setValue(i.oficioaj2);
    this.prestamoForm.controls['estado'].setValue(i.estado);
    this.prestamoForm.controls['id_tipo_prestamo'].setValue(i.id_tipo_prestamo);
    this.prestamoForm.controls['id_municipalidad'].setValue(i.id_municipalidad);
    this.prestamoForm.controls['id_funcionario'].setValue(i.id_funcionario);
    this.prestamoForm.controls['id_regional'].setValue(i.id_regional);
    this.prestamoForm.controls['id_usuario'].setValue(i.id_usuario);

    this.amortizacionForm.controls['id_prestamo'].setValue(i.id);

    await this.getAmortizaciones();
  }

  setAmortizacion(i: any, index: number) {
    i.index = index;
    this.amortizacion = i;
    this.amortizacionForm.controls['fecha_inicio'].setValue(i.fecha_inicio);
    this.amortizacionForm.controls['fecha_fin'].setValue(i.fecha_fin);
    this.amortizacionForm.controls['id_prestamo'].setValue(this.prestamo.id);
    this.calcAmortizacion(true);
  }

  calcAmortizacion(edit: boolean = false) {
    let monto = this.prestamo.monto;
    let plazo = parseFloat(this.prestamo.plazo_meses);
    let intereses_porc = parseFloat(this.prestamo.intereses);

    let fecha_inicio = this.amortizacionForm.controls['fecha_inicio'].value;
    let fecha_fin = this.amortizacionForm.controls['fecha_fin'].value;

    if (fecha_inicio && fecha_fin) {
      let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days') + 1;
      let capital = monto / plazo;
      let saldo_actual = monto;

      if (this.amortizaciones.length) {
        capital = parseFloat(this.amortizaciones[this.amortizaciones.length - 1].capital);
        saldo_actual = parseFloat(this.amortizaciones[this.amortizaciones.length - 1].saldo);
      }
      if (edit) {
        if (this.amortizacion.index == 0) {
          capital = monto / plazo;
          saldo_actual = monto;
        } else {
          capital = parseFloat(this.amortizaciones[this.amortizacion.index - 1].capital);
          saldo_actual = parseFloat(this.amortizaciones[this.amortizacion.index - 1].saldo);
        }
      }

      let intereses = (saldo_actual * (intereses_porc / 100) / 365) * dias;
      let cuota = capital + intereses;
      let saldo = saldo_actual - capital;


      this.amortizacionForm.controls['dias'].setValue(dias);
      this.amortizacionForm.controls['capital'].setValue(capital.toFixed(8));
      this.amortizacionForm.controls['saldo'].setValue(saldo.toFixed(8));
      this.amortizacionForm.controls['intereses'].setValue(intereses.toFixed(8))
      this.amortizacionForm.controls['cuota'].setValue(cuota.toFixed(8))

    }
  }

  getTotalDias() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += this.amortizaciones[a].dias;
    }
    return total;
  }

  getTotalCapital() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += parseFloat(this.amortizaciones[a].capital);
    }
    return total;
  }

  getTotalIntereses() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += parseFloat(this.amortizaciones[a].intereses);
    }
    return total;
  }

  getTotalCuota() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += parseFloat(this.amortizaciones[a].cuota);
    }
    return total;
  }

  colorClass(p: any) {
    if (p.estado == 'Pendiente') {
      return 'pendiente'
    }
    if (p.estado == 'Aprobado') {
      return 'aprobado'
    }
    if (p.estado == 'Acreditado') {
      return 'acreditado'
    }
    if (p.estado == 'Finalizado') {
      return 'finalizado'
    }
    if (p.estado == 'Rechazado') {
      return 'rechazado'
    }
    return '';
  }

  limpiar() {
    this.prestamoForm.reset();
    this.prestamoForm.controls['estado'].setValue('Pendiente');
    this.prestamoForm.controls['cobro_intereses'].setValue(false);
    this.prestamoForm.controls['id_usuario'].setValue(HomeComponent.id_usuario);
    this.prestamo = null;
  }

  limpiar2() {
    this.amortizacionForm.reset();
    if (this.amortizaciones.length) {
      let amortizacion = this.amortizaciones[this.amortizaciones.length - 1];
      this.amortizacionForm.controls['fecha_inicio'].setValue(moment(amortizacion.fecha_inicio).add(1, 'month').format('YYYY-MM-DD'));
      this.amortizacionForm.controls['fecha_fin'].setValue(moment(amortizacion.fecha_fin).add(1, 'month').format('YYYY-MM-DD'));
      this.calcAmortizacion();
    }
    this.amortizacionForm.controls['id_prestamo'].setValue(this.prestamo.id);
    this.amortizacion = null;
  }

}
