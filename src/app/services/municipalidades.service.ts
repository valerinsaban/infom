import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class MunicipalidadesService {

  constructor(private rootService: RootService) {
  }

  route = '/municipalidades';

  getMunicipalidades(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getMunicipalidadDepartamentoMunicipio(departamento: string, municipio: string): Promise<any> {
    return this.rootService.get(this.route + '/' + departamento + '/' + municipio);
  }

  getMunicipalidad(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postMunicipalidad(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putMunicipalidad(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteMunicipalidad(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

