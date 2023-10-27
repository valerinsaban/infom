import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class DestinosService {

  constructor(private rootService: RootService) {
  }

  route = '/destinos';

  getDestinos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getDestino(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getDestinoCodigo(codigo: string): Promise<any> {
    return this.rootService.get(this.route + '/codigo/' + codigo);
  }

  async postDestino(data: any): Promise<any> {
    let destino = await this.rootService.post(this.route, data);
    if (destino.resultado) {
      await this.rootService.bitacora('destino', 'agregar', `creó el destino "${destino.data.nombre}"`, destino.data);
    }
    return destino;
  }

  async putDestino(id: number, data: any): Promise<any> {
    let destino = await this.rootService.put(this.route + '/' + id, data);
    if (destino.resultado) {
      await this.rootService.bitacora('destino', 'editar', `editó el destino "${destino.data.nombre}"`, destino.data);
    }
    return destino;
  }

  async deleteDestino(id: number): Promise<any> {
    let destino = await this.rootService.delete(this.route + '/' + id);
    if (destino.resultado) {
      await this.rootService.bitacora('destino', 'eliminar', `eliminó el destino "${destino.data.nombre}"`, destino.data);
    }
    return destino;
  }
}
