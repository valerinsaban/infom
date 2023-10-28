import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class DesembolsosService {

  constructor(private rootService: RootService) {
  }

  route = '/desembolsos';

  getDesembolsos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getDesembolso(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getDesembolsosPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id);
  }

  async postDesembolso(data: any): Promise<any> {
    let desembolso = await this.rootService.post(this.route, data);
    if (desembolso.resultado) {
      await this.rootService.bitacora('desembolso', 'agregar', `creó el desembolso "${desembolso.data.nombre}"`, desembolso.data);
    }
    return desembolso;
  }

  async putDesembolso(id: number, data: any): Promise<any> {
    let desembolso = await this.rootService.put(this.route + '/' + id, data);
    if (desembolso.resultado) {
      await this.rootService.bitacora('desembolso', 'editar', `editó el desembolso "${desembolso.data.nombre}"`, desembolso.data);
    }
    return desembolso;
  }

  async deleteDesembolso(id: number): Promise<any> {
    let desembolso = await this.rootService.delete(this.route + '/' + id);
    if (desembolso.resultado) {
      await this.rootService.bitacora('desembolso', 'eliminar', `eliminó el desembolso "${desembolso.data.nombre}"`, desembolso.data);
    }
    return desembolso;
  }
}
