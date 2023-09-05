import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {

  constructor(private rootService: RootService) { }

  route = '/generos';

  getGeneros(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getGenero(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postGenero(data: any): Promise<any> {
    let genero = await this.rootService.post(this.route, data);
    if (genero.resultado) {
      await this.rootService.bitacora('genero', 'agregar', `creó el genero "${genero.data.nombre}"`, genero.data);
    }
    return genero;
  }

  async putGenero(id: number, data: any): Promise<any> {
    let genero = await this.rootService.put(this.route + '/' + id, data);
    if (genero.resultado) {
      await this.rootService.bitacora('genero', 'editar', `editó el genero "${genero.data.nombre}"`, genero.data);
    }
    return genero;
  }

  async deleteGenero(id: number): Promise<any> {
    let genero = await this.rootService.delete(this.route + '/' + id);
    if (genero.resultado) {
      await this.rootService.bitacora('genero', 'eliminar', `eliminó el genero "${genero.data.nombre}"`, genero.data);
    }
    return genero;
  }

}
