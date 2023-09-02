import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AportesService {

  constructor(private rootService: RootService) {
  }

  route = '/aportes';

  getAportes(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getAportesMesDepartamentoMunicipio(mes_inicio: string, mes_fin: string, codigo_departamento: string, codigo_municipio: string): Promise<any> {
    return this.rootService.get(this.route + '/' + mes_inicio + '/'  + mes_fin + '/' + codigo_departamento + '/' + codigo_municipio);
  }

  getAporte(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postAporte(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putAporte(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteAporte(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

