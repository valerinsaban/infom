import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  route = '/reportes';

  constructor(
    private httpClient: HttpClient
  ) {
  }

  async get(path: string) {
    try {
      const headers: HttpHeaders = new HttpHeaders({'Accept': 'text/html'});      
      return await this.httpClient.get(`assets/templates/${[path]}.html`, { headers: headers, responseType: 'text' }).toPromise();
    } catch (err: any) {
      return null
    }
  }

}
