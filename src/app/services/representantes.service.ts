import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class RepresentantesService {

  constructor(private rootService: RootService) {
  }

  route = '/representantes';

  getRepresentantes(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getRepresentante(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getRepresentanteUltimo(estado: string): Promise<any> {
    return this.rootService.get(this.route + '/ultimo/' + estado);
  }

  async postRepresentante(data: any): Promise<any> {
    let representante = await this.rootService.post(this.route, data);
    if (representante.resultado) {
      await this.rootService.bitacora('representante', 'agregar', `creó el representante "${representante.data.nombre}"`, representante.data);
    }
    return representante;
  }

  async putRepresentante(id: number, data: any): Promise<any> {
    let representante = await this.rootService.put(this.route + '/' + id, data);
    if (representante.resultado) {
      await this.rootService.bitacora('representante', 'editar', `editó el representante "${representante.data.nombre}"`, representante.data);
    }
    return representante;
  }

  async deleteRepresentante(id: number): Promise<any> {
    let representante = await this.rootService.delete(this.route + '/' + id);
    if (representante.resultado) {
      await this.rootService.bitacora('representante', 'eliminar', `eliminó el representante "${representante.data.nombre}"`, representante.data);
    }
    return representante;
  }


}

