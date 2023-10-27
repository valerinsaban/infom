import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class DestinoPrestamosService {

  constructor(private rootService: RootService) {
  }

  route = '/destinos_prestamos';

  getDestinoPrestamos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getDestinoPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getDestinosPrestamosPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id);
  }

  async postDestinoPrestamo(data: any): Promise<any> {
    let destino_prestamo = await this.rootService.post(this.route, data);
    if (destino_prestamo.resultado) {
      await this.rootService.bitacora('destino_prestamo', 'agregar', `creó el destino_prestamo "${destino_prestamo.data.nombre}"`, destino_prestamo.data);
    }
    return destino_prestamo;
  }

  async putDestinoPrestamo(id: number, data: any): Promise<any> {
    let destino_prestamo = await this.rootService.put(this.route + '/' + id, data);
    if (destino_prestamo.resultado) {
      await this.rootService.bitacora('destino_prestamo', 'editar', `editó el destino_prestamo "${destino_prestamo.data.nombre}"`, destino_prestamo.data);
    }
    return destino_prestamo;
  }

  async deleteDestinoPrestamo(id: number): Promise<any> {
    let destino_prestamo = await this.rootService.delete(this.route + '/' + id);
    if (destino_prestamo.resultado) {
      await this.rootService.bitacora('destino_prestamo', 'eliminar', `eliminó el destino_prestamo "${destino_prestamo.data.nombre}"`, destino_prestamo.data);
    }
    return destino_prestamo;
  }
}
