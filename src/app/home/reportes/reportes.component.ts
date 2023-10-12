import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { ReporteService } from 'src/app/services/reportes.service';
import { HomeComponent } from '../home.component';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { PrestamosGarantiasService } from 'src/app/services/prestamos_garantias.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AportesService } from 'src/app/services/aportes.service';
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  @Output() disp = new EventEmitter<any>();

  @Input()
  filtros: any = {
    codigo_departamento: '05',
    codigo_municipio: '07',
    plazo_meses: 12,
    mes: null,
  }

  @Input()
  id_reporte: number = 0;

  @Input()
  view_reporte: boolean = true;

  reportes: any = [];
  reporte: any;
  configuracion: any;

  garantias: any = [];
  disponibilidad: any = [];
  municipalidad: any;

  totales: any = {
    constitucional: 0,
    iva_paz: 0,
    total: 0
  }

  constructor(
    private ngxService: NgxUiLoaderService,
    private alert: AlertService,
    private reporteService: ReporteService,
    private configuracionesService: ConfiguracionesService,
    private municipalidadesService: MunicipalidadesService,
    private aportesService: AportesService,
    private garantiasService: GarantiasService,
    private prestamosService: PrestamosService,
    private prestamos_garantiasService: PrestamosGarantiasService,
    private amortizacionesService: AmortizacionesService
  ) {
    this.getReportes();
    this.getConfiguraciones();
  }

  getReportes() {
    this.reportes = [
      {
        id: 1, nombre: 'Disponibilidad', slug: 'disponibilidad',
        filtros: ['codigo_departamento', 'codigo_municipio', 'plazo_meses']
      },
      {
        id: 2, nombre: 'Amortizaciones', slug: 'amortizaciones',
        filtros: ['mes']
      }
    ];
  }

  async getConfiguraciones() {
    let configuraciones = await this.configuracionesService.getConfiguraciones();
    if (configuraciones) {
      this.configuracion = configuraciones[0];
    }
  }

  async setReporte() {
    for (let r = 0; r < this.reportes.length; r++) {
      if (this.reportes[r].id == this.id_reporte) {
        this.reporte = this.reportes[r];
      }
    }
  }

  filtro(filtro: string) {
    for (let r = 0; r < this.reportes.length; r++) {
      if (this.reportes[r].id == this.id_reporte) {
        for (let f = 0; f < this.reportes[r].filtros.length; f++) {
          if (this.reportes[r].filtros[f] == filtro) {
            return true;
          }
        }
      }
    }
    return false;
  }

  async imprimir() {
    for (let r = 0; r < this.reportes.length; r++) {
      if (this.reportes[r].id == this.id_reporte) {
        if (this.reportes[r].slug == 'amortizaciones') {
          await this.reporteAmortizaciones();
        }
        if (this.reportes[r].slug == 'disponibilidad') {
          await this.reporteDisponibilidad();
        }
      }
    }

    for (let g = 0; g < this.garantias.length; g++) {
      let tot = this.getTotalMontoDispTotal(this.garantias[g].prestamos, this.garantias[g].aporte);
      if (this.garantias[g].codigo == '01') {
        this.totales.constitucional = tot
      }
      if (this.garantias[g].codigo == '02') {
        this.totales.iva_paz = tot
      }
    }
    this.totales.total = this.getTotalMontoDispTotalDisponible();

    this.disp.emit(this.totales)
  }

  public async reporteDisponibilidad() {
    this.ngxService.start();
    this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
    if (this.municipalidad) {
      let aporte = await this.aportesService.getAportesDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      this.garantias = await this.garantiasService.getGarantias();
      let prestamos = await this.prestamosService.getPrestamosEstadoMunicipalidad('Acreditado', this.municipalidad.id);
      for (let i = 0; i < prestamos.length; i++) {
        let prestamos_garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(prestamos[i].id);
        prestamos[i].prestamos_garantias = prestamos_garantias
      }

      this.disponibilidad = [];

      for (let i = 0; i < this.filtros.plazo_meses; i++) {
        this.disponibilidad.push({
          mes: moment(aporte.mes).add(i + 1, 'month').format('YYYY-MM'),
        });
      }

      for (let g = 0; g < this.garantias.length; g++) {
        this.garantias[g].prestamos = [];
        if (this.garantias[g].codigo == '01') {
          this.garantias[g].aporte = aporte.constitucional * this.garantias[g].porcentaje / 100;
          this.garantias[g].aporte_total = aporte.constitucional;
        }
        if (this.garantias[g].codigo == '02') {
          this.garantias[g].aporte = aporte.iva_paz * this.garantias[g].porcentaje / 100;
          this.garantias[g].aporte_total = aporte.iva_paz
        }
        for (let p = 0; p < prestamos.length; p++) {
          for (let pg = 0; pg < prestamos[p].prestamos_garantias.length; pg++) {
            if (prestamos[p].prestamos_garantias[pg].id_garantia == this.garantias[g].id) {

              let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
              let monto_total = parseFloat(prestamos[p].prestamos_garantias[pg].monto);
              let plazo_meses = parseFloat(prestamos[p].plazo_meses);
              let intereses = parseFloat(prestamos[p].intereses);
              let fecha = prestamos[p].fecha_amortizacion;

              let proyecciones = await this.prestamosService.getProyeccion(monto_total, plazo_meses, intereses, fecha, porcentaje_iva)

              this.garantias[g].prestamos.push({
                no_prestamo: prestamos[p].no_prestamo,
                monto: prestamos[p].prestamos_garantias[pg].monto,
                proyecciones: proyecciones
              })
            }
          }
        }
      }

      let rep: any = await this.reporteService.get('disponibilidad');
      let contenido: any = document.getElementById('disponibilidad');
      contenido = contenido.innerHTML.toString();

      rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
      rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
      rep = rep.replaceAll("{{codigo_municipalidad}}", `${this.municipalidad.departamento.codigo}.${this.municipalidad.municipio.codigo}`);
      rep = rep.replaceAll("{{constitucional}}", parseFloat(aporte.constitucional).toLocaleString('en-US'));
      rep = rep.replaceAll("{{iva_paz}}", parseFloat(aporte.iva_paz).toLocaleString('en-US'));
      rep = rep.replaceAll("{{municipalidad}}", `${this.municipalidad.municipio.nombre}, ${this.municipalidad.departamento.nombre}`);
      rep = rep.replaceAll("{{contenido}}", contenido);

      let popupWin: any = window.open("", "_blank");
      popupWin.document.open();
      popupWin.document.write(rep);
      popupWin.document.close();

    } else {
      this.alert.alertMax('Transaccion Incorrecta', 'Municipalidad no encontrada', 'error');
    }
    this.ngxService.stop();
  }

  public async reporteAmortizaciones() {
    this.ngxService.start();
    let rep: any = await this.reporteService.get('amortizaciones');
    let contenido: any = document.getElementById('amortizaciones');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.mes).startOf('month').format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.mes).endOf('month').format('DD/MM/YYYY'));

    rep = rep.replaceAll("{{contenido}}", contenido);

    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();

    this.ngxService.stop();
  }

  getMontoDisp(mes: string, proyecciones: any, type: string) {
    for (let a = 0; a < proyecciones.length; a++) {
      let mes_inicio = moment(proyecciones[a].fecha_inicio).format('YYYY-MM');
      let mes_fin = moment(proyecciones[a].fecha_fin).format('YYYY-MM');
      if (mes_fin == mes) {
        if (type == 'cuota') {
          return proyecciones[a].cuota;
        }
        if (type == 'capital') {
          return proyecciones[a].capital;
        }
        if (type == 'interes') {
          return proyecciones[a].interes + proyecciones[a].iva;
        }
      }
    }
    return 0;
  }

  getMontoDispTotal(mes: string, prestamos: any, aporte: number) {
    let total = aporte;

    for (let p = 0; p < prestamos.length; p++) {
      for (let a = 0; a < prestamos[p].proyecciones.length; a++) {
        let mes_inicio = moment(prestamos[p].proyecciones[a].fecha_inicio).format('YYYY-MM');
        let mes_fin = moment(prestamos[p].proyecciones[a].fecha_fin).format('YYYY-MM');
        if (mes_fin == mes) {
          total -= prestamos[p].proyecciones[a].cuota;
        }
      }
    }
    return total;
  }

  getMontoDispTotalAporte() {
    let total = 0;
    for (let g = 0; g < this.garantias.length; g++) {
      total += this.garantias[g].aporte;
    }
    return total;
  }

  getMontoDispTotalDisponible(mes: string) {
    let total = 0;
    for (let g = 0; g < this.garantias.length; g++) {
      total += this.getMontoDispTotal(mes, this.garantias[g].prestamos, this.garantias[g].aporte)
    }
    return total;
  }

  getTotalAportes(aporte: number) {
    let total = 0;
    for (let d = 0; d < this.disponibilidad.length; d++) {
      let tot = aporte;
      total += Math.round((tot + Number.EPSILON) * 100) / 100;
    }
    return total;
  }

  getTotalMontoDisp(proyecciones: any, type: string) {
    let total = 0;
    for (let d = 0; d < this.disponibilidad.length; d++) {
      let tot = this.getMontoDisp(this.disponibilidad[d].mes, proyecciones, type);
      total += Math.round((tot + Number.EPSILON) * 100) / 100;
    }
    return total;
  }

  getTotalMontoDispTotal(prestamos: any, aporte: number) {
    let total = 0;
    for (let d = 0; d < this.disponibilidad.length; d++) {
      let tot = this.getMontoDispTotal(this.disponibilidad[d].mes, prestamos, aporte);
      total += Math.round((tot + Number.EPSILON) * 100) / 100;
    }
    return total;
  }

  getTotalMontoDispTotalAporte() {
    let total = 0;
    for (let d = 0; d < this.disponibilidad.length; d++) {
      let tot = this.getMontoDispTotalAporte();
      total += Math.round((tot + Number.EPSILON) * 100) / 100;
    }
    return total;
  }

  getTotalMontoDispTotalDisponible() {
    let total = 0;
    for (let d = 0; d < this.disponibilidad.length; d++) {
      let tot = this.getMontoDispTotalDisponible(this.disponibilidad[d].mes);
      total += Math.round((tot + Number.EPSILON) * 100) / 100;
    }
    return total;
  }

  limpiar() {
    this.filtros = {
      codigo_departamento: null,
      codigo_municipio: null,
      mes: null
    }
  }

}
