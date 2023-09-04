import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  constructor(
    private rootService: RootService
  ) {  }

  route = '/bancos';

  async getBancos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  async getBanco(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postBanco(data: any): Promise<any> {
    let banco: any = await this.rootService.post(this.route, data);
    if (banco.resultado) {
      await this.rootService.bitacora('banco', `creó el banco "${banco.data.nombre}"`, banco.data);
    }
    return banco;
  }

  async putBanco(id: number, data: any): Promise<any> {
    let banco: any = await this.rootService.put(this.route + '/' + id, data);
    if (banco.resultado) {
      await this.rootService.bitacora('banco', `editó el banco "${banco.data.nombre}"`, banco.data);

    }
    return banco;
  }

  async deleteBanco(id: number): Promise<any> {
    let banco: any = await this.rootService.delete(this.route + '/' + id);
    if (banco.resultado) {
      await this.rootService.bitacora('banco', `eliminó el banco "${banco.data.nombre}"`, banco.data);
    }
    return banco;
  }
}
