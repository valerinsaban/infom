import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AlertService } from '../alert.service';

@Injectable({
  providedIn: 'root'
})
export class RepService {

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService
  ) {
  }

  dataUser: any;

  url = environment.reportes;

  async get(path: string) {
    try {
      let data: any = await this.httpClient.get(this.url + path, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${this.isToken(sessionStorage.getItem('token'))}`
        }
      }).toPromise();
      this.verify(data);
      return data;
    } catch (err: any) {
      err = JSON.parse(JSON.stringify(err));
      this.alertService.alertMax('Operacion Incorrecta', err.error.message, 'error');
    }
  }

  async post(path: string, body: any = null) {
    try {
      let data: any = await this.httpClient.post(this.url + path, body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${this.isToken(sessionStorage.getItem('token'))}`
        }
      }).toPromise();
      this.verify(data);
      return data;
    } catch (err: any) {
      err = JSON.parse(JSON.stringify(err));
      this.alertService.alertMax('Operacion Incorrecta', err.error.message, 'error');
    }
  }

  async put(path: string, body: any) {
    try {
      let data: any = await this.httpClient.put(this.url + path, body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${this.isToken(sessionStorage.getItem('token'))}`
        }
      }).toPromise();
      this.verify(data);
      return data;
    } catch (err: any) {
      err = JSON.parse(JSON.stringify(err));
      this.alertService.alertMax('Operacion Incorrecta', err.error.message, 'error');
    }
  }

  async delete(path: string) {
    try {
      let data: any = await this.httpClient.delete(this.url + path, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${this.isToken(sessionStorage.getItem('token'))}`
        }
      }).toPromise();
      this.verify(data);
      return data;
    } catch (err: any) {
      err = JSON.parse(JSON.stringify(err));
      this.alertService.alertMax('Operacion Incorrecta', err.error.message, 'error');
    }
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
    // if (res.status) {
    //   this.alertService.alertMax('Operacion Incorrecta', res.message, 'error');
    // }
    // if (res.resultado == false) {
    //   this.alertService.alertMax('Operacion Incorrecta', res.mensaje, 'error');
    // }
  }

  isToken(token: any) {
    if (token) {
      return token;
    } else {
      return '';
    }
  }

}
