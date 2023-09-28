import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class ClasesPrestamosService {

  constructor(private rootService: RootService) { }

  route = '/clases_prestamos';

  getClasesPrestamos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getClasePrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postClasePrestamo(data: any): Promise<any> {
    let clase_prestamo = await this.rootService.post(this.route, data);
    if (clase_prestamo.resultado) {
      await this.rootService.bitacora('clase_prestamo', 'agregar', `creó la clase_prestamo "${clase_prestamo.data.nombre}"`, clase_prestamo.data);
    }
    return clase_prestamo;
  }

  async putClasePrestamo(id: number, data: any): Promise<any> {
    let clase_prestamo = await this.rootService.put(this.route + '/' + id, data);
    if (clase_prestamo.resultado) {
      await this.rootService.bitacora('clase_prestamo', 'editar', `editó la clase_prestamo "${clase_prestamo.data.nombre}"`, clase_prestamo.data);
    }
    return clase_prestamo;
  }

  async deleteClasePrestamo(id: number): Promise<any> {
    let clase_prestamo = await this.rootService.delete(this.route + '/' + id);
    if (clase_prestamo.resultado) {
      await this.rootService.bitacora('clase_prestamo', 'eliminar', `eliminó la clase_prestamo "${clase_prestamo.data.nombre}"`, clase_prestamo.data);
    }
    return clase_prestamo;
  }
}
