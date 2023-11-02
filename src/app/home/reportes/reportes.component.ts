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
    codigo_departamento: '05',
    codigo_municipio: '07',
    plazo_meses: 18,
    mes: null,
    mes_inicio: null,
    mes_fin: null
  }

  @Input()
  slug_reporte: any = 'disponibilidad';

  @Input()
  view_reporte: boolean = true;

  reportes_catalogos: any = [];
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

  aportes: any = [];

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
    this.reportes_catalogos = [
      { slug: 'cat-puestos', nombre: 'Catalogo Puestos' },
      { slug: 'cat-partidos', nombre: 'Catalogo Partidos Politicos' },
      { slug: 'cat-regionales', nombre: 'Catalogo Regionales' },
      { slug: 'cat-regiones', nombre: 'Catalogo Regiones' },
      { slug: 'cat-garantias', nombre: 'Catalogo Garantias' },
      { slug: 'cat-municipios', nombre: 'Catalogo Municipios' },
      { slug: 'cat-tipos-prestamos', nombre: 'Catalogo Tipos Prestamos' },
      { slug: 'cat-estados-civiles', nombre: 'Catalogo Estados Civiles' },
      { slug: 'cat-programas', nombre: 'Catalogo Programas' },
      { slug: 'cat-profesiones', nombre: 'Catalogo Profesiones' },
      { slug: 'cat-departamentos', nombre: 'Catalogo Departamentos' },
      { slug: 'cat-bancos', nombre: 'Catalogo Bancos' },
      { slug: 'cat-destinos', nombre: 'Catalogo Destinos' }
    ];
    this.reportes = [
      { slug: 'disponibilidad', nombre: 'Reporte Disponibilidad', filtros: ['codigo_departamento', 'codigo_municipio', 'plazo_meses'] },
      { slug: 'disponibilidad-general', nombre: 'Reporte Disponibilidad General', filtros: ['plazo_meses'] },
      { slug: 'situado-constitucional', nombre: 'Reporte Situado Constitucional', filtros: ['mes_inicio', 'mes_fin'] },
      { slug: 'datos-bancarios', nombre: 'Reporte Datos Bancarios', filtros: ['codigo_departamento', 'codigo_municipio'] },
      { slug: 'creditos-analizados', nombre: 'Reporte Creditos Analizados', filtros: [] },
      { slug: 'intereses-dev-no-percibios', nombre: 'Reporte Intereses Devengados no Percibidos', filtros: ['mes'] },
      { slug: 'prestamos-otorgados', nombre: 'Prestamos Otorgados', filtros: [] },
      { slug: 'recibo', nombre: 'Recibo', filtros: [] },
      { slug: 'recibos-emitidos', nombre: 'Recibos Emitidos', filtros: ['fecha_inicio', 'fecha_fin'] },
      { slug: 'libro-ventas', nombre: 'Libro de Ventas', filtros: ['fecha_inicio', 'fecha_fin'] },
      { slug: 'amortizaciones-prestamos', nombre: 'Amortizaciones a Prestamos', filtros: ['mes', 'fecha'] },
      { slug: 'confirmacion-saldos', nombre: 'Confirmacion de Saldos', filtros: [] },
      { slug: 'asignaciones', nombre: 'Reporte de asignaciones, cobros y disponibilidad', filtros: [] },
      { slug: 'cur', nombre: 'Auxiliar para generacion de CUR de Ingresos', filtros: [] },
    ];
  }

  async setReporte() {
    for (let r = 0; r < this.reportes.length; r++) {
      if (this.reportes[r].slug == this.slug_reporte) {
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
      if (this.reportes[r].slug == this.slug_reporte) {
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

    // Catalogos
    if (this.slug_reporte == 'cat-puestos') {
      await this.reporteCatPuestos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-partidos') {
      await this.reporteCatPartidos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-regionales') {
      await this.reporteCatRegionales(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-regiones') {
      await this.reporteCatRegiones(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-garantias') {
      await this.reporteCatGarantias(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-municipios') {
      await this.reporteCatMunicipios(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-tipos-prestamos') {
      await this.reporteCatTiposPrestamos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-estados-civiles') {
      await this.reporteCatEstadosCiviles(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-programas') {
      await this.reporteCatProgramas(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-profesiones') {
      await this.reporteCatProfesiones(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-departamentos') {
      await this.reporteCatDepartamentos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-bancos') {
      await this.reporteCatBancos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cat-destinos') {
      await this.reporteCatDestinos(this.slug_reporte, print);
    }

    // Reportes
    if (this.slug_reporte == 'disponibilidad') {
      await this.reporteDisponibilidad(this.slug_reporte, print);

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
    
    if (this.slug_reporte == 'disponibilidad-general') {
      await this.reporteDisponibilidadGeneral(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'creditos-analizados') {
      await this.reporteCreditosAnalizados(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'situado-constitucional') {
      await this.reporteSituadoConstitucional(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'datos-bancarios') {
      await this.reporteDatosBancarios(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'intereses-dev-no-percibios') {
      await this.reporteAmortizaciones(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'prestamos-otorgados') {
      await this.reportePrestamosOtorgados(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'recibo') {
      await this.reporteRecibo(this.slug_reporte, print);
    }
    
    if (this.slug_reporte == 'recibos-emitidos') {
      await this.reporteRecibosEmitidos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'libro-ventas') {
      await this.reporteLibroVentas(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'amortizaciones-prestamos') {
      await this.reporteAmortizacionesPrestamos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'confirmacion-saldos') {
      await this.reporteConfirmacionSaldos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'asignaciones') {
      await this.reporteAsignaciones(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cur') {
      await this.reporteCUR(this.slug_reporte, print);
    }
  }

  // Catalogos

  public async reporteCatPuestos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let puestos = await this.puestosService.getPuestos();
    this.puestos = puestos;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatPartidos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let partidos = await this.partidosService.getPartidosPoliticos();
    this.partidos = partidos;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatRegionales(slug: any, print: boolean = true) {
    this.ngxService.start();

    let regionales = await this.regionalesService.getRegionales();
    this.regionales = regionales;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatRegiones(slug: any, print: boolean = true) {
    this.ngxService.start();

    let regiones = await this.regionesService.getRegiones();
    this.regiones = regiones;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatGarantias(slug: any, print: boolean = true) {
    this.ngxService.start();

    let garantias = await this.garantiasService.getGarantias();
    this.garantias = garantias;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatMunicipios(slug: any, print: boolean = true) {
    this.ngxService.start();

    let municipios = await this.municipiosService.getMunicipios();
    this.municipios = municipios;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatTiposPrestamos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let tiposPrestamos = await this.tiposPrestamosService.getTiposPrestamos();
    this.tiposPrestamos = tiposPrestamos;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatEstadosCiviles(slug: any, print: boolean = true) {
    this.ngxService.start();

    let estadosCiviles = await this.estadosCivilesService.getEstadosCiviles();
    this.estadosCiviles = estadosCiviles;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatProgramas(slug: any, print: boolean = true) {
    this.ngxService.start();

    let programas = await this.programasService.getProgramas();
    this.programas = programas;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatProfesiones(slug: any, print: boolean = true) {
    this.ngxService.start();

    let profesiones = await this.profesionesService.getProfesiones();
    this.profesiones = profesiones;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatDepartamentos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let departamentos = await this.departamentosService.getDepartamentos();
    this.departamentos = departamentos;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatBancos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let bancos = await this.bancosService.getBancos();
    this.bancos = bancos;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCatDestinos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let destinos = await this.destinosService.getDestinos();
    this.destinos = destinos;

    let rep: any = await this.reporteService.get('catalogos/' + slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  // Reportes

  public async reporteDisponibilidadGeneral(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteDisponibilidad(slug: any, print: boolean = true) {
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

      let total_hojas = Math.ceil(this.filtros.plazo_meses / 12);
      console.log(total_hojas);
      
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

      let rep: any = await this.reporteService.get(slug);
      rep = rep.replaceAll("{{codigo_municipalidad}}", `${this.municipalidad.departamento.codigo}.${this.municipalidad.municipio.codigo}`);
      rep = rep.replaceAll("{{constitucional}}", parseFloat(aporte.constitucional).toLocaleString('en-US'));
      rep = rep.replaceAll("{{iva_paz}}", parseFloat(aporte.iva_paz).toLocaleString('en-US'));
      rep = rep.replaceAll("{{municipalidad}}", `${this.municipalidad.municipio.nombre}, ${this.municipalidad.departamento.nombre}`);

      this.catalogo(rep, slug, print)

    } else {
      this.alert.alertMax('Transaccion Incorrecta', 'Municipalidad no encontrada', 'error');
    }
    this.ngxService.stop();
  }

  public async reporteCreditosAnalizados(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteSituadoConstitucional(slug: any, print: boolean = true) {
    this.ngxService.start();

    this.aportes = [];
    let meses = moment(this.filtros.mes_fin).diff(moment(this.filtros.mes_inicio), 'month', true) + 1;
    for (let m = 0; m < meses; m++) {
      let mes = moment(this.filtros.mes_inicio).add(m, 'month').format('YYYY-MM');
      let aportes = await this.aportesService.getAportesMes(mes);
      this.aportes.push({
        mes: mes,
        data: aportes
      })
    }

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{mes_inicio}}", moment(this.filtros.mes_inicio).format('MMMM YYYY'));
    rep = rep.replaceAll("{{mes_fin}}", moment(this.filtros.mes_fin).format('MMMM YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteDatosBancarios(slug: any, print: boolean = true) {
    this.ngxService.start();

    this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{departamento}}", this.municipalidad.departamento.nombre);
    rep = rep.replaceAll("{{municipio}}", this.municipalidad.municipio.nombre);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAmortizaciones(slug: any, print: boolean = true) {
    this.ngxService.start();

    let programas = await this.programasService.getProgramas();
    this.programas = programas;

    // let municipalidades = await this.municipalidadesService.getMunicipalidades();

    let cobro = await this.cobrosService.getCobroMes(this.filtros.mes);
    if (cobro) {
      let amortizaciones = await this.amortizacionesService.getAmortizacionesCobro(cobro.id);
      console.log(amortizaciones);
    }


    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.mes).startOf('month').format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.mes).endOf('month').format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reportePrestamosOtorgados(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteRecibo(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteRecibosEmitidos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.fecha_inicio).format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.fecha_fin).format('DD/MM/YYYY'));    
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteLibroVentas(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.fecha_inicio).format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.fecha_fin).format('DD/MM/YYYY'));    
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAmortizacionesPrestamos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{mes}}", moment(this.filtros.mes).format('MMMM YYYY'));
    rep = rep.replaceAll("{{fecha}}", moment(this.filtros.fecha).format('DD/MM/YYYY'));    
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteConfirmacionSaldos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAsignaciones(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCUR(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  // Funciones

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
      console.log(prestamos[p].proyecciones);

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

  getTotalConstitucional(mes: string) {
    let total = 0;
    for (let a = 0; a < this.aportes.length; a++) {
      if (this.aportes[a].mes == mes) {
        for (let d = 0; d < this.aportes[a].data.length; d++) {
          let tot = parseFloat(this.aportes[a].data[d].constitucional);
          total += Math.round((tot + Number.EPSILON) * 100) / 100;
        }
      }
    }
    return total;
  }

  getTotalIvaPaz(mes: string) {
    let total = 0;
    for (let a = 0; a < this.aportes.length; a++) {
      if (this.aportes[a].mes == mes) {
        for (let d = 0; d < this.aportes[a].data.length; d++) {
          let tot = parseFloat(this.aportes[a].data[d].iva_paz);
          total += Math.round((tot + Number.EPSILON) * 100) / 100;
        }
      }
    }
    return total;
  }

  print(rep: any) {
    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();
  }

  async catalogo(rep: any, slug: any, print: any) {
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
      plazo_meses: null,
      mes: null,
      mes_inicio: null,
      mes_fin: null
    }
  }

}
