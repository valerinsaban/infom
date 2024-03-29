import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { ReporteService } from 'src/app/services/reportes.service';
import { HomeComponent } from '../home.component';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { PrestamosGarantiasService } from 'src/app/services/prestamos_garantias.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AportesService } from 'src/app/services/aportes.service';
import { AmortizacionesDetallesService } from 'src/app/services/amortizaciones_detalles.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import { AlertService } from 'src/app/services/alert.service';
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
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { TiposServiciosService } from 'src/app/services/catalogos/tipos-servicios.service';
import { RepService } from 'src/app/services/reportes/rep.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios.service';
import { DestinoPrestamosService } from 'src/app/services/catalogos/destinos-prestamos.service';
import { ProgramasGarantiasService } from 'src/app/services/catalogos/programas-garantias.service';
import { CobrosService } from 'src/app/services/cobros.service';

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
    mes: '',
    mes_inicio: null,
    mes_fin: null,
    ano: '',
    ano_inicio: null,
    ano_fin: null,
    no_prestamo: null
  }

  @Input()
  slug_reporte: any = 'estados-de-cuenta';

  @Input()
  view_reporte: boolean = true;

  reportes_catalogos: any = [];
  reportes: any = [];
  reporte: any;

  garantias: any = [];
  disponibilidad: any = [];
  municipalidad: any;
  tipo_servicio: any;

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
  amortizaciones: any = [];
  municipalidades: any = [];
  prestamos: any = [];
  movimientos: any = [];
  tipos_servicios: any = [];
  tipos_prestamos: any = [];
  usuarios: any = [];
  balance: any = [];
  recibos: any = [];
  facturas: any = [];

  cobro: any;

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
    private amortizaciones_detallesService: AmortizacionesDetallesService,
    private programasService: ProgramasService,
    private programas_garantiasService: ProgramasGarantiasService,
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
    private destinosService: DestinosService,
    private destinos_prestamosService: DestinoPrestamosService,
    private movimientosService: MovimientosService,
    private tiposServiciosService: TiposServiciosService,
    private usuariosService: UsuariosService,
    private cobroService: CobrosService,
    private repService: RepService
  ) {
    this.getReportes();
  }

  async ngOnInit() {
    let prestamos = await this.prestamosService.getPrestamosEstado('Acreditado')
    if (prestamos) {
      this.prestamos = prestamos;
    }

    let tipos_prestamos = await this.tiposPrestamosService.getTiposPrestamos();
    if (tipos_prestamos) {
      this.tipos_prestamos = tipos_prestamos;
    }

    let programas = await this.programasService.getProgramas();
    if (programas) {
      this.programas = programas;
    }

    let usuarios = await this.usuariosService.getUsuarios();
    if (usuarios) {
      this.usuarios = usuarios;
    }

    let tipos_servicios = await this.tiposServiciosService.getTiposServicios();
    if (tipos_servicios) {
      this.tipos_servicios = tipos_servicios;
    }
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
      { slug: 'cat-destinos', nombre: 'Catalogo Destinos' },
      { slug: 'cat-municipalidades', nombre: 'Catalogo Municipalidades' }
    ];
    this.reportes = [
      { slug: 'disponibilidad', nombre: 'Reporte Disponibilidad', filtros: ['codigo_departamento', 'codigo_municipio', 'plazo_meses'] },
      { slug: 'disponibilidad-general', nombre: 'Reporte Disponibilidad General', filtros: ['plazo_meses'] },
      { slug: 'situado-constitucional', nombre: 'Reporte Situado Constitucional', filtros: ['mes_inicio', 'mes_fin'] },
      { slug: 'datos-bancarios', nombre: 'Reporte Datos Bancarios', filtros: ['codigo_departamento', 'codigo_municipio'] },
      { slug: 'creditos-analizados', nombre: 'Reporte Creditos Analizados', filtros: ['fecha_inicio', 'fecha_fin', 'codigo_departamento', 'codigo_municipio', 'id_tipo_prestamo', 'id_programa', 'id_usuario'] },
      { slug: 'creditos-otorgados', nombre: 'Creditos Otorgados', filtros: ['fecha_inicio', 'fecha_fin', 'codigo_departamento', 'codigo_municipio', 'id_tipo_prestamo', 'id_programa', 'id_usuario'] },
      { slug: 'amortizaciones-prestamos-detalles', nombre: 'Amortizaciones a Prestamos Detalles', filtros: ['mes'] },
      { slug: 'prestamos-otorgados', nombre: 'Prestamos Otorgados', filtros: [] },
      { slug: 'prestamos-otorgados-anuales', nombre: 'Prestamos Otorgados Anuales', filtros: ['ano_inicio', 'ano_fin'] },
      { slug: 'prestamos-cancelados', nombre: 'Prestamos Cancelados', filtros: [] },
      { slug: 'recibos-emitidos', nombre: 'Recibos Emitidos', filtros: ['fecha_inicio', 'fecha_fin'] },
      { slug: 'libro-ventas', nombre: 'Libro de Ventas', filtros: ['fecha_inicio', 'fecha_fin'] },
      { slug: 'intereses-devengados', nombre: 'Reporte Intereses Devengados', filtros: ['mes'] },
      { slug: 'intereses-percibidos', nombre: 'Reporte Intereses Percibidos', filtros: ['mes'] },
      { slug: 'amortizaciones-prestamos', nombre: 'Amortizaciones a Prestamos', filtros: ['mes'] },
      { slug: 'amortizaciones-prestamos-resumen', nombre: 'Amortizaciones a Prestamos Resumen', filtros: ['mes'] },
      { slug: 'amortizaciones-prestamos-mensuales', nombre: 'Amortizaciones a Prestamos Mensuales', filtros: ['mes'] },
      { slug: 'amortizaciones-servicios', nombre: 'Amortizaciones a Servicios', filtros: ['mes', 'tipo_servicio'] },
      { slug: 'confirmacion-saldos', nombre: 'Confirmacion de Saldos', filtros: [] },
      { slug: 'asignaciones', nombre: 'Reporte de asignaciones, cobros y disponibilidad', filtros: [] },
      { slug: 'cur', nombre: 'Auxiliar para generacion de CUR de Ingresos', filtros: [] },
      { slug: 'estados-de-cuenta', nombre: 'Estados de Cuenta', filtros: ['fecha', 'no_prestamo'] },
      { slug: 'balance-general', nombre: 'Balance General', filtros: ['mes'] },
      { slug: 'balance-general-mora', nombre: 'Balance General de Prestamos en Mora', filtros: ['fecha'] },
      { slug: 'asignaciones-municipalidad', nombre: 'Reporte de Asignaciones por Municipalidad', filtros: ['codigo_departamento', 'codigo_municipio', 'ano'] },
      { slug: 'intermediaciones-financieras', nombre: 'Intermediaciones Financieras', filtros: ['fecha_inicio', 'fecha_fin'] },
      { slug: 'cambio-tasas', nombre: 'Cambio de Tasas' }
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

    if (this.slug_reporte == 'cat-municipalidades') {
      await this.reporteCatMunicipalidades(this.slug_reporte, print);
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

    if (this.slug_reporte == 'creditos-otorgados') {
      await this.reporteCreditosOtorgados(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'situado-constitucional') {
      await this.reporteSituadoConstitucional(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'datos-bancarios') {
      await this.reporteDatosBancarios(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'intereses-devengados') {
      await this.reporteInteresesDevengados(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'intereses-percibidos') {
      await this.reporteInteresesPercibidos(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'prestamos-otorgados') {
      await this.reportePrestamosOtorgados(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'prestamos-otorgados-anuales') {
      await this.reportePrestamosOtorgadosAnuales(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'prestamos-cancelados') {
      await this.reportePrestamosCancelados(this.slug_reporte, print);
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

    if (this.slug_reporte == 'amortizaciones-prestamos-resumen') {
      await this.reporteAmortizacionesPrestamosResumen(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'amortizaciones-prestamos-mensuales') {
      await this.reporteAmortizacionesPrestamosMensuales(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'amortizaciones-servicios') {
      await this.reporteAmortizacionesServicios(this.slug_reporte, print);
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

    if (this.slug_reporte == 'estados-de-cuenta') {
      await this.reporteEstadoDeCuenta(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'balance-general') {
      await this.reporteBalanceGeneral(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'amortizaciones-prestamos-detalles') {
      await this.reporteAmortizacionesPrestamosD(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'balance-general-mora') {
      await this.reporteBalanceGeneralMora(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'asignaciones-municipalidad') {
      await this.reporteAsignacionesMunicipalidad(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'intermediaciones-financieras') {
      await this.reporteIntermediacionesFinancieras(this.slug_reporte, print);
    }

    if (this.slug_reporte == 'cambio-tasas') {
      await this.reporteCambioTasas(this.slug_reporte, print);
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

  public async reporteCatMunicipalidades(slug: any, print: boolean = true) {
    this.ngxService.start();

    let municipalidades = await this.municipalidadesService.getMunicipalidades();
    this.municipalidades = municipalidades;

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
              let tasa = parseFloat(prestamos[p].tasa);
              let fecha = prestamos[p].fecha_amortizacion;

              let proyecciones = await this.prestamosService.getProyeccion(monto_total, plazo_meses, tasa, fecha, porcentaje_iva)

              this.garantias[g].prestamos.push({
                no_dictamen: prestamos[p].no_dictamen,
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
      this.alert.alertMax('Operacion Incorrecta', 'Municipalidad no encontrada', 'error');
    }
    this.ngxService.stop();
  }

  public async reporteCreditosAnalizados(slug: any, print: boolean = true) {
    this.ngxService.start();

    if (this.filtros.codigo_departamento || this.filtros.codigo_municipio) {
      this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      if (!this.municipalidad) {
        this.alert.alertMax('Transaccion Incorrecta', 'Municipalidad no encontrada', 'error');
        this.ngxService.stop();
        return;
      }
      this.filtros.id_municipalidad = this.municipalidad.id;
    } else {
      this.filtros.id_municipalidad = 0;
    }
    let prestamos = await this.repService.get(`/prestamos/analizados/${this.filtros.fecha_inicio}/${this.filtros.fecha_fin}/${this.filtros.id_tipo_prestamo}/${this.filtros.id_programa}/${this.filtros.id_municipalidad}/${this.filtros.id_usuario}`);
    if (prestamos) {
      this.prestamos = prestamos;
    }

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.fecha_inicio).format('DD [de] MMMM [de] YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.fecha_fin).format('DD [de] MMMM [de] YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCreditosOtorgados(slug: any, print: boolean = true) {
    this.ngxService.start();

    if (this.filtros.codigo_departamento || this.filtros.codigo_municipio) {
      this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      if (!this.municipalidad) {
        this.alert.alertMax('Transaccion Incorrecta', 'Municipalidad no encontrada', 'error');
        this.ngxService.stop();
        return;
      }
      this.filtros.id_municipalidad = this.municipalidad.id;
    } else {
      this.filtros.id_municipalidad = 0;
    }
    let prestamos = await this.repService.get(`/prestamos/otorgados/${this.filtros.fecha_inicio}/${this.filtros.fecha_fin}/${this.filtros.id_tipo_prestamo}/${this.filtros.id_programa}/${this.filtros.id_municipalidad}/${this.filtros.id_usuario}`);
    if (prestamos) {
      this.prestamos = prestamos;
    }

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.fecha_inicio).format('DD [de] MMMM [de] YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.fecha_fin).format('DD [de] MMMM [de] YYYY'));
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

  public async reporteInteresesPercibidos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let programas = await this.programasService.getProgramas();
    this.programas = programas;

    for (let p = 0; p < this.programas.length; p++) {
      let amortizaciones = await this.amortizacionesService.getAmortizacionesProgramaMes(this.programas[p].id, this.filtros.mes);
      if (amortizaciones.length == 0) {
        this.programas.splice(p, 1);
        p--;
      } else {
        this.programas[p].amortizaciones = amortizaciones;
        this.programas[p].municipalidades = [];

        // Agrupando municipalidades
        for (let i = 0; i < this.programas[p].amortizaciones.length; i++) {
          this.programas[p].municipalidades.push(this.programas[p].amortizaciones[i].prestamo.municipalidad);
        }
        var hash: any = {};
        this.programas[p].municipalidades = this.programas[p].municipalidades.filter(function (current: any) {
          var exists = !hash[current.id];
          hash[current.id] = true;
          return exists;
        });

        // Inyectando prestamos
        for (let m = 0; m < this.programas[p].municipalidades.length; m++) {
          this.programas[p].municipalidades[m].amortizaciones = [];

          for (let i = 0; i < this.programas[p].amortizaciones.length; i++) {
            let amortizaciones_detalles = await this.amortizaciones_detallesService.getAmortizacionesDetallesAmortizacion(this.programas[p].amortizaciones[i].id);
            this.programas[p].amortizaciones[i].amortizaciones_detalles = amortizaciones_detalles;

            if (this.programas[p].municipalidades[m].id == this.programas[p].amortizaciones[i].prestamo.id_municipalidad) {
              this.programas[p].municipalidades[m].amortizaciones.push(this.programas[p].amortizaciones[i])
            }

          }

        }

      }
    }

    // Totalizando
    for (let p = 0; p < this.programas.length; p++) {
      this.programas[p].dias = 0;
      this.programas[p].capital = 0;
      this.programas[p].interes = 0;
      for (let m = 0; m < this.programas[p].municipalidades.length; m++) {
        this.programas[p].municipalidades[m].dias = 0;
        this.programas[p].municipalidades[m].capital = 0;
        this.programas[p].municipalidades[m].interes = 0;
        for (let a = 0; a < this.programas[p].municipalidades[m].amortizaciones.length; a++) {
          for (let d = 0; d < this.programas[p].municipalidades[m].amortizaciones[a].amortizaciones_detalles.length; d++) {
            let amortizacion = this.programas[p].municipalidades[m].amortizaciones[a].amortizaciones_detalles[d];

            this.programas[p].municipalidades[m].dias += parseInt(amortizacion.dias);
            this.programas[p].municipalidades[m].capital += parseFloat(amortizacion.capital);
            this.programas[p].municipalidades[m].interes += parseFloat(amortizacion.interes);

            this.programas[p].dias += parseInt(amortizacion.dias);
            this.programas[p].capital += parseFloat(amortizacion.capital);
            this.programas[p].interes += parseFloat(amortizacion.interes);

          }
        }
      }
    }

    this.ngxService.stop();

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.mes).startOf('month').format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.mes).endOf('month').format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

  }

  public async reporteInteresesDevengados(slug: any, print: boolean = true) {
    this.ngxService.start();

    let programas = await this.programasService.getProgramas();
    this.programas = programas;

    for (let p = 0; p < this.programas.length; p++) {
      let amortizaciones = await this.amortizacionesService.getAmortizacionesProgramaMes(this.programas[p].id, this.filtros.mes);
      if (amortizaciones.length == 0) {
        this.programas.splice(p, 1);
        p--;
      } else {
        this.programas[p].amortizaciones = amortizaciones;
        this.programas[p].municipalidades = [];

        // Agrupando municipalidades
        for (let i = 0; i < this.programas[p].amortizaciones.length; i++) {
          this.programas[p].municipalidades.push(this.programas[p].amortizaciones[i].prestamo.municipalidad);
        }
        var hash: any = {};
        this.programas[p].municipalidades = this.programas[p].municipalidades.filter(function (current: any) {
          var exists = !hash[current.id];
          hash[current.id] = true;
          return exists;
        });

        // Inyectando prestamos
        for (let m = 0; m < this.programas[p].municipalidades.length; m++) {
          this.programas[p].municipalidades[m].amortizaciones = [];

          for (let i = 0; i < this.programas[p].amortizaciones.length; i++) {
            let amortizaciones_detalles = await this.amortizaciones_detallesService.getAmortizacionesDetallesAmortizacion(this.programas[p].amortizaciones[i].id);
            this.programas[p].amortizaciones[i].amortizaciones_detalles = amortizaciones_detalles;

            if (this.programas[p].municipalidades[m].id == this.programas[p].amortizaciones[i].prestamo.id_municipalidad) {
              this.programas[p].municipalidades[m].amortizaciones.push(this.programas[p].amortizaciones[i])
            }

          }

        }

      }
    }

    // Totalizando
    for (let p = 0; p < this.programas.length; p++) {
      this.programas[p].dias = 0;
      this.programas[p].capital = 0;
      this.programas[p].interes = 0;
      for (let m = 0; m < this.programas[p].municipalidades.length; m++) {
        this.programas[p].municipalidades[m].dias = 0;
        this.programas[p].municipalidades[m].capital = 0;
        this.programas[p].municipalidades[m].interes = 0;
        for (let a = 0; a < this.programas[p].municipalidades[m].amortizaciones.length; a++) {
          for (let d = 0; d < this.programas[p].municipalidades[m].amortizaciones[a].amortizaciones_detalles.length; d++) {
            let amortizacion = this.programas[p].municipalidades[m].amortizaciones[a].amortizaciones_detalles[d];

            this.programas[p].municipalidades[m].dias += parseInt(amortizacion.dias);
            this.programas[p].municipalidades[m].capital += parseFloat(amortizacion.capital);
            this.programas[p].municipalidades[m].interes += parseFloat(amortizacion.interes);

            this.programas[p].dias += parseInt(amortizacion.dias);
            this.programas[p].capital += parseFloat(amortizacion.capital);
            this.programas[p].interes += parseFloat(amortizacion.interes);

          }
        }
      }
    }

    this.ngxService.stop();

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.mes).startOf('month').format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.mes).endOf('month').format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

  }

  public async reportePrestamosOtorgados(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reportePrestamosOtorgadosAnuales(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reportePrestamosCancelados(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteRecibosEmitidos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let recibos = await this.repService.get(`/recibos/${this.filtros.fecha_inicio}/${this.filtros.fecha_fin}`);
    this.recibos = recibos;

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.fecha_inicio).format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.fecha_fin).format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteLibroVentas(slug: any, print: boolean = true) {
    this.ngxService.start();

    let facturas = await this.repService.get(`/recibos/${this.filtros.fecha_inicio}/${this.filtros.fecha_fin}`);
    this.facturas = facturas;

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.fecha_inicio).format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.fecha_fin).format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAmortizacionesPrestamos(slug: any, print: boolean = true) {
    this.ngxService.start();

    let cobro = await this.cobroService.getCobroMes(this.filtros.mes);
    let amortizaciones = await this.amortizacionesService.getAmortizacionesCobro(cobro.id);
    this.amortizaciones = amortizaciones;

    for (let a = 0; a < this.amortizaciones.length; a++) {
      let amortizacion = this.amortizaciones[a];
      let garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(amortizacion.prestamo.id);
      for (let g = 0; g < garantias.length; g++) {
        garantias[g].total = parseFloat(amortizacion.cuota) * parseFloat(garantias[g].porcentaje) / 100;
      }
      this.amortizaciones[a].garantias = garantias;
    }

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{mes}}", moment(this.filtros.mes).format('MMMM YYYY'));
    rep = rep.replaceAll("{{fecha}}", moment(cobro.fecha).format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAmortizacionesPrestamosResumen(slug: any, print: boolean = true) {
    this.ngxService.start();

    let cobro = await this.cobroService.getCobroMes(this.filtros.mes);
    let amortizaciones = await this.amortizacionesService.getAmortizacionesCobro(cobro.id);
    this.amortizaciones = amortizaciones;

    for (let a = 0; a < this.amortizaciones.length; a++) {
      let amortizacion = this.amortizaciones[a];
      let garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(amortizacion.prestamo.id);
      for (let g = 0; g < garantias.length; g++) {
        garantias[g].total = parseFloat(amortizacion.cuota) * parseFloat(garantias[g].porcentaje) / 100;
      }
      this.amortizaciones[a].garantias = garantias;
    }

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{mes}}", moment(this.filtros.mes).format('MMMM YYYY'));
    rep = rep.replaceAll("{{fecha}}", moment(this.filtros.fecha).format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAmortizacionesPrestamosMensuales(slug: any, print: boolean = true) {
    this.ngxService.start();

    let cobro = await this.cobroService.getCobroMes(this.filtros.mes);
    let amortizaciones = await this.amortizacionesService.getAmortizacionesCobro(cobro.id);
    this.amortizaciones = amortizaciones;

    for (let a = 0; a < this.amortizaciones.length; a++) {
      let amortizacion = this.amortizaciones[a];
      let garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(amortizacion.prestamo.id);
      for (let g = 0; g < garantias.length; g++) {
        garantias[g].total = parseFloat(amortizacion.cuota) * parseFloat(garantias[g].porcentaje) / 100;
      }
      this.amortizaciones[a].garantias = garantias;
    }

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{mes}}", moment(this.filtros.mes).format('MMMM YYYY'));
    rep = rep.replaceAll("{{fecha}}", moment(this.filtros.fecha).format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAmortizacionesServicios(slug: any, print: boolean = true) {
    this.ngxService.start();

    let tipo_servicio = await this.tiposServiciosService.getTipoServicio(this.filtros.id_tipo_servicio);
    if (tipo_servicio) {
      this.tipo_servicio = tipo_servicio;
    }

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{mes}}", moment(this.filtros.mes).format('MMMM YYYY'));
    rep = rep.replaceAll("{{fecha}}", moment(this.filtros.fecha).format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{tipo_servicio}}", this.tipo_servicio.nombre);
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

    let programas = await this.repService.get(`/prestamos/balance-general/${this.filtros.fecha}`);
    this.programas = programas;

    let rep: any = await this.reporteService.get(slug);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteEstadoDeCuenta(slug: any, print: boolean = true) {
    this.ngxService.start();

    let prestamo = await this.prestamosService.getPrestamo(this.filtros.id_prestamo);
    let programas_garantias = await this.programas_garantiasService.getProgramasGarantias(prestamo.id_programa);
    
    let movimientos = await this.movimientosService.getMovimientosPrestamo(this.filtros.id_prestamo);
    this.movimientos = movimientos;

    let destinos = await this.destinos_prestamosService.getDestinosPrestamosPrestamo(this.filtros.id_prestamo);
    this.destinos = destinos;

    let entregado = 0;
    let recuperado = 0;
    let intereses = 0;
    for (let m = 0; m < this.movimientos.length; m++) {
      entregado += parseFloat(this.movimientos[m].cargo);
      recuperado += parseFloat(this.movimientos[m].abono);
      intereses += parseFloat(this.movimientos[m].interes);
    }

    let saldo = this.moneda(this.movimientos[this.movimientos.length - 1].saldo_final);
    // let fecha_ultima = this.moneda(this.movimientos[this.movimientos.length - 1].fecha);
    // let fecha
    // let intereses_devengados = saldo * tasa / 365 * diff_dias

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha}}", moment(this.filtros.fecha).format('DD MMMM YYYY'));
    rep = rep.replaceAll("{{fecha_concesion}}", moment(prestamo.fecha).format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_vencimiento}}", moment(prestamo.fecha_vencimiento).format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{destino}}", this.destinos[0].destino.nombre);
    rep = rep.replaceAll("{{tasa}}", prestamo.tasa);
    rep = rep.replaceAll("{{garantia}}", programas_garantias[0].garantia.nombre);
    rep = rep.replaceAll("{{no_prestamo}}", prestamo.no_prestamo);
    rep = rep.replaceAll("{{no_resolucion}}", prestamo.resolucion.numero);
    rep = rep.replaceAll("{{programa}}", prestamo.programa.nombre);
    rep = rep.replaceAll("{{municipalidad}}", `${prestamo.municipalidad.municipio.nombre}, ${prestamo.municipalidad.departamento.nombre}`);
    
    rep = rep.replaceAll("{{monto}}", this.moneda(prestamo.monto));
    rep = rep.replaceAll("{{entregado}}", this.moneda(entregado));
    rep = rep.replaceAll("{{margen}}", this.moneda(prestamo.monto - entregado));
    rep = rep.replaceAll("{{intereses}}", this.moneda(intereses));
    rep = rep.replaceAll("{{recuperado}}", this.moneda(recuperado));
    rep = rep.replaceAll("{{saldo}}", saldo);

    rep = rep.replaceAll("{{fecha}}", moment(this.filtros.fecha).format('DD MMMM YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteBalanceGeneral(slug: any, print: boolean = true) {
    this.ngxService.start();

    let programas = await this.repService.get(`/prestamos/balance-general/${this.filtros.fecha}`);
    this.programas = programas;

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{mes}}", moment(this.filtros.mes).endOf('month').format('MMMM [de] YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAmortizacionesPrestamosD(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{mes}}", moment(this.filtros.mes).format('MMMM YYYY'));
    rep = rep.replaceAll("{{fecha}}", moment(this.filtros.fecha).format('DD [de] MMMM [de] YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteBalanceGeneralMora(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha}}", moment(this.filtros.fecha).format('DD [de] MMMM [de] YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteAsignacionesMunicipalidad(slug: any, print: boolean = true) {
    this.ngxService.start();

    this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{municipalidad}}", `${this.municipalidad.municipio.nombre}, ${this.municipalidad.departamento.nombre}`);
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteIntermediacionesFinancieras(slug: any, print: boolean = true) {
    this.ngxService.start();

    let rep: any = await this.reporteService.get(slug);
    rep = rep.replaceAll("{{fecha_inicio}}", moment(this.filtros.fecha_inicio).format('DD/MM/YYYY'));
    rep = rep.replaceAll("{{fecha_fin}}", moment(this.filtros.fecha_fin).format('DD/MM/YYYY'));
    this.catalogo(rep, slug, print)

    this.ngxService.stop();
  }

  public async reporteCambioTasas(slug: any, print: boolean = true) {
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

  getTotalDevengados(campo: string) {
    let total = 0;
    for (let p = 0; p < this.programas.length; p++) {
      if (this.programas[p].amortizaciones) {
        for (let i = 0; i < this.programas[p].amortizaciones.length; i++) {
          for (let a = 0; a < this.programas[p].amortizaciones[i].amortizaciones_detalles.length; a++) {
            if (campo == 'dias') {
              total += parseInt(this.programas[p].amortizaciones[i].amortizaciones_detalles[a].dias);
            }
            if (campo == 'capital') {
              total += parseFloat(this.programas[p].amortizaciones[i].amortizaciones_detalles[a].capital);
            }
            if (campo == 'interes') {
              total += parseFloat(this.programas[p].amortizaciones[i].amortizaciones_detalles[a].interes);
            }
          }
        }
      }
    }
    return total;
  }

  getTotalInteresIva() {
    let total = 0;
    for (let m = 0; m < this.movimientos.length; m++) {
      total += parseFloat(this.moneda(this.movimientos[m].interes)) + parseFloat(this.moneda(this.movimientos[m].iva)); 
    }
    return total;
  }

  getTotalAmmortizacion(campo: string) {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      if (campo == 'capital') {
        total += parseFloat(this.amortizaciones[a].capital);        
      }
      if (campo == 'interes') {
        total += parseFloat(this.amortizaciones[a].interes);        
      }
      if (campo == 'iva') {
        total += parseFloat(this.amortizaciones[a].iva);        
      }
      if (campo == 'cuota') {
        total += parseFloat(this.amortizaciones[a].cuota);        
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
      plazo_meses: null
    }
  }

  getUsuario() {
    return HomeComponent.usuario.usuario;
  }

  moneda(total: any) {
    let currency = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return currency.format(total);
  }

  ultimoMesAnterior(date: any) {
    return moment(date).subtract(1, 'month').endOf('month').format('DD/MM/YYYY');
  }

}
