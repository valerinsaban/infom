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
import * as $ from 'jquery';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent {

  prestamoForm: FormGroup;
  prestamos: any = [];
  prestamo: any;

  file: any;

  tipos_prestamos: any = [];
  municipalidades: any = [];
  funcionarios: any = [];
  regionales: any = [];
  usuarios: any = [];

  municipalidad: any;

  estado: string = 'Pendiente';

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private prestamosService: PrestamosService,
    private tipos_prestamosService: TiposPrestamosService,
    private municipalidadesService: MunicipalidadesService,
    private funcionariosService: FuncionariosService,
    private regionalesService: RegionalesService,
    private usuariosService: UsuariosService
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
  }

  async ngOnInit() {
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');
    this.ngxService.start();
    await this.getPrestamos();
    await this.getTiposPrestamos();
    await this.getMunicipalidades();
    await this.getRegionales();
    await this.getFuncionarios();
    await this.getUsuarios();
    this.ngxService.stop();
  }

  async getPrestamos() {
    this.ngxService.startBackground();
    let prestamos = await this.prestamosService.getPrestamos(this.estado, this.fecha_inicio, this.fecha_fin);
    if (prestamos) {
      this.prestamos = prestamos;
    }
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
      this.alert.alertMax('Transaccion Correcta', prestamo.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putPrestamo() {
    this.ngxService.start();
    let prestamo = await this.prestamosService.putPrestamo(this.prestamo.id, this.prestamoForm.value);
    if (prestamo.resultado) {
      await this.getPrestamos();
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
          this.alert.alertMax('Correcto', prestamo.mensaje, 'success');
          this.limpiar();
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
  setPrestamo(i: any, index: number) {
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
  }

  colorClass(p: any) {
    if (p.estado == 'Pendiente') {
      return 'count pendiente'
    }
    if (p.estado == 'Aprobado') {
      return 'count aprobado'
    }
    if (p.estado == 'Acreditado') {
      return 'count acreditado'
    }
    if (p.estado == 'Finalizado') {
      return 'count finalizado'
    }
    if (p.estado == 'Rechazado') {
      return 'count rechazado'
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

}
