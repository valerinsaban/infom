import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamosGarantiasService {

  constructor(private rootService: RootService) {
  }

  route = '/prestamos_garantias';

  getPrestamoGarantiaPrestamo(id_prestamo: number): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id_prestamo);
  }

  async postPrestamoGarantia(data: any): Promise<any> {
    let prestamo = await this.rootService.post(this.route, data);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo_garantia', 'agregar', `creó el prestamo garantia "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }

  async putPrestamoGarantia(id: number, data: any): Promise<any> {
    let prestamo = await this.rootService.put(this.route + '/' + id, data);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo_garantia', 'editar', `editó el prestamo garantia "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }

  async deletePrestamoGarantia(id: number): Promise<any> {
    let prestamo = await this.rootService.delete(this.route + '/' + id);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo_garantia', 'eliminar', `eliminó el prestamo garantia "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }


}

