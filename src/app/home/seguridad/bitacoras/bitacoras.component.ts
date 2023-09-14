import { Component } from '@angular/core';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from 'src/app/app.component';
import { AlertService } from 'src/app/services/alert.service';
import { BitacorasService } from 'src/app/services/bitacoras.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios.service';

@Component({
  selector: 'app-bitacoras',
  templateUrl: './bitacoras.component.html',
  styleUrls: ['./bitacoras.component.css']
})
export class BitacorasComponent {

  usuarios: any = [];
  tipos: any = [
    'permiso', 
    'usuario', 
    'rol', 
    'garantia', 
    'municipio', 
    'estado_civil', 
    'puesto', 
    'profesion', 
    'departamento', 
    'regional', 
    'region', 
    'banco',
    'prestamo',
    'aporte',
    'importe',
    'representante',
    'funcionario',
    'municipalidad'
  ];
  acciones: any = [
    'auth',
    'agregar',
    'editar',
    'eliminar',
    'reporte'
  ];
  bitacoras: any = [];

  usuario: any = null;
  tipo: any = null;
  accion: any = null;;
  bitacora: any;

  constructor(
    private ngxService: NgxUiLoaderService,
    private bitacorasService: BitacorasService,
    private usuariosService: UsuariosService
  ) {

  }

  async ngOnInit() {
    await this.getBitacoras();
    await this.getUsuarios();
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');
  }

  async getBitacoras() {
    this.ngxService.start();
    this.bitacoras = [];
    let bitacoras = await this.bitacorasService.getBitacorasFecha(this.fecha_inicio, this.fecha_fin);
    if (bitacoras) {
      this.bitacoras = bitacoras.reverse();
    }
    this.ngxService.stop();
  }

  async getUsuarios() {
    this.usuarios = [];
    let usuarios = await this.usuariosService.getUsuarios();
    if (usuarios) {
      this.usuarios = usuarios;
    }
  }

  async setBitacora(i: any) {
    this.bitacora = i;
  }

  get fecha_inicio() {
    return sessionStorage.getItem('fecha_inicio');
  }

  get fecha_fin() {
    return sessionStorage.getItem('fecha_fin');
  }

  get code() {
    return JSON.parse(this.bitacora.body);
  }

  set code(v) {
    try {
      this.bitacora.body = JSON.parse(v);
    } catch (e) {
      console.log('error occored while you were typing the JSON');
    }
  }

  formNow(fecha: string) {
    return moment(fecha).fromNow()
  }

}
