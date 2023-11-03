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

  getAportesMes(mes: string): Promise<any> {
    return this.rootService.get(this.route + '/mes/' + mes);
  }

  getAportesDepartamentoMunicipio(codigo_departamento: string, codigo_municipio: string): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/' + codigo_departamento + '/' + codigo_municipio);
  }

  getAportesDepartamentoMunicipioMes(codigo_departamento: string, codigo_municipio: string, mes: string): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/mes/' + codigo_departamento + '/' + codigo_municipio + '/' + mes);
  }

  getAporte(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postAporte(data: any): Promise<any> {
    let aporte = await this.rootService.post(this.route, data);
    if (aporte.resultado) {
      await this.rootService.bitacora('aporte', 'agregar', `creó el aporte "${aporte.data.mes}"`, aporte.data);
    }
    return aporte;
  }

  async putAporte(id: number, data: any): Promise<any> {
    let aporte = await this.rootService.put(this.route + '/' + id, data);
    if (aporte.resultado) {
      await this.rootService.bitacora('aporte', 'editar', `editó el aporte "${aporte.data.mes}"`, aporte.data);
    }
    return aporte;
  }

  async deleteAporte(id: number): Promise<any> {
    let aporte = await this.rootService.delete(this.route + '/' + id);
    if (aporte.resultado) {
      await this.rootService.bitacora('aporte', 'eliminar', `eliminó el aporte "${aporte.data.mes}"`, aporte.data);
    }
    return aporte;
  }


}

