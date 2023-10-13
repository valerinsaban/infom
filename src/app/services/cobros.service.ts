import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class CobrosService {

  constructor(private rootService: RootService) {
  }

  route = '/cobros';

  getCobros(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getCobroUltimo(): Promise<any> {
    return this.rootService.get(this.route + '/ultimo');
  }

  getCobroMes(mes: string): Promise<any> {
    return this.rootService.get(this.route + '/mes/' + mes);
  }

  getCobro(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postCobro(data: any): Promise<any> {
    let cobro = await this.rootService.post(this.route, data);
    if (cobro.resultado) {
      await this.rootService.bitacora('cobro', 'agregar', `creó el cobro "${cobro.data.codigo}"`, cobro.data);
    }
    return cobro;
  }

  async putCobro(id: number, data: any): Promise<any> {
    let cobro = await this.rootService.put(this.route + '/' + id, data);
    if (cobro.resultado) {
      await this.rootService.bitacora('cobro', 'editar', `editó el cobro "${cobro.data.codigo}"`, cobro.data);
    }
    return cobro;
  }

  async deleteCobro(id: number): Promise<any> {
    let cobro = await this.rootService.delete(this.route + '/' + id);
    if (cobro.resultado) {
      await this.rootService.bitacora('cobro', 'eliminar', `eliminó el cobro "${cobro.data.codigo}"`, cobro.data);
    }
    return cobro;
  }
}
