import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
// import { HomeComponent } from '../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class RootService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {
  }

  dataUser: any;

  url = environment.api;

  async get(path: string) {
    let data: any = await this.httpClient.get(this.url + path, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(sessionStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async post(path: string, body: any = null) {
    let data: any = await this.httpClient.post(this.url + path, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(sessionStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async put(path: string, body: any) {
    let data: any = await this.httpClient.put(this.url + path, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(sessionStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async delete(path: string) {
    let data: any = await this.httpClient.delete(this.url + path, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.isToken(sessionStorage.getItem('token'))
      }
    }).toPromise();
    this.verify(data);
    return data;
  }

  async authPost(path: string, body: any) {
    let data: any = await this.httpClient.post(this.url + path, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise();
    return data;
  }

  async verify(res: any) {    
    if (res.resultado == false) {
      this.alertService.alertMax('Transaccion Incorrecta', res.mensaje, 'error');
    }
  }

  isToken(token: any) {
    if (token) {
      return token;
    } else {
      return '';
    }
  }

}
