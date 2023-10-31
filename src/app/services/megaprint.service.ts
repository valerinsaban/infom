import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MegaPrintService {

  constructor(
    private httpClient: HttpClient
  ) { }

  usuario: string = '974250';
  apikey: string = 'qiDMo9LlPJRyiDzWOOtw5pB';
  headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml');

  async solicitarToken() {
    try {
      let body = `<?xml version='1.0' encoding='UTF-8'?>
      <SolicitaTokenRequest>
          <usuario>${this.usuario}</usuario>
          <apikey>${this.apikey}</apikey>
      </SolicitaTokenRequest>`;
      console.log(body);
      
      let data: any = await this.httpClient.post('https://dev2.api.ifacere-fel.com/api/solicitarToken', body, {
        headers: this.headers,
      }).toPromise();      
      return data;
    } catch (err: any) {
      err = JSON.parse(JSON.stringify(err));
      console.log(err);      
    }
  }

}
