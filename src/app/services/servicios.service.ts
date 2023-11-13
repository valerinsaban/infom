import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  route = '/servicios';

  constructor(
    private rootService: RootService
    ) {
  }

  getServicios(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getServiciosEstado(estado: string): Promise<any> {
    return this.rootService.get(this.route + '/estado/' + estado);
  }

  getServiciosEstadoFecha(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getCountServiciosFecha(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/count/fecha/' + fecha_inicio + '/' + fecha_fin);
  }

  getCountServiciosEstado(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/count/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getServiciosEstadoMunicipalidad(estado: string, id_municipalidad: number): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/' + estado + '/' + id_municipalidad);
  }

  getServiciosEstadoPrograma(estado: string, id_programa: number): Promise<any> {
    return this.rootService.get(this.route + '/programa/' + estado + '/' + id_programa);
  }

  getServiciosEstadoMunicipalidadPrograma(estado: string, id_municipalidad: number, id_programa: number): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/programa/' + estado + '/' + id_municipalidad + '/' + id_programa);
  }

  getCountServiciosTipoServicioPrograma(id_tipo_servicio: number, id_programa: number, fecha_inicio: string , fecha_fin: string): Promise<any> {
    return this.rootService.get(this.route + '/tipo_servicio/' + id_tipo_servicio + '/programa/' + id_programa + '/rango/' + fecha_inicio + '/' + fecha_fin);
  }

  getCountServiciosMunicipalidad(id_municipalidad: any): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/' + id_municipalidad);
  }

  getServiciosFiltros(data: any): Promise<any> {
    return this.rootService.post(this.route + '/filtros', data);
  }

  getServicio(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postServicio(data: any): Promise<any> {
    let servicio = await this.rootService.post(this.route, data);
    if (servicio.resultado) {
      await this.rootService.bitacora('servicio', 'agregar', `creó el servicio "${servicio.data.no_servicio}"`, servicio.data);
    }
    return servicio;
  }

  async putServicio(id: number, data: any): Promise<any> {
    let servicio = await this.rootService.put(this.route + '/' + id, data);
    if (servicio.resultado) {
      await this.rootService.bitacora('servicio', 'editar', `editó el servicio "${servicio.data.no_servicio}"`, servicio.data);
    }
    return servicio;
  }

  async deleteServicio(id: number): Promise<any> {
    let servicio = await this.rootService.delete(this.route + '/' + id);
    if (servicio.resultado) {
      await this.rootService.bitacora('servicio', 'eliminar', `eliminó el servicio "${servicio.data.no_servicio}"`, servicio.data);
    }
    return servicio;
  }

  // Otros

  getProyeccion(monto_total: number, plazo_meses: number, intereses: number, fecha: string, porcentaje_iva: number): Promise<any> {
    let proyeccion: any = [];
    let saldo = monto_total;
    let fecha_i = moment(fecha).format('YYYY-MM-DD');
    let fecha_f = moment(fecha).endOf('month').format('YYYY-MM-DD');
    
    for (let p = 0; p < (plazo_meses); p++) {
      let mes = moment(fecha).add(p, 'month').format('YYYY-MM');

      let saldo_inicial = saldo;
      let fecha_inicio = moment(fecha_i).add(p, 'month').format('YYYY-MM-DD');
      let fecha_fin = moment(fecha_f).add(p, 'month').endOf('month').format('YYYY-MM-DD');
      if (p > 0) {
        fecha_inicio = moment(fecha_i).add(p, 'month').startOf('month').format('YYYY-MM-DD');
      }
      let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days', true) + 1;
      let capital = monto_total / plazo_meses;
      let interes = (saldo * (intereses / 100) / 365) * dias;
      interes = Math.round((interes + Number.EPSILON) * 100) / 100;
      let iva = interes * porcentaje_iva / 100;
      iva = Math.round((iva + Number.EPSILON) * 100) / 100;

      let cuota = capital + interes + iva;
      let saldo_final = saldo - capital;
      saldo = saldo_final;

      proyeccion.push({
        mes, fecha_inicio, fecha_fin, dias, saldo_inicial, capital, interes, iva, cuota, saldo_final
      });
    }

    return proyeccion;
  }


}

