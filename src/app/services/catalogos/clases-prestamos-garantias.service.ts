import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class ClasesPrestamosGarantiasService {

  constructor(private rootService: RootService) { }

  route = '/clases_prestamos_garantias';

  getClasesPrestamosGarantias(id_clase_prestamo: number): Promise<any> {
    return this.rootService.get(this.route + '/clase_prestamo/' + id_clase_prestamo);
  }

  async postClasePrestamoGarantia(data: any): Promise<any> {
    let clase_prestamo_garantia = await this.rootService.post(this.route, data);
    if (clase_prestamo_garantia.resultado) {
      await this.rootService.bitacora('clase_prestamo_garantia', 'agregar', `creó la clase_prestamo_garantia "${clase_prestamo_garantia.data.nombre}"`, clase_prestamo_garantia.data);
    }
    return clase_prestamo_garantia;
  }

  async putClasePrestamoGarantia(id: number, data: any): Promise<any> {
    let clase_prestamo_garantia = await this.rootService.put(this.route + '/' + id, data);
    if (clase_prestamo_garantia.resultado) {
      await this.rootService.bitacora('clase_prestamo_garantia', 'editar', `editó la clase_prestamo_garantia "${clase_prestamo_garantia.data.nombre}"`, clase_prestamo_garantia.data);
    }
    return clase_prestamo_garantia;
  }

  async deleteClasePrestamoGarantia(id: number): Promise<any> {
    let clase_prestamo_garantia = await this.rootService.delete(this.route + '/' + id);
    if (clase_prestamo_garantia.resultado) {
      await this.rootService.bitacora('clase_prestamo_garantia', 'eliminar', `eliminó la clase_prestamo_garantia "${clase_prestamo_garantia.data.nombre}"`, clase_prestamo_garantia.data);
    }
    return clase_prestamo_garantia;
  }
}
