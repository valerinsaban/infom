import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class TiposPrestamosGarantiasService {

  constructor(private rootService: RootService) { }

  route = '/tipos_prestamos_garantias';

  getTiposPrestamosGarantias(id_tipo_prestamo: number): Promise<any> {
    return this.rootService.get(this.route + '/tipo_prestamo/' + id_tipo_prestamo);
  }

  async postTipoPrestamoGarantia(data: any): Promise<any> {
    let tipo_prestamo_garantia = await this.rootService.post(this.route, data);
    if (tipo_prestamo_garantia.resultado) {
      await this.rootService.bitacora('tipo_prestamo_garantia', 'agregar', `creó el tipo_prestamo_garantia "${tipo_prestamo_garantia.data.nombre}"`, tipo_prestamo_garantia.data);
    }
    return tipo_prestamo_garantia;
  }

  async putTipoPrestamoGarantia(id: number, data: any): Promise<any> {
    let tipo_prestamo_garantia = await this.rootService.put(this.route + '/' + id, data);
    if (tipo_prestamo_garantia.resultado) {
      await this.rootService.bitacora('tipo_prestamo_garantia', 'editar', `editó el tipo_prestamo_garantia "${tipo_prestamo_garantia.data.nombre}"`, tipo_prestamo_garantia.data);
    }
    return tipo_prestamo_garantia;
  }

  async deleteTipoPrestamoGarantia(id: number): Promise<any> {
    let tipo_prestamo_garantia = await this.rootService.delete(this.route + '/' + id);
    if (tipo_prestamo_garantia.resultado) {
      await this.rootService.bitacora('tipo_prestamo_garantia', 'eliminar', `eliminó el tipo_prestamo_garantia "${tipo_prestamo_garantia.data.nombre}"`, tipo_prestamo_garantia.data);
    }
    return tipo_prestamo_garantia;
  }
}
