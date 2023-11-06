import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class RecibosService {

  constructor(private rootService: RootService) {
  }

  route = '/recibos';

  getRecibos(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getRecibo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postRecibo(data: any): Promise<any> {
    let recibo = await this.rootService.post(this.route, data);
    if (recibo.resultado) {
      await this.rootService.bitacora('recibo', 'agregar', `creó el recibo "${recibo.data.codigo}"`, recibo.data);
    }
    return recibo;
  }

  async putRecibo(id: number, data: any): Promise<any> {
    let recibo = await this.rootService.put(this.route + '/' + id, data);
    if (recibo.resultado) {
      await this.rootService.bitacora('recibo', 'editar', `editó el recibo "${recibo.data.codigo}"`, recibo.data);
    }
    return recibo;
  }

  async anularRecibo(id: number, data: any): Promise<any> {
    let recibo = await this.rootService.put(this.route + '/anular/' + id, data);
    if (recibo.resultado) {
      await this.rootService.bitacora('recibo', 'anular', `anuló el recibo "${recibo.data.codigo}"`, recibo.data);
    }
    return recibo;
  }

  async deleteRecibo(id: number): Promise<any> {
    let recibo = await this.rootService.delete(this.route + '/' + id);
    if (recibo.resultado) {
      await this.rootService.bitacora('recibo', 'eliminar', `eliminó el recibo "${recibo.data.codigo}"`, recibo.data);
    }
    return recibo;
  }
}
