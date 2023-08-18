import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { MenusService } from '../services/seguridad/menu.service';
import { UsuariosService } from '../services/seguridad/usuarios.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  static usuario: any;

  menus: any = [];

  constructor(
    private router: Router,
    private menusService: MenusService,
    private usuariosService: UsuariosService
  ) { }

  async ngOnInit() {
    let token: any = sessionStorage.getItem('token');
    if (token) {
      let usuario: any = decode(token);
      if (usuario) {        
        let u = await this.usuariosService.getUsuariosByUsuario(usuario.sub);        
        HomeComponent.usuario = u; 

        await this.getMenus();    
        AppComponent.loadScript('assets/js/deznav-init.js');
        AppComponent.loadScript('assets/js/custom.js');
        AppComponent.loadScript('assets/js/demo.js'); 
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
  
  get usuario() {    
    return HomeComponent.usuario;
  }

  closeMenu() {
    $('.hamburger').removeClass('is-active');
    $('#main-wrapper').removeClass('menu-toggle');
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['login'])
  }

}
