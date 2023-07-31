import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: AlertService,
    private ngxService: NgxUiLoaderService
  ) {
    this.loginForm = new FormGroup({
      login: new FormControl('carlos5', [Validators.required, Validators.email]),
      password: new FormControl('123456', [Validators.required])
    });
  }

  ngOnInit(): void {
    let token = sessionStorage.getItem('token');
    if (token) {
      this.router.navigateByUrl('/home');
    }
  }

  async login() {
    this.ngxService.start();
    //let login = await this.authService.login(this.loginForm.value);
     //if (!login.resultado) {
     //sessionStorage.setItem('token', login.data.token);
      sessionStorage.setItem('token','asdf654655asdgasfhuwergehwrg');
      //this.alert.alertMax('Transaccion Exitosa', login.mensaje, 'success');
      this.alert.alertMax('Transaccion Exitosa', "Exito al entrar", 'success');
      this.router.navigate(['home']);
     /* } else {
      this.alert.alertMax('Transaccion Incorrecta', login.message, 'error');
    }
    this.ngxService.stop(); */
  }

}
