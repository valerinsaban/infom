import { Component, ElementRef } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { MenusService } from '../services/seguridad/menu.service';
import { UsuariosService } from '../services/seguridad/usuarios.service';
import * as $ from 'jquery';
import { PermisosService } from '../services/seguridad/permisos.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { BitacorasService } from '../services/bitacoras.service';
import { ConfiguracionesService } from '../services/configuraciones.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  static usuario: any;
  static permisos: any = [];
  static id_usuario: any;
  static id_rol: any;
  static id_menu: any;
  static id_submenu: any;
  static configuracion: any;

  static apiUrl = environment.api;

  menus: any = [];
  bitacoras: any = [];
  configuracion: any;

  constructor(
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private permisosService: PermisosService,
    private menusService: MenusService,
    private usuariosService: UsuariosService,
    private bitacorasService: BitacorasService,
    private elementRef: ElementRef,
    private configuracionesService: ConfiguracionesService
  ) { }

  async ngOnInit() {
    moment.locale('es');
    this.selectedMenu();
    let token: any = sessionStorage.getItem('token');
    if (token) {
      let usuario: any = decode(token);
      if (usuario) {        
        this.ngxService.start();
        this.getConfiguraciones();
        
        let u = await this.usuariosService.getUsuariosByUsuario(usuario.sub);       
        HomeComponent.usuario = u; 
        HomeComponent.id_usuario = u.id;
        HomeComponent.id_rol = u.id_rol;

        this.elementRef.nativeElement.style.setProperty('--primary', u.rol.color);
      
        await this.getMenus();   
        await this.getPermisos(); 

        AppComponent.loadScript('assets/js/deznav-init.js');
        AppComponent.loadScript('assets/js/custom.js');
        AppComponent.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js');
        AppComponent.loadScript('assets/js/mask.js');

        this.ngxService.stop();
        return;   
      }
    }
    this.router.navigate(['login']);
  }

  async getConfiguraciones() {
    let configuraciones = await this.configuracionesService.getConfiguraciones();
    if (configuraciones) {
      this.configuracion = configuraciones[0];
      HomeComponent.configuracion = configuraciones[0];
    }
  }

  async getMenus() {
    let menus = await this.menusService.getMenus();
    if (menus) {
      this.menus = menus;
    }
  }

  async getBitacoras() {
    let fecha_inicio = moment().startOf('day').format('YYYY-MM-DD HH:mm')
    let fecha_fin = moment().endOf('day').format('YYYY-MM-DD HH:mm')
    let id_usuario = HomeComponent.id_rol == 1 ? null : HomeComponent.id_usuario;
    
    let bitacoras = await this.bitacorasService.getBitacorasFecha(fecha_inicio, fecha_fin);
    if (bitacoras) {
      this.bitacoras = bitacoras.reverse();
    }
  }

  async getPermisos() {
    let permisos = await this.permisosService.getPermisoRol(HomeComponent.id_rol);
    if (permisos) {
      HomeComponent.permisos = permisos;
      if (HomeComponent.id_rol != 1) {
        this.configMenu();
      }
    }
  }

  static getPermiso(accion: string) {    
    if (HomeComponent.id_rol == 1) {
      return true;
    }
    for (let p = 0; p < HomeComponent.permisos.length; p++) {
      let per = HomeComponent.permisos[p];      
      if (per.accion == accion && per.id_menu == HomeComponent.id_menu && per.id_submenu == HomeComponent.id_submenu) {
        return true;
      }
    }
    return false;
  }

  configMenu() {
    for (let m = 0; m < this.menus.length; m++) {
  
      for (let s = 0; s < this.menus[m].submenus.length; s++) {
        let encontrado = false;
        for (let p = 0; p < HomeComponent.permisos.length; p++) {
          let per = HomeComponent.permisos[p];      
          if (per.id_menu == this.menus[m].id && per.id_submenu == this.menus[m].submenus[s].id && per.accion == 'Ver') {
            encontrado = true;
          }
        }
        if (!encontrado) {
          this.menus[m].submenus.splice(s, 1);
          s--;
        }
      }

      let encontrado = false;
      for (let p = 0; p < HomeComponent.permisos.length; p++) {
        let per = HomeComponent.permisos[p];
        if (per.id_menu == this.menus[m].id && per.accion == 'Ver') {
          encontrado = true;
        }
      }

      if (!encontrado) {
        this.menus.splice(m, 1);
        m--;
      }
    }
  }

  selectedMenu() {
    let id_menu = sessionStorage.getItem('id_menu');
    let id_submenu = sessionStorage.getItem('id_submenu');
    let fecha_inicio = sessionStorage.getItem('fecha_inicio');
    let fecha_fin = sessionStorage.getItem('fecha_fin');

    if (id_menu) {
      if (id_menu == "null") {
        HomeComponent.id_menu = null;
      } else {
        HomeComponent.id_menu = parseInt(id_menu);
      }
    }
    if (id_submenu) {
      if (id_submenu == "null") {
        HomeComponent.id_submenu = null;
      } else {
        HomeComponent.id_submenu = parseInt(id_submenu);
      }
    }
    sessionStorage.setItem('fecha_inicio', moment().startOf('month').format('YYYY-MM-DD 00:00'));
    sessionStorage.setItem('fecha_fin', moment().endOf('month').format('YYYY-MM-DD 23:59'));
  }

  get usuario() {    
    return HomeComponent.usuario;
  }

  setMenu(id_menu: any, id_submenu: any = null) {
    HomeComponent.id_menu = id_menu;
    HomeComponent.id_submenu = id_submenu;
    sessionStorage.setItem('id_menu', id_menu);
    sessionStorage.setItem('id_submenu', id_submenu);
    $('.hamburger').removeClass('is-active');
    $('#main-wrapper').removeClass('menu-toggle');
  }

  formNow(fecha: string) {
    return moment(fecha).fromNow()
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login'])
  }

}
