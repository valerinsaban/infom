import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {

  constructor(private rootService: RootService) {
  }

  route = '/municipios';

  getMunicipios(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getMunicipio(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }


  getMunicipioByDepartamento(id: number): Promise<any> {
    return this.rootService.get(this.route + '/departamento/' + id + this.route);
  }


  postMunicipio(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putMunicipio(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteMunicipio(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

