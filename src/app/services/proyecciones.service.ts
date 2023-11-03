import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ProyeccionesService {

  constructor(private rootService: RootService) {
  }

  route = '/proyecciones';

  getProyecciones(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getProyeccion(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getProyeccionesCobro(id_cobro: number): Promise<any> {
    return this.rootService.get(this.route + '/cobro/' + id_cobro);
  }

  getProyeccionesPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id);
  }

  async postProyeccion(data: any): Promise<any> {
    let proyeccion = await this.rootService.post(this.route, data);
    if (proyeccion.resultado) {
      await this.rootService.bitacora('proyeccion', 'agregar', `creó la proyeccion "${proyeccion.data.id}"`, proyeccion.data);
    }
    return proyeccion;
  }

  async putProyeccion(id: number, data: any): Promise<any> {
    let proyeccion = await this.rootService.put(this.route + '/' + id, data);
    if (proyeccion.resultado) {
      await this.rootService.bitacora('proyeccion', 'editar', `editó la proyeccion "${proyeccion.data.id}"`, proyeccion.data);
    }
    return proyeccion;
  }

  async deleteProyeccion(id: number): Promise<any> {
    let proyeccion = await this.rootService.delete(this.route + '/' + id);
    if (proyeccion.resultado) {
      await this.rootService.bitacora('proyeccion', 'eliminar', `eliminó la proyeccion "${proyeccion.data.id}"`, proyeccion.data);
    }
    return proyeccion;
  }


}

