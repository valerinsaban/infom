import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  route = '/prestamos';

  constructor(
    private rootService: RootService
    ) {
  }

  getPrestamos(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getPrestamosEstado(estado: string): Promise<any> {
    return this.rootService.get(this.route + '/estado/' + estado);
  }

  getPrestamosEstadoFecha(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getCountPrestamosEstado(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/count/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getPrestamosEstadoMunicipalidad(estado: string, id_municipalidad: number): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/' + estado + '/' + id_municipalidad);
  }

  getCountPrestamosTipoPrestamoClasePrestamo(id_tipo_prestamo: number, id_clase_prestamo: number): Promise<any> {
    return this.rootService.get(this.route + '/tipo_prestamo/' + id_tipo_prestamo + '/clase_prestamo/' + id_clase_prestamo);
  }

  getCountPrestamosMunicipalidad(id_municipalidad: any): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/' + id_municipalidad);
  }

  getPrestamosFiltros(data: any): Promise<any> {
    return this.rootService.post(this.route + '/filtros', data);
  }

  getPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postPrestamo(data: any): Promise<any> {
    let prestamo = await this.rootService.post(this.route, data);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'agregar', `creó el prestamo "${prestamo.data.no_prestamo}"`, prestamo.data);
    }
    return prestamo;
  }

  async putPrestamo(id: number, data: any): Promise<any> {
    let prestamo = await this.rootService.put(this.route + '/' + id, data);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'editar', `editó el prestamo "${prestamo.data.no_prestamo}"`, prestamo.data);
    }
    return prestamo;
  }

  async deletePrestamo(id: number): Promise<any> {
    let prestamo = await this.rootService.delete(this.route + '/' + id);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'eliminar', `eliminó el prestamo "${prestamo.data.no_prestamo}"`, prestamo.data);
    }
    return prestamo;
  }

  // Otros

  getProyeccion(monto_total: number, plazo_meses: number, intereses: number, fecha: string, porcentaje_iva: number): Promise<any> {
    let proyeccion: any = [];
    let saldo_actual = monto_total;
    let fecha_i = moment(fecha).format('YYYY-MM-DD');
    let fecha_f = moment(fecha).endOf('month').format('YYYY-MM-DD');
    
    for (let p = 0; p < (plazo_meses); p++) {
      let fecha_inicio = moment(fecha_i).add(p, 'month').format('YYYY-MM-DD');
      let fecha_fin = moment(fecha_f).add(p, 'month').endOf('month').format('YYYY-MM-DD');
      if (p > 0) {
        fecha_inicio = moment(fecha_i).add(p, 'month').startOf('month').format('YYYY-MM-DD');
      }
      let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days', true) + 1;
      let capital = monto_total / plazo_meses;
      let interes = (saldo_actual * (intereses / 100) / 365) * dias;
      let iva = interes * porcentaje_iva / 100;
      let cuota = capital + interes + iva;
      let saldo = saldo_actual - capital;
      saldo_actual = saldo;

      proyeccion.push({
        fecha_inicio, fecha_fin, dias, capital, interes, iva, cuota, saldo
      });
    }

    return proyeccion;
  }


}

