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
    return this.rootService.get(this.route + '/departamento/' + id);
  }

  async postMunicipio(data: any): Promise<any> {
    let municipio = await this.rootService.post(this.route, data);
    if (municipio.resultado) {
      await this.rootService.bitacora('municipio', 'agregar', `creó el municipio "${municipio.data.nombre}"`, municipio.data);
    }
    return municipio;
  }

  async putMunicipio(id: number, data: any): Promise<any> {
    let municipio = await this.rootService.put(this.route + '/' + id, data);
    if (municipio.resultado) {
      await this.rootService.bitacora('municipio', 'editar', `editó el municipio "${municipio.data.nombre}"`, municipio.data);
    }
    return municipio;
  }

  async deleteMunicipio(id: number): Promise<any> {
    let municipio = await this.rootService.delete(this.route + '/' + id);
    if (municipio.resultado) {
      await this.rootService.bitacora('municipio', 'eliminar', `eliminó el municipio "${municipio.data.nombre}"`, municipio.data);
    }
    return municipio;
  }


}