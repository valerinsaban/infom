import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ImportesService {

  constructor(private rootService: RootService) {
  }

  route = '/importes';

  getImportes(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getImporte(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postImporte(data: any): Promise<any> {
    let importe = await this.rootService.post(this.route, data);
    if (importe.resultado) {
      await this.rootService.bitacora('importe', 'agregar', `creó el importe "${importe.data.mes}"`, importe.data);
    }
    return importe;
  }

  async putImporte(id: number, data: any): Promise<any> {
    let importe = await this.rootService.put(this.route + '/' + id, data);
    if (importe.resultado) {
      await this.rootService.bitacora('importe', 'editar', `editó el importe "${importe.data.mes}"`, importe.data);
    }
    return importe;
  }

  async deleteImporte(id: number): Promise<any> {
    let importe = await this.rootService.delete(this.route + '/' + id);
    if (importe.resultado) {
      await this.rootService.bitacora('importe', 'eliminar', `eliminó el importe "${importe.data.mes}"`, importe.data);
    }
    return importe;
  }


}

