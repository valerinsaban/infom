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

  getMunicipalidadDepartamento(departamento: string): Promise<any> {
    return this.rootService.get(this.route + '/' + departamento);
  }

  getMunicipalidad(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postMunicipalidad(data: any): Promise<any> {
    let municipalidad = await this.rootService.post(this.route, data);
    if (municipalidad.resultado) {
      await this.rootService.bitacora('municipalidad', 'agregar', `creó la municipalidad "${municipalidad.data.departamento.nombre} ${municipalidad.data.municipio.nombre}"`, municipalidad.data);
    }
    return municipalidad;
  }

  async putMunicipalidad(id: number, data: any): Promise<any> {
    let municipalidad = await this.rootService.put(this.route + '/' + id, data);
    if (municipalidad.resultado) {
      await this.rootService.bitacora('municipalidad', 'editar', `editó la municipalidad "${municipalidad.data.departamento.nombre} ${municipalidad.data.municipio.nombre}"`, municipalidad.data);
    }
    return municipalidad;
  }

  async deleteMunicipalidad(id: number): Promise<any> {
    let municipalidad = await this.rootService.delete(this.route + '/' + id);
    if (municipalidad.resultado) {
      await this.rootService.bitacora('municipalidad', 'eliminar', `eliminó la municipalidad "${municipalidad.data.departamento.nombre} ${municipalidad.data.municipio.nombre}"`, municipalidad.data);
    }
    return municipalidad;
  }


}

