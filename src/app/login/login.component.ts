import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ConfiguracionesService } from '../services/configuraciones.service';
import decode from 'jwt-decode';
import { UsuariosService } from '../services/seguridad/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  configuracion: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private configuracionesService: ConfiguracionesService,
    private usuariosService: UsuariosService
  ) {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      clave: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    let token = sessionStorage.getItem('token');
    if (token) {
      this.router.navigateByUrl('/home');
    }
    this.getConfiguraciones();
  }

  async login() {
    this.ngxService.start();
    let login = await this.authService.login(this.loginForm.value);
    if (login.token) {
      let usuario: any = decode(login.token);
      let u = await this.usuariosService.getUsuariosByUsuario(usuario.sub);           
      if (!u.acceso) {
        this.alert.alertMax('Transaccion Incorrecta', 'Acceso Denegado', 'warning');
        this.ngxService.stop();
        return;
      } 
      sessionStorage.setItem('token', login.token);
      this.alert.alertMax('Transaccion Exitosa', login.mensaje, 'success');
      this.router.navigate(['home']);
     } else {
      this.alert.alertMax('Transaccion Incorrecta', login.message, 'error');
    }
    this.ngxService.stop();
  }

  async getConfiguraciones() {
    let configuraciones = await this.configuracionesService.getConfiguraciones();
    if (configuraciones) {
      this.configuracion = configuraciones[0];
    }
  }

}
