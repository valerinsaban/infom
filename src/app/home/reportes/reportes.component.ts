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
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import { AlertService } from 'src/app/services/alert.service';
import { CobrosService } from 'src/app/services/cobros.service';
import { ProgramasService } from 'src/app/services/catalogos/programas.service';
import { PuestosService } from 'src/app/services/catalogos/puestos.service';
import { PartidosPoliticosService } from 'src/app/services/catalogos/partidos-politicos.service';
import { RegionalesService } from 'src/app/services/catalogos/regionales.service';
import { RegionesService } from 'src/app/services/catalogos/regiones.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';
import { TiposPrestamosService } from 'src/app/services/catalogos/tipos-prestamos.service';
import { EstadosCivilesService } from 'src/app/services/catalogos/estados-civiles.service';
import { ProfesionesService } from 'src/app/services/catalogos/profesiones.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { BancosService } from 'src/app/services/catalogos/bancos.service';
import { DestinosService } from 'src/app/services/catalogos/destinos.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  @Output() disp = new EventEmitter<any>();

  @Input()
  filtros: any = {
    codigo_departamento: '',
    codigo_municipio: '',
    plazo_meses: '',
    mes: null,
  }

  @Input()
  id_reporte: number = 0;

  @Input()
  view_reporte: boolean = true;

  reportes: any = [];
  reporte: any;

  garantias: any = [];
  disponibilidad: any = [];
  municipalidad: any;

  puestos: any = [];
  partidos: any = [];
  regionales: any = [];
  regiones: any = [];
  municipios: any = [];
  tiposPrestamos: any = [];
  estadosCiviles: any = [];
  profesiones: any = [];
  departamentos: any = [];
  bancos: any = [];
  destinos: any = [];

  programas: any = [];

  totales: any = {
    constitucional: 0,
    iva_paz: 0,
    total: 0
  }

  meses: any;

  constructor(
    private ngxService: NgxUiLoaderService,
    private alert: AlertService,
    private reporteService: ReporteService,
    private municipalidadesService: MunicipalidadesService,
    private aportesService: AportesService,
    private garantiasService: GarantiasService,
    private prestamosService: PrestamosService,
    private prestamos_garantiasService: PrestamosGarantiasService,
    private amortizacionesService: AmortizacionesService,
    private cobrosService: CobrosService,
    private programasService: ProgramasService,
    private puestosService: PuestosService,
    private partidosService: PartidosPoliticosService,
    private regionalesService: RegionalesService,
    private regionesService: RegionesService,
    private municipiosService: MunicipiosService,
    private tiposPrestamosService: TiposPrestamosService,
    private estadosCivilesService: EstadosCivilesService,
    private profesionesService: ProfesionesService,
    private departamentosService: DepartamentosService,
    private bancosService: BancosService,
    private destinosService: DestinosService
  ) {
    this.getReportes();
  }

  get configuracion() {
    return HomeComponent.configuracion;
  }

  getReportes() {
    this.reportes = [
      {
        id: 1, nombre: 'Catalogo Puestos', slug: 'cat-puestos', filtros: []
      },
      {
        id: 2, nombre: 'Catalogo Partidos Politicos', slug: 'cat-partidos', filtros: []
      },
      {
        id: 3, nombre: 'Catalogo Regionales', slug: 'cat-regionales', filtros: []
      },
      {
        id: 4, nombre: 'Catalogo Regiones', slug: 'cat-regiones', filtros: []
      },
      {
        id: 5, nombre: 'Catalogo Garantias', slug: 'cat-garantias', filtros: []
      },
      {
        id: 6, nombre: 'Catalogo Municipios', slug: 'cat-municipios', filtros: []
      },
      {
        id: 7, nombre: 'Catalogo Tipos Prestamos', slug: 'cat-tipos-prestamos', filtros: []
      },

      {
        id: 8, nombre: 'Catalogo Estados Civiles', slug: 'cat-estados-civiles', filtros: []
      },

      {
        id: 9, nombre: 'Catalogo Programas', slug: 'cat-programas', filtros: []
      },

      {
        id: 10, nombre: 'Catalogo Profesiones', slug: 'cat-profesiones', filtros: []
      },

      {
        id: 11, nombre: 'Catalogo Departamentos', slug: 'cat-departamentos', filtros: []
      },

      {
        id: 12, nombre: 'Catalogo Bancos', slug: 'cat-bancos', filtros: []
      },

      {
        id: 13, nombre: 'Catalogo Destinos', slug: 'cat-destinos', filtros: []
      },

      {
        id: 14, nombre: 'Disponibilidad General', slug: 'disponibilidad-general', filtros: []
      },
      {
        id: 100, nombre: 'Disponibilidad', slug: 'disponibilidad',
        filtros: ['codigo_departamento', 'codigo_municipio', 'plazo_meses']
      },

      {
        id: 15, nombre: 'Creditos Analizados', slug: 'creditos-analizados', filtros: []
      },

      {
        id: 16, nombre: 'Situado Constitucional', slug: 'situado-constitucional', filtros: []
      },

      {
        id: 17, nombre: 'Datos Bancarios', slug: 'datos-bancarios', filtros: []
      },
      
      {
        id: 200, nombre: 'Amortizaciones', slug: 'amortizaciones',
        filtros: ['mes']
      }
    ];
  }

  async setReporte() {
    for (let r = 0; r < this.reportes.length; r++) {
      if (this.reportes[r].id == this.id_reporte) {
        this.reporte = this.reportes[r];

        let mes_inicio = moment();
        let mes_fin = moment(this.configuracion.periodo_fin + '-01');
        let diff_meses: any = mes_fin.diff(mes_inicio, 'months', true) + 1;
        this.meses = parseInt(diff_meses);
        this.filtros.plazo_meses = this.meses;

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

  async imprimir(print: boolean = true) {
    for (let r = 0; r < this.reportes.length; r++) {
      if (this.reportes[r].id == this.id_reporte) {
        if (this.reportes[r].slug == 'cat-puestos') {
          await this.reporteCatPuestos(print);
        }

        if (this.reportes[r].slug == 'cat-partidos') {
          await this.reporteCatPartidos(print);
        }

        if (this.reportes[r].slug == 'cat-regionales') {
          await this.reporteCatRegionales(print);
        }

        if (this.reportes[r].slug == 'cat-regiones') {
          await this.reporteCatRegiones(print);
        }

        if (this.reportes[r].slug == 'cat-garantias') {
          await this.reporteCatGarantias(print);
        }

        if (this.reportes[r].slug == 'cat-municipios') {
          await this.reporteCatMunicipios(print);
        }

        if (this.reportes[r].slug == 'cat-tipos-prestamos') {
          await this.reporteCatTiposPrestamos(print);
        }

        if (this.reportes[r].slug == 'cat-estados-civiles') {
          await this.reporteCatEstadosCiviles(print);
        }

        if (this.reportes[r].slug == 'cat-programas') {
          await this.reporteCatProgramas(print);
        }

        if (this.reportes[r].slug == 'cat-profesiones') {
          await this.reporteCatProfesiones(print);
        }

        if (this.reportes[r].slug == 'cat-departamentos') {
          await this.reporteCatDepartamentos(print);
        }

        if (this.reportes[r].slug == 'cat-bancos') {
          await this.reporteCatBancos(print);
        }

        if (this.reportes[r].slug == 'cat-destinos') {
          await this.reporteCatDestinos(print);
        }

        if (this.reportes[r].slug == 'disponibilidad-general') {
          await this.reporteDisponibilidadMunicipal(print);
        }

        if (this.reportes[r].slug == 'creditos-analizados') {
          await this.reporteCreditosAnalizados(print);
        }

        if (this.reportes[r].slug == 'situado-constitucional') {
          await this.reporteSituadoConstitucional(print);
        }

        if (this.reportes[r].slug == 'datos-bancarios') {
          await this.reporteDatosBancarios(print);
        }

        if (this.reportes[r].slug == 'disponibilidad') {
          await this.reporteDisponibilidad(print);
        }
        if (this.reportes[r].slug == 'amortizaciones') {
          await this.reporteAmortizaciones(print);
        }
      }
    }

    for (let g = 0; g < this.garantias.length; g++) {
      let tot = this.getTotalMontoDispTotal(this.garantias[g].prestamos, this.garantias[g].aporte);
      if (this.garantias[g].id == 1) {
        this.totales.constitucional = tot
      }
      if (this.garantias[g].id == 2) {
        this.totales.iva_paz = tot
      }
    }
    this.totales.total = this.getTotalMontoDispTotalDisponible();

    this.disp.emit(this.totales)
  }

  public async reporteCatPuestos(print: boolean = true) {
    this.ngxService.start();

    let puestos = await this.puestosService.getPuestos();
    this.puestos = puestos;

    this.catalogo('cat-puestos', print)

    this.ngxService.stop();
  }

  public async reporteCatPartidos(print: boolean = true) {
    this.ngxService.start();

    let partidos = await this.partidosService.getPartidosPoliticos();
    this.partidos = partidos;

    this.catalogo('cat-partidos', print)

    this.ngxService.stop();
  }

  public async reporteCatRegionales(print: boolean = true) {
    this.ngxService.start();

    let regionales = await this.regionalesService.getRegionales();
    this.regionales = regionales;

    this.catalogo('cat-regionales', print)

    this.ngxService.stop();
  }

  public async reporteCatRegiones(print: boolean = true) {
    this.ngxService.start();

    let regiones = await this.regionesService.getRegiones();
    this.regiones = regiones;

    this.catalogo('cat-regiones', print)

    this.ngxService.stop();
  }
  
  public async reporteCatGarantias(print: boolean = true) {
    this.ngxService.start();

    let garantias = await this.garantiasService.getGarantias();
    this.garantias = garantias;

    this.catalogo('cat-garantias', print)

    this.ngxService.stop();
  }

  public async reporteCatMunicipios(print: boolean = true) {
    this.ngxService.start();

    let municipios = await this.municipiosService.getMunicipios();
    this.municipios = municipios;

    this.catalogo('cat-municipios', print)

    this.ngxService.stop();
  }

  public async reporteCatTiposPrestamos(print: boolean = true) {
    this.ngxService.start();

    let tiposPrestamos = await this.tiposPrestamosService.getTiposPrestamos();
    this.tiposPrestamos = tiposPrestamos;

    this.catalogo('cat-tipos-prestamos', print)

    this.ngxService.stop();
  }

  public async reporteCatEstadosCiviles(print: boolean = true) {
    this.ngxService.start();

    let estadosCiviles = await this.estadosCivilesService.getEstadosCiviles();
    this.estadosCiviles = estadosCiviles;

    this.catalogo('cat-estados-civiles', print)

    this.ngxService.stop();
  }

  public async reporteCatProgramas(print: boolean = true) {
    this.ngxService.start();

    let programas = await this.programasService.getProgramas();
    this.programas = programas;

    this.catalogo('cat-programas', print)

    this.ngxService.stop();
  }

  public async reporteCatProfesiones(print: boolean = true) {
    this.ngxService.start();

    let profesiones = await this.profesionesService.getProfesiones();
    this.profesiones = profesiones;

    this.catalogo('cat-profesiones', print)

    this.ngxService.stop();
  }

  public async reporteCatDepartamentos(print: boolean = true) {
    this.ngxService.start();

    let departamentos = await this.departamentosService.getDepartamentos();
    this.departamentos = departamentos;

    this.catalogo('cat-departamentos', print)

    this.ngxService.stop();
  }

  public async reporteCatBancos(print: boolean = true) {
    this.ngxService.start();

    let bancos = await this.bancosService.getBancos();
    this.bancos = bancos;

    this.catalogo('cat-bancos', print)

    this.ngxService.stop();
  }

  public async reporteCatDestinos(print: boolean = true) {
    this.ngxService.start();

    let destinos = await this.destinosService.getDestinos();
    this.destinos = destinos;

    this.catalogo('cat-destinos', print)

    this.ngxService.stop();
  }
  public async reporteDisponibilidadMunicipal(print: boolean = true) {
    this.ngxService.start();

    this.catalogo('disponibilidad-general', print)

    this.ngxService.stop();
  }

  public async reporteCreditosAnalizados(print: boolean = true) {
    this.ngxService.start();

    this.catalogo('creditos-analizados', print)

    this.ngxService.stop();
  }

  public async reporteSituadoConstitucional(print: boolean = true) {
    this.ngxService.start();

    this.catalogo('situado-constitucional', print)

    this.ngxService.stop();
  }
  
  public async reporteDatosBancarios(print: boolean = true) {
    this.ngxService.start();

    this.catalogo('datos-bancarios', print)

    this.ngxService.stop();
  }

  public async reporteDisponibilidad(print: boolean = true) {
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

      // let total_hojas = Math.ceil(this.filtros.plazo_meses / 12);
      // let hojas: any = [];
      // let restantes = this.filtros.plazo_meses;
      // for (let t = 0; t < total_hojas; t++) {
      //   hojas.push({ disponibilidad: [], garantias: this.garantias });
      //   for (let i = 0; i < 12; i++) {
      //     hojas[t].disponibilidad.push({
      //       mes: moment(aporte.mes).add(i + 1, 'month').add(t, 'year').format('YYYY-MM'),
      //     })
      //   }
      //   restantes = restantes - 12;
      // }


      this.disponibilidad = [];
      for (let i = 0; i < this.filtros.plazo_meses; i++) {
        this.disponibilidad.push({
          mes: moment(aporte.mes).add(i + 1, 'month').format('YYYY-MM'),
        });
      }


      for (let g = 0; g < this.garantias.length; g++) {
        this.garantias[g].prestamos = [];
        if (this.garantias[g].id == 1) {
          this.garantias[g].aporte = aporte.constitucional * this.garantias[g].porcentaje / 100;
          this.garantias[g].aporte_total = aporte.constitucional;
        }
        if (this.garantias[g].id == 2) {
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
      let contenido: any = document.getElementById('rep_disponibilidad');
      contenido = contenido.innerHTML.toString();

      rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
      rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
      rep = rep.replaceAll("{{codigo_municipalidad}}", `${this.municipalidad.departamento.codigo}.${this.municipalidad.municipio.codigo}`);
      rep = rep.replaceAll("{{constitucional}}", parseFloat(aporte.constitucional).toLocaleString('en-US'));
      rep = rep.replaceAll("{{iva_paz}}", parseFloat(aporte.iva_paz).toLocaleString('en-US'));
      rep = rep.replaceAll("{{municipalidad}}", `${this.municipalidad.municipio.nombre}, ${this.municipalidad.departamento.nombre}`);
      rep = rep.replaceAll("{{contenido}}", contenido);

      if (print) {
        let popupWin: any = window.open("", "_blank");
        popupWin.document.open();
        popupWin.document.write(rep);
        popupWin.document.close();
      }

    } else {
      this.alert.alertMax('Transaccion Incorrecta', 'Municipalidad no encontrada', 'error');
    }
    this.ngxService.stop();
  }

  public async reporteAmortizaciones(print: boolean = true) {
    this.ngxService.start();

    let programas = await this.programasService.getProgramas();
    this.programas = programas;

    // let municipalidades = await this.municipalidadesService.getMunicipalidades();


    let cobro = await this.cobrosService.getCobroMes(this.filtros.mes);
    if (cobro) {
      let amortizaciones = await this.amortizacionesService.getAmortizacionesCobro(cobro.id);
      console.log(amortizaciones);

    }


    let rep: any = await this.reporteService.get('amortizaciones');
    let contenido: any = document.getElementById('rep_amortizaciones');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.mes).startOf('month').format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.mes).endOf('month').format('DD/MM/YYYY'));

    rep = rep.replaceAll("{{contenido}}", contenido);

    if (print) {
      let popupWin: any = window.open("", "_blank");
      popupWin.document.open();
      popupWin.document.write(rep);
      popupWin.document.close();
    }

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

  print(rep: any) {
    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();
  }

  async catalogo(slug: any, print: any) {
    let rep: any = await this.reporteService.get(slug);
    let contenido: any = document.getElementById(slug);
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);

    rep = rep.replaceAll("{{contenido}}", contenido);

    if (print) {
      this.print(rep)
    }
  }

  limpiar() {
    this.filtros = {
      codigo_departamento: null,
      codigo_municipio: null,
      mes: null
    }
  }

}
