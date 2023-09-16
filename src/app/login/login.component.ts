import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { AppComponent } from '../app.component';

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
      usuario: new FormControl('', [Validators.required]),
      clave: new FormControl('', [Validators.required])
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
    let login = await this.authService.login(this.loginForm.value);
    if (login.token) {
      sessionStorage.setItem('token', login.token);
      this.alert.alertMax('Transaccion Exitosa', login.mensaje, 'success');
      this.router.navigate(['home']);
     } else {
      this.alert.alertMax('Transaccion Incorrecta', login.message, 'error');
    }
    this.ngxService.stop();
  }

}
