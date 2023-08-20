import { Component, ElementRef } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { MenusService } from '../services/seguridad/menu.service';
import { UsuariosService } from '../services/seguridad/usuarios.service';
import * as $ from 'jquery';
import { PermisosService } from '../services/seguridad/permisos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  static usuario: any;
  static permisos: any = [];
  static id_rol: any;
  static id_menu: any;
  static id_submenu: any;

  menus: any = [];

  constructor(
    private router: Router,
    private permisosService: PermisosService,
    private menusService: MenusService,
    private usuariosService: UsuariosService,
    private elementRef: ElementRef
  ) { }

  async ngOnInit() {
    let token: any = sessionStorage.getItem('token');
    if (token) {
      let usuario: any = decode(token);
      if (usuario) {        
        let u = await this.usuariosService.getUsuariosByUsuario(usuario.sub);       
        HomeComponent.usuario = u; 
        HomeComponent.id_rol = u.id_rol;

        this.elementRef.nativeElement.style.setProperty('--primary', u.rol.color);
      
        await this.getMenus();   
        await this.getPermisos(); 

        AppComponent.loadScript('assets/js/dashboard/cms.js');
        AppComponent.loadScript('assets/js/deznav-init.js');
        AppComponent.loadScript('assets/js/custom.js');
        
        // this.router.navigate(['home']);

        return;   
      }
    }
    this.router.navigate(['login']);
  }

  async getMenus() {
    let menus = await this.menusService.getMenus();
    if (menus) {
      this.menus = menus;
    }
  }

  async getPermisos() {
    let permisos = await this.permisosService.getPermisos();
    if (permisos) {
      HomeComponent.permisos = permisos;
    }
  }

  static getPermiso(accion: string) {    
    for (let p = 0; p < HomeComponent.permisos.length; p++) {
      let per = HomeComponent.permisos[p];      
      if (per.accion == accion && per.id_rol == HomeComponent.id_rol && per.id_menu == HomeComponent.id_menu && per.id_submenu == HomeComponent.id_submenu) {
        return true;
      }
    }
    return false;
  }

  get usuario() {    
    return HomeComponent.usuario;
  }

  setMenu(id_menu: any, id_submenu: any = null) {
    HomeComponent.id_menu = id_menu;
    HomeComponent.id_submenu = id_submenu;
    $('.hamburger').removeClass('is-active');
    $('#main-wrapper').removeClass('menu-toggle');
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['login'])
  }

}
