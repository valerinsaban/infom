import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  constructor(private rootService: RootService) {
  }

  route = '/prestamos';

  getPrestamos(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getPrestamosEstado(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getCountPrestamosEstado(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/count/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getPrestamosEstadoMunicipalidad(estado: string, id_municipalidad: any): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/' + estado + '/' + id_municipalidad);
  }

  getPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getProyeccion(monto_total: number, plazo_meses: number, intereses: number, fecha: string, amortizaciones: any): Promise<any> {
    let cant_amor = amortizaciones.length;
    let saldo_actual = monto_total;

    let fecha_i = moment(fecha).startOf('month').format('YYYY-MM-DD');
    let fecha_f = moment(fecha).endOf('month').format('YYYY-MM-DD');
    
    if (cant_amor) {
      fecha_i = moment(amortizaciones[amortizaciones.length - 1].fecha_fin).add(1, 'day').subtract(1, 'month').format('YYYY-MM-DD');
      fecha_f = moment(amortizaciones[amortizaciones.length - 1].fecha_fin).format('YYYY-MM-DD');
    }

    if (cant_amor) {
      saldo_actual = amortizaciones[cant_amor - 1].saldo;
    }
    
    for (let p = 0; p < (plazo_meses - cant_amor); p++) {
      let fecha_inicio = moment(fecha_i).add(p + 1, 'month').format('YYYY-MM-DD');
      let fecha_fin = moment(fecha_f).add(p + 1, 'month').format('YYYY-MM-DD');
      if (moment(fecha_inicio).format('DD') == '01' && moment(fecha_fin).format('DD') > '28') {
        fecha_fin = moment(fecha_f).add(p + 1, 'month').endOf('month').format('YYYY-MM-DD');
      }
      let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days', true) + 1;
      let capital = monto_total / plazo_meses;
      let interes = (saldo_actual * (intereses / 100) / 365) * dias;
      let iva = interes * 0.12;
      let cuota = capital + interes + iva;
      let saldo = saldo_actual - capital;
      saldo_actual = saldo;

      amortizaciones.push({
        fecha_inicio, fecha_fin, dias, capital, interes, iva, cuota, saldo
      });
    }

    return amortizaciones;
  }

  async postPrestamo(data: any): Promise<any> {
    let prestamo = await this.rootService.post(this.route, data);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'agregar', `creó el prestamo "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }

  async putPrestamo(id: number, data: any): Promise<any> {
    let prestamo = await this.rootService.put(this.route + '/' + id, data);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'editar', `editó el prestamo "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }

  async deletePrestamo(id: number): Promise<any> {
    let prestamo = await this.rootService.delete(this.route + '/' + id);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'eliminar', `eliminó el prestamo "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }


}

