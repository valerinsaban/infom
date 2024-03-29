import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';
import { RegionalesService } from 'src/app/services/catalogos/regionales.service';
import { FuncionariosService } from 'src/app/services/funcionarios.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import Swal from 'sweetalert2';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios.service';
import { HomeComponent } from '../home.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from 'src/app/app.component';
import { AmortizacionesDetallesService } from 'src/app/services/amortizaciones_detalles.service';
import { PrestamosGarantiasService } from 'src/app/services/prestamos_garantias.service';
import { ProgramasService } from 'src/app/services/catalogos/programas.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { ProgramasGarantiasService } from 'src/app/services/catalogos/programas-garantias.service';
import { TiposPrestamosService } from 'src/app/services/catalogos/tipos-prestamos.service';
import { DestinosService } from 'src/app/services/catalogos/destinos.service';
import { DestinoPrestamosService } from 'src/app/services/catalogos/destinos-prestamos.service';
import { DesembolsosService } from 'src/app/services/desembolsos.service';
import { ResolucionesService } from 'src/app/services/catalogos/resoluciones.service';
import { ReporteService } from 'src/app/services/reportes.service';
import { OrdenesPagosService } from 'src/app/services/ordenes_pagos.service';
import { ProyeccionesService } from 'src/app/services/proyecciones.service';
import { AportesService } from 'src/app/services/aportes.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RepresentantesService } from 'src/app/services/representantes.service';

declare function numeroALetras(number: any): any;
declare function numeroALetrasMoneda(number: any): any;
declare function numeroALetrasDPI(number: any): any;

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {

  prestamoForm: FormGroup;
  amortizacionForm: FormGroup;
  destinoPrestamoForm: FormGroup;
  desembolsoForm: FormGroup;
  ordenPagoForm: FormGroup;

  prestamos: any = [];
  prestamo: any;
  municipalidad: any;
  representante: any;
  funcionario: any;
  banco: any;
  prestamos_garantias: any = [];

  file: any;

  programas: any = [];
  tipos_prestamos: any = [];
  programas_garantias: any = [];
  garantias: any = [];
  funcionarios: any = [];
  regionales: any = [];
  usuarios: any = [];
  departamentos: any = [];
  municipios: any = [];
  resoluciones: any = [];

  aportes: any = [];
  amortizaciones: any = [];
  amortizacion: any;
  proyecciones: any = [];
  proyeccion: any;
  destinos: any = [];
  destino: any = {
    codigo: null
  };
  destinos_prestamos: any = [];
  destino_prestamo: any;
  desembolsos: any = [];
  desembolso: any;
  ordenes_pagos: any = [];
  orden_pago: any;
  vigentes: any = [];

  reporte_view: any;
  aporte: any;

  estado: string = 'Aprobado';

  counts: any = {
    pendientes: null,
    aprobados: null,
    acreditados: null,
    cancelados: null,
    anulados: null,
  }

  filtros: any = {
    id_regional: null,
    id_funcionario: null,
    id_municipalidad: null,
    id_tipo_prestamo: null,
    id_programa: null,
    id_usuario: null,
    estado: null,
    codigo_departamento: null,
    codigo_municipio: null,
    plazo_meses: 12
  }

  disponibilidad: any;
  totales_disp: any;
  disp: any;

  folios: any = []

  conf: any = {
    letra: 12,
    interlineado: 15,
    ancho: 8.5,
    alto: 11
  }

  firmas: any = {
    
  }

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private departamentosService: DepartamentosService,
    private municipiosService: MunicipiosService,
    private prestamosService: PrestamosService,
    private tipos_prestamosService: TiposPrestamosService,
    private programasService: ProgramasService,
    private programas_garantiasService: ProgramasGarantiasService,
    private garantiasService: GarantiasService,
    private municipalidadesService: MunicipalidadesService,
    private funcionariosService: FuncionariosService,
    private regionalesService: RegionalesService,
    private usuariosService: UsuariosService,
    private amortizacionesService: AmortizacionesService,
    private amortizaciones_detallesService: AmortizacionesDetallesService,
    private proyeccionesService: ProyeccionesService,
    private prestamos_garantiasService: PrestamosGarantiasService,
    private destinosService: DestinosService,
    private destinos_prestamosService: DestinoPrestamosService,
    private desembolsosService: DesembolsosService,
    private ordenes_pagosService: OrdenesPagosService,
    private resolucionesService: ResolucionesService,
    private reportesService: ReporteService,
    private aportesService: AportesService,
    private movimientosService: MovimientosService,
    private representantesService: RepresentantesService,
    private sanitizer: DomSanitizer
  ) {
    this.prestamoForm = new FormGroup({
      no_dictamen: new FormControl(null),
      no_convenio: new FormControl(null),
      no_prestamo: new FormControl(null),
      fecha: new FormControl(moment.utc().format('YYYY-MM-DD'), [Validators.required]),
      fecha_amortizacion: new FormControl(null, [Validators.required]),
      fecha_vencimiento: new FormControl(null, [Validators.required]),
      monto: new FormControl(0, [Validators.required]),
      plazo_meses: new FormControl(null, [Validators.required]),
      fecha_acta: new FormControl(null),
      tasa: new FormControl(null),
      periodo_gracia: new FormControl(0),
      destino: new FormControl(null),
      no_destinos: new FormControl(null),
      acta: new FormControl(null),
      punto: new FormControl(null),
      fecha_memorial: new FormControl(null),
      certificacion: new FormControl(null),
      no_oficio_aj: new FormControl(null),
      fecha_oficio_aj: new FormControl(null),
      no_oficio_ger: new FormControl(null),
      fecha_oficio_ger: new FormControl(null),
      motivo_anulacion: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      id_tipo_prestamo: new FormControl(null, [Validators.required]),
      id_programa: new FormControl(null, [Validators.required]),
      id_municipalidad: new FormControl(null, [Validators.required]),
      id_resolucion: new FormControl(null, [Validators.required]),
      id_funcionario: new FormControl(null, [Validators.required]),
      id_regional: new FormControl(null, [Validators.required]),
      id_usuario: new FormControl(HomeComponent.id_usuario, [Validators.required])
    });
    this.amortizacionForm = new FormGroup({
      fecha_inicio: new FormControl(null, [Validators.required]),
      fecha_fin: new FormControl(null, [Validators.required]),
      dias: new FormControl(null, [Validators.required]),
      saldo_inicial: new FormControl(null, [Validators.required]),
      capital: new FormControl(null, [Validators.required]),
      interes: new FormControl(null, [Validators.required]),
      iva: new FormControl(null, [Validators.required]),
      cuota: new FormControl(null, [Validators.required]),
      saldo_final: new FormControl(null, [Validators.required]),
      id_prestamo: new FormControl(null, [Validators.required])
    });
    this.destinoPrestamoForm = new FormGroup({
      descripcion: new FormControl(null),
      monto: new FormControl(null, [Validators.required]),
      id_destino: new FormControl(null, [Validators.required]),
      id_prestamo: new FormControl(null, [Validators.required])
    });
    this.desembolsoForm = new FormGroup({
      numero: new FormControl(null, [Validators.required]),
      mes: new FormControl(null, [Validators.required]),
      monto: new FormControl(null, [Validators.required]),
      id_prestamo: new FormControl(null, [Validators.required])
    });
    this.ordenPagoForm = new FormGroup({
      numero: new FormControl(null),
      no_desembolso: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      monto: new FormControl(null, [Validators.required]),
      no_recibo: new FormControl(null, [Validators.required]),
      no_acta: new FormControl(null, [Validators.required]),
      punto_acta: new FormControl(null, [Validators.required]),
      fecha_acta: new FormControl(null, [Validators.required]),
      id_prestamo: new FormControl(null, [Validators.required])
    });

    AppComponent.loadScript('assets/js/letras.js');
    AppComponent.loadScript('assets/js/letras-moneda.js');
    AppComponent.loadScript('assets/js/letras-dpi.js');
  }

  async ngOnInit() {
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');

    // AppComponent.loadScript('https://code.jquery.com/jquery-1.11.0.js');
    // AppComponent.loadScript('https://rawgit.com/RobinHerbots/jquery.inputmask/3.x/dist/jquery.inputmask.bundle.js');
    // AppComponent.loadScript('assets/js/mask-money.js');
    
    this.ngxService.start();
    this.getDepartamentos();
    await this.getUsuarios();
    this.getResoluciones();
    this.getFuncionarios();
    this.getRegionales();
    this.getTiposPrestamos();
    this.getProgramas();
    this.getGarantias();
    this.getDestinos();
    await this.getPrestamos();
    await this.getCountPrestamos();
  }

  get configuracion() {
    return HomeComponent.configuracion;
  }

  get usuario() {
    return HomeComponent.usuario;
  }

  async getDepartamentos() {
    this.ngxService.start();
    let departamentos = await this.departamentosService.getDepartamentos();
    if (departamentos) {
      this.departamentos = departamentos;
    }
    this.ngxService.stop();
  }

  async setCorrelativo() {
    let no_dictamen: string = '';
    let no_convenio: string = '';
    let no_prestamo: string = '';

    let fecha_inicio = moment().startOf('year').format('YYYY-MM-DD');
    let fecha_fin = moment().endOf('year').format('YYYY-MM-DD');
    let id_tipo_prestamo = this.prestamoForm.controls['id_tipo_prestamo'].value;
    let id_programa = this.prestamoForm.controls['id_programa'].value;
    let tipo_clase = await this.prestamosService.getCountPrestamosTipoPrestamoPrograma(id_tipo_prestamo, id_programa, fecha_inicio, fecha_fin);
    if (this.filtros.codigo_departamento && this.filtros.codigo_municipio) {
      this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
    }

    let prestamo_muni = await this.prestamosService.getCountPrestamosMunicipalidad(this.municipalidad.id);
    let prestamo_ano = await this.prestamosService.getCountPrestamosFecha(fecha_inicio, fecha_fin)

    if (id_tipo_prestamo && id_programa && this.municipalidad) {

      no_prestamo += this.municipalidad.departamento.codigo;
      no_prestamo += '.'
      no_prestamo += this.municipalidad.municipio.codigo;
      no_prestamo += '.'
      no_prestamo += prestamo_muni + 1;
      no_prestamo += '.'

      for (let t = 0; t < this.tipos_prestamos.length; t++) {
        if (this.tipos_prestamos[t].id == id_tipo_prestamo) {
          no_prestamo += this.tipos_prestamos[t].siglas;
          no_prestamo += '.FP.'
          no_dictamen += this.tipos_prestamos[t].siglas;
          no_dictamen += '.FP.'
          no_convenio += this.tipos_prestamos[t].siglas;
          no_convenio += '-'
        }
      }

      for (let t = 0; t < this.programas.length; t++) {
        if (this.programas[t].id == id_programa) {
          no_prestamo += this.programas[t].siglas;

          no_dictamen += this.programas[t].siglas;
          no_dictamen += '.'
        }
      }

      no_dictamen += this.municipalidad.departamento.codigo;
      no_dictamen += '.'
      no_dictamen += this.municipalidad.municipio.codigo;
      no_dictamen += '.'

      no_convenio += prestamo_ano + 1;
      no_convenio += '-'

      if (tipo_clase) {
        no_dictamen += tipo_clase + 1;
        no_dictamen += '.'
      } else {
        no_dictamen += 1;
        no_dictamen += '.'
      }

      no_dictamen += moment().format('YYYY');
      no_convenio += moment().format('YYYY');

      this.prestamoForm.controls['no_prestamo'].setValue(no_prestamo);
      this.prestamoForm.controls['no_dictamen'].setValue(no_dictamen);
      this.prestamoForm.controls['no_convenio'].setValue(no_convenio);

    }
  }

  async setDepartamento(event: any = null) {
    if (event) {
      for (let d = 0; d < this.departamentos.length; d++) {
        if (event.target.value == this.departamentos[d].id) {
          this.filtros.codigo_departamento = this.departamentos[d].codigo;
          this.filtros.codigo_municipio = null;
        }
      }
      let municipios = await this.municipiosService.getMunicipioByDepartamento(event.target.value);
      if (municipios) {
        this.municipios = municipios;
      }
    } else {
      this.filtros.codigo_municipio = null;
    }
  }

  async setMunicipio(event: any = null) {
    if (event) {
      for (let m = 0; m < this.municipios.length; m++) {
        if (event.target.value == this.municipios[m].id) {
          this.filtros.codigo_municipio = this.municipios[m].codigo;
          let municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
          if (municipalidad) {
            this.prestamoForm.controls['id_municipalidad'].setValue(municipalidad.id);
            this.municipalidad = municipalidad;
            this.filtros.id_municipalidad = municipalidad.id;
          }
        }
      }
    } else {
      let municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      if (municipalidad) {
        this.prestamoForm.controls['id_municipalidad'].setValue(municipalidad.id);
        this.municipalidad = municipalidad;
        this.filtros.id_municipalidad = municipalidad.id;
      }
    }
  }

  async setDestino(event: any) {
    for (let d = 0; d < this.destinos.length; d++) {
      if (event.target.value == this.destinos[d].id) {
        this.destino = this.destinos[d];
        this.destinoPrestamoForm.controls['id_destino'].setValue(this.destino.id);
      }
    }
  }

  async getPrestamos() {
    this.ngxService.start();
    let prestamos = await this.prestamosService.getPrestamosEstadoFecha(this.estado, this.fecha_inicio, this.fecha_fin);
    if (prestamos) {
      this.prestamos = prestamos;
    }
    this.ngxService.stop();
  }

  async getPrestamosFiltros() {
    let prestamos = await this.prestamosService.getPrestamosFiltros(this.filtros);
    if (prestamos) {
      this.prestamos = prestamos;
    }
  }

  getTipoPrestamo() {
    for (let t = 0; t < this.tipos_prestamos.length; t++) {
      if (this.prestamoForm.controls['id_tipo_prestamo'].value == this.tipos_prestamos[t].id) {
        return this.tipos_prestamos[t];
      }
    }
  }

  async getCountPrestamos() {
    this.counts = {};
    this.counts.pendientes = await this.prestamosService.getCountPrestamosEstado('Pendiente', this.fecha_inicio, this.fecha_fin);
    this.counts.aprobados = await this.prestamosService.getCountPrestamosEstado('Aprobado', this.fecha_inicio, this.fecha_fin);
    this.counts.acreditados = await this.prestamosService.getCountPrestamosEstado('Acreditado', this.fecha_inicio, this.fecha_fin);
    this.counts.cancelados = await this.prestamosService.getCountPrestamosEstado('Cancelado', this.fecha_inicio, this.fecha_fin);
    this.counts.anulados = await this.prestamosService.getCountPrestamosEstado('Anulado', this.fecha_inicio, this.fecha_fin);
  }

  async getGarantias() {
    this.ngxService.start();
    let garantias = await this.garantiasService.getGarantias();
    if (garantias) {
      this.garantias = garantias;
    }
    this.ngxService.stop();
  }

  async getDestinos() {
    this.ngxService.start();
    let destinos = await this.destinosService.getDestinos();
    if (destinos) {
      this.destinos = destinos;
    }
    this.ngxService.stop();
  }

  async getTiposPrestamos() {
    this.ngxService.start();
    let tipos_prestamos = await this.tipos_prestamosService.getTiposPrestamos();
    if (tipos_prestamos) {
      this.tipos_prestamos = tipos_prestamos;
    }
    this.ngxService.stop();
  }

  async getDestinosPrestamo() {
    this.destinos_prestamos = [];
    let destinos_prestamos = await this.destinos_prestamosService.getDestinosPrestamosPrestamo(this.prestamo.id);
    if (destinos_prestamos) {
      this.destinos_prestamos = destinos_prestamos;
      this.destinos_prestamos.sort((a: any, b: any) => b.monto - a.monto);
    }
  }

  async getDesembolsos() {
    this.desembolsos = [];
    let desembolsos = await this.desembolsosService.getDesembolsosPrestamo(this.prestamo.id);
    if (desembolsos) {
      this.desembolsos = desembolsos;
    }
  }

  async getOrdenesPagos() {
    this.ordenes_pagos = [];
    let ordenes_pagos = await this.ordenes_pagosService.getOrdenesPagosPrestamo(this.prestamo.id);
    if (ordenes_pagos) {
      this.ordenes_pagos = ordenes_pagos;
      this.limpiar5()
    }
  }

  async getProgramas() {
    this.ngxService.start();
    let programas = await this.programasService.getProgramas();
    if (programas) {
      this.programas = programas;
    }
    this.ngxService.stop();
  }

  async getResoluciones() {
    this.ngxService.start();
    let resoluciones = await this.resolucionesService.getResoluciones();
    if (resoluciones) {
      this.resoluciones = resoluciones;
    }
    this.ngxService.stop();
  }

  async getProgramasGarantias(event: any) {
    this.ngxService.start();
    let programas_garantias = await this.programas_garantiasService.getProgramasGarantias(event.target.value);
    if (programas_garantias) {
      this.programas_garantias = programas_garantias;
      this.prestamoForm.controls['monto'].setValue(0);

      if (this.programas_garantias.length == 1) {
        this.programas_garantias[0].porcentaje = 100;
      }
    }
    this.ngxService.stop();
  }

  async getFuncionarios() {
    this.ngxService.start();
    let funcionarios = await this.funcionariosService.getFuncionarios();
    if (funcionarios) {
      this.funcionarios = funcionarios;
    }
    this.ngxService.stop();
  }

  async getRegionales() {
    this.ngxService.start();
    let regionales = await this.regionalesService.getRegionales();
    if (regionales) {
      this.regionales = regionales;
    }
    this.ngxService.stop();
  }

  async getUsuarios() {
    this.ngxService.start();
    let usuarios = await this.usuariosService.getUsuarios();
    if (usuarios) {
      this.usuarios = usuarios;
    }
    this.ngxService.stop();
  }

  async getProyeccion() {
    let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
    let monto_total = parseFloat(this.prestamoForm.controls['monto'].value);
    let plazo_meses = parseFloat(this.prestamoForm.controls['plazo_meses'].value);
    let tasa = parseFloat(this.prestamoForm.controls['tasa'].value);
    let periodo_gracia = parseFloat(this.prestamoForm.controls['periodo_gracia'].value);
    let fecha = moment(this.prestamoForm.controls['fecha_amortizacion'].value).add(periodo_gracia, 'month').format('YYYY-MM-DD');

    this.amortizaciones = await this.prestamosService.getProyeccion(monto_total, plazo_meses, tasa, fecha, porcentaje_iva);
  }

  async getProyeccion2() {
    this.disp = null;

    let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
    let monto_total = parseFloat(this.prestamoForm.controls['monto'].value);
    let plazo_meses = parseFloat(this.prestamoForm.controls['plazo_meses'].value);
    let fecha_amortizacion = this.prestamoForm.controls['fecha_amortizacion'].value;
    let tasa = parseFloat(this.prestamoForm.controls['tasa'].value);
    let periodo_gracia = parseFloat(this.prestamoForm.controls['periodo_gracia'].value);
    let fecha = moment(this.prestamoForm.controls['fecha_amortizacion'].value).add(periodo_gracia, 'month').format('YYYY-MM-DD');

    this.proyecciones = [];
    this.proyecciones = await this.prestamosService.getProyeccion(monto_total, plazo_meses, tasa, fecha, porcentaje_iva);

    this.filtros.plazo_meses = plazo_meses;
    this.prestamoForm.controls['fecha_vencimiento'].setValue(moment(fecha_amortizacion).add(plazo_meses - 1, 'months').endOf('month').format('YYYY-MM-DD'));
  }

  async updateProyeccion() {
    this.disp = null;
    let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
    let monto_total = parseFloat(this.prestamoForm.controls['monto'].value);
    let tasa = parseFloat(this.prestamoForm.controls['tasa'].value);

    let saldo = monto_total;

    for (let i = 0; i < this.proyecciones.length; i++) {
      let p = this.proyecciones[i];
      p.saldo_inicial = saldo;
      p.interes = (saldo * (tasa / 100) / 365) * p.dias;
      p.iva = p.interes * porcentaje_iva / 100;
      p.cuota = parseFloat(p.capital) + p.interes + p.iva;
      p.saldo_final = saldo - parseFloat(p.capital);
      saldo = p.saldo_final;
    }
  }

  get fecha_inicio() {
    return sessionStorage.getItem('fecha_inicio');
  }

  get fecha_fin() {
    return sessionStorage.getItem('fecha_fin');
  }

  setMontoTotal() {
    let total = parseFloat(this.prestamoForm.controls['monto'].value);

    for (let c = 0; c < this.tipos_prestamos.length; c++) {
      let monto_min = parseFloat(this.tipos_prestamos[c].monto_min);
      let monto_max = parseFloat(this.tipos_prestamos[c].monto_max);
      if (monto_max) {
        if (total >= monto_min && total <= monto_max) {
          this.prestamoForm.controls['id_tipo_prestamo'].setValue(this.tipos_prestamos[c].id);
        }
      } else {
        if (total >= monto_min) {
          this.prestamoForm.controls['id_tipo_prestamo'].setValue(this.tipos_prestamos[c].id);
        }
      }
    }
    this.setMonto()
  }

  async setMonto(edit: boolean = false) {
    let total = parseFloat(this.prestamoForm.controls['monto'].value);

    for (let g = 0; g < this.programas_garantias.length; g++) {
      this.programas_garantias[g].monto = total * this.programas_garantias[g].porcentaje / 100;
    }

    if (edit) {
      for (let g = 0; g < this.prestamos_garantias.length; g++) {
        this.prestamos_garantias[g].monto = total * this.prestamos_garantias[g].porcentaje / 100;
      }
    }

    await this.getProyeccion2();
  }

  getTotal(edit: boolean = false) {
    let total = 0;
    for (let g = 0; g < this.programas_garantias.length; g++) {
      total += parseFloat(this.programas_garantias[g].monto)
    }
    if (edit) {
      total = 0;
      for (let g = 0; g < this.prestamos_garantias.length; g++) {
        total += parseFloat(this.prestamos_garantias[g].monto)
      }
    }
    return total;
  }

  getPorcentaje(edit: boolean = false) {
    let porcentaje = 0;
    for (let g = 0; g < this.programas_garantias.length; g++) {
      porcentaje += parseFloat(this.programas_garantias[g].porcentaje)
    }
    if (edit) {
      porcentaje = 0;
      for (let g = 0; g < this.prestamos_garantias.length; g++) {
        porcentaje += parseFloat(this.prestamos_garantias[g].porcentaje)
      }
    }
    return porcentaje;
  }

  async postDestinoPrestamo() {
    this.ngxService.start();

    let destino_prestamo = await this.destinos_prestamosService.postDestinoPrestamo(this.destinoPrestamoForm.value);
    if (destino_prestamo.resultado) {
      await this.getDestinosPrestamo();
      this.alert.alertMax('Operacion Correcta', destino_prestamo.mensaje, 'success');
      this.limpiar3();
    }
    this.ngxService.stop();
  }

  async putDestinoPrestamo() {
    this.ngxService.start();
    let destino_prestamo = await this.destinos_prestamosService.putDestinoPrestamo(this.destino_prestamo.id, this.destinoPrestamoForm.value);
    if (destino_prestamo.resultado) {
      await this.getDestinosPrestamo();
      this.alert.alertMax('Operacion Correcta', destino_prestamo.mensaje, 'success');
      this.limpiar3();
    }
    this.ngxService.stop();
  }

  async deleteDestinoPrestamo(i: any, index: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let destino_prestamo = await this.destinos_prestamosService.deleteDestinoPrestamo(i.id);
        if (destino_prestamo.resultado) {
          this.destinos_prestamos.splice(index, 1);
          this.alert.alertMax('Correcto', destino_prestamo.mensaje, 'success');
          this.limpiar3();
        }
        this.ngxService.stop();
      }
    })
  }

  async postDesembolso() {
    this.ngxService.start();

    let desembolso = await this.desembolsosService.postDesembolso(this.desembolsoForm.value);
    if (desembolso.resultado) {
      await this.getDesembolsos();
      this.alert.alertMax('Operacion Correcta', desembolso.mensaje, 'success');
      this.limpiar4();
    }
    this.ngxService.stop();
  }

  async putDesembolso() {
    this.ngxService.start();
    let desembolso = await this.desembolsosService.putDesembolso(this.desembolso.id, this.desembolsoForm.value);
    if (desembolso.resultado) {
      await this.getDesembolsos();
      this.alert.alertMax('Operacion Correcta', desembolso.mensaje, 'success');
      this.limpiar4();
    }
    this.ngxService.stop();
  }

  async deleteDesembolso(i: any, index: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let desembolso = await this.desembolsosService.deleteDesembolso(i.id);
        if (desembolso.resultado) {
          this.desembolsos.splice(index, 1);
          this.alert.alertMax('Correcto', desembolso.mensaje, 'success');
          this.limpiar4();
        }
        this.ngxService.stop();
      }
    })
  }

  async postOrdenPago() {
    this.ngxService.start();

    let fecha_inicio = moment().startOf('year').format('YYYY-MM-DD');
    let fecha_fin = moment().endOf('year').format('YYYY-MM-DD');
    let numero = await this.ordenes_pagosService.getCountOrdenesPagosFecha(fecha_inicio, fecha_fin);
    numero = (parseInt(numero) + 1) + '-' + moment().format('YYYY') + '-' + this.getTipoPrestamo().siglas;
    this.ordenPagoForm.controls['numero'].setValue(numero);

    let orden_pago = await this.ordenes_pagosService.postOrdenPago(this.ordenPagoForm.value);
    if (orden_pago.resultado) {
      let ultimo_mivimiento = await this.movimientosService.getMovimientosUltimo(this.prestamo.id);

      if (ultimo_mivimiento) {
        let saldo_inicial = ultimo_mivimiento.saldo_final;
        await this.movimientosService.postMovimiento({
          fecha: moment(this.ordenPagoForm.controls['fecha'].value).format('YYYY-MM-DD'),
          saldo_inicial: saldo_inicial,
          cargo: orden_pago.data.monto,
          abono: 0,
          saldo_final: parseFloat(saldo_inicial) + parseFloat(orden_pago.data.monto),
          descripcion: `Retito de Desembolso No. ${orden_pago.data.no_desembolso} del prestamo ${this.prestamo.no_prestamo} S/Resol #${this.prestamo.resolucion.numero}.`,
          capital: 0,
          interes: 0,
          iva: 0,
          id_prestamo: this.prestamo.id,
          id_orden_pago: orden_pago.data.id,
          id_recibo: null
        });
      } else {
        await this.movimientosService.postMovimiento({
          fecha: moment(this.ordenPagoForm.controls['fecha'].value).format('YYYY-MM-DD'),
          saldo_inicial: 0,
          cargo: orden_pago.data.monto,
          abono: 0,
          saldo_final: orden_pago.data.monto,
          descripcion: `Retito de Desembolso No. ${orden_pago.data.no_desembolso} del prestamo ${this.prestamo.no_prestamo} S/Resol #${this.prestamo.resolucion.numero}.`,
          capital: 0,
          interes: 0,
          iva: 0,
          id_prestamo: this.prestamo.id,
          id_orden_pago: orden_pago.data.id,
          id_recibo: null
        });
      }
      await this.getOrdenesPagos();
      this.alert.alertMax('Operacion Correcta', orden_pago.mensaje, 'success');
      this.limpiar5();
    }
    this.ngxService.stop();
  }

  async putOrdenPago() {
    this.ngxService.start();
    let orden_pago = await this.ordenes_pagosService.putOrdenPago(this.orden_pago.id, this.ordenPagoForm.value);
    if (orden_pago.resultado) {
      await this.getOrdenesPagos();
      this.alert.alertMax('Operacion Correcta', orden_pago.mensaje, 'success');
      this.limpiar5();
    }
    this.ngxService.stop();
  }

  async deleteOrdenPago(i: any, index: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let orden_pago = await this.ordenes_pagosService.deleteOrdenPago(i.id);
        if (orden_pago.resultado) {
          this.ordenes_pagos.splice(index, 1);
          this.alert.alertMax('Correcto', orden_pago.mensaje, 'success');
          this.limpiar5();
        }
        this.ngxService.stop();
      }
    })
  }

  async postPrestamo() {
    this.ngxService.start();
    await this.setCorrelativo();

    let prestamo = await this.prestamosService.postPrestamo(this.prestamoForm.value);
    if (prestamo.resultado) {

      let monto_total = parseFloat(this.prestamoForm.controls['monto'].value);

      for (let g = 0; g < this.programas_garantias.length; g++) {
        if (this.programas_garantias[g].monto && this.programas_garantias[g].monto > 0) {

          let monto = parseFloat(this.programas_garantias[g].monto);

          let porcentaje = monto / monto_total * 100;

          if (this.programas_garantias[g].monto) {
            await this.prestamos_garantiasService.postPrestamoGarantia({
              monto: parseFloat(this.programas_garantias[g].monto),
              porcentaje: porcentaje,
              id_garantia: this.programas_garantias[g].garantia.id,
              id_prestamo: prestamo.data.id
            });
          }

        }
      }

      for (let p = 0; p < this.proyecciones.length; p++) {
        this.proyecciones[p].id_prestamo = prestamo.data.id;
        await this.proyeccionesService.postProyeccion(this.proyecciones[p])
      }

      await this.getPrestamos();
      await this.getCountPrestamos();
      this.alert.alertMax('Operacion Correcta', prestamo.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putPrestamo() {
    let estado = this.prestamoForm.controls['estado'].value;
    if (estado == 'Cancelado') {
      let saldo_final = (this.amortizaciones.length ? parseFloat(this.amortizaciones[this.amortizaciones.length - 1].saldo_final) : this.prestamo.monto).toFixed(2);
      if (parseInt(saldo_final) != 0) {
        this.alert.alertMax('Operacion Incorrecta', `Prestamo con Q${saldo_final} de saldo pendiente`, 'error');
        return;
      }
    }
    this.ngxService.start();
    let prestamo = await this.prestamosService.putPrestamo(this.prestamo.id, this.prestamoForm.value);
    if (prestamo.resultado) {

      for (let p = 0; p < this.prestamos_garantias.length; p++) {
        await this.prestamos_garantiasService.putPrestamoGarantia(this.prestamos_garantias[p].id, {
          monto: this.prestamos_garantias[p].monto,
          porcentaje: this.prestamos_garantias[p].porcentaje,
          id_garantia: this.prestamos_garantias[p].id_garantia,
          id_prestamo: this.prestamos_garantias[p].id_prestamo,
        })
      }

      // await this.proyeccionesService.deleteProyeccionesPrestamo(this.prestamo.id)

      // for (let p = 0; p < this.proyecciones.length; p++) {
      //   this.proyecciones[p].id_prestamo = prestamo.data.id;
      //   await this.proyeccionesService.postProyeccion(this.proyecciones[p])
      // }

      await this.getPrestamos();
      await this.getCountPrestamos();
      this.alert.alertMax('Operacion Correcta', prestamo.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async deletePrestamo(i: any, index: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let prestamo = await this.prestamosService.deletePrestamo(i.id);
        if (prestamo.resultado) {
          this.prestamos.splice(index, 1);
          await this.getCountPrestamos();
          this.alert.alertMax('Correcto', prestamo.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.prestamoForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }


  // Metodos para obtener data y id de registro seleccionado
  async setPrestamo(i: any, index: number) {
    this.ngxService.start();
    i.index = index;
    this.prestamo = i;
    this.prestamoForm.controls['no_dictamen'].setValue(i.no_dictamen);
    this.prestamoForm.controls['no_convenio'].setValue(i.no_convenio);
    this.prestamoForm.controls['no_prestamo'].setValue(i.no_prestamo);
    this.prestamoForm.controls['fecha'].setValue(i.fecha ? moment.utc(i.fecha).format('YYYY-MM-DD') : i.fecha);
    this.prestamoForm.controls['fecha_amortizacion'].setValue(i.fecha_amortizacion ? moment.utc(i.fecha_amortizacion).format('YYYY-MM-DD') : i.fecha_amortizacion);
    this.prestamoForm.controls['fecha_vencimiento'].setValue(i.fecha_vencimiento ? moment.utc(i.fecha_vencimiento).format('YYYY-MM-DD') : i.fecha_vencimiento);
    this.prestamoForm.controls['monto'].setValue(i.monto);
    this.prestamoForm.controls['plazo_meses'].setValue(i.plazo_meses);
    this.prestamoForm.controls['fecha_acta'].setValue(i.fecha_acta ? moment.utc(i.fecha_acta).format('YYYY-MM-DD') : i.fecha_acta);
    this.prestamoForm.controls['tasa'].setValue(i.tasa);
    this.prestamoForm.controls['periodo_gracia'].setValue(i.periodo_gracia);
    this.prestamoForm.controls['destino'].setValue(i.destino);
    this.prestamoForm.controls['no_destinos'].setValue(i.no_destinos);
    this.prestamoForm.controls['acta'].setValue(i.acta);
    this.prestamoForm.controls['punto'].setValue(i.punto);
    this.prestamoForm.controls['fecha_memorial'].setValue(i.fecha_memorial ? moment.utc(i.fecha_memorial).format('YYYY-MM-DD') : i.fecha_memorial);
    this.prestamoForm.controls['certificacion'].setValue(i.certificacion);
    this.prestamoForm.controls['no_oficio_aj'].setValue(i.no_oficio_aj);
    this.prestamoForm.controls['fecha_oficio_aj'].setValue(i.fecha_oficio_aj);
    this.prestamoForm.controls['no_oficio_ger'].setValue(i.no_oficio_ger);
    this.prestamoForm.controls['fecha_oficio_ger'].setValue(i.fecha_oficio_ger);
    this.prestamoForm.controls['motivo_anulacion'].setValue(i.motivo_anulacion);
    this.prestamoForm.controls['estado'].setValue(i.estado);
    this.prestamoForm.controls['id_tipo_prestamo'].setValue(i.id_tipo_prestamo);
    this.prestamoForm.controls['id_programa'].setValue(i.id_programa);
    this.prestamoForm.controls['id_municipalidad'].setValue(i.id_municipalidad);
    this.prestamoForm.controls['id_resolucion'].setValue(i.id_resolucion);
    this.prestamoForm.controls['id_funcionario'].setValue(i.id_funcionario);
    this.prestamoForm.controls['id_regional'].setValue(i.id_regional);
    this.prestamoForm.controls['id_usuario'].setValue(i.id_usuario);

    this.amortizacionForm.controls['id_prestamo'].setValue(i.id);
    this.destinoPrestamoForm.controls['id_prestamo'].setValue(i.id);
    this.desembolsoForm.controls['id_prestamo'].setValue(i.id);
    this.ordenPagoForm.controls['id_prestamo'].setValue(i.id);

    this.prestamos_garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(i.id);
    this.proyecciones = await this.proyeccionesService.getProyeccionesPrestamo(i.id);

    this.municipalidad = i.municipalidad;
    this.filtros.codigo_departamento = i.municipalidad.departamento.codigo;
    this.filtros.codigo_municipio = i.municipalidad.municipio.codigo;

    this.calcAmortizacion();
    this.ngxService.stop();
  }

  async setDestinoPrestamo(i: any, index: number) {
    i.index = index;
    this.destino_prestamo = i;
    this.destino = i.destino;

    this.destinoPrestamoForm.controls['descripcion'].setValue(i.descripcion);
    this.destinoPrestamoForm.controls['monto'].setValue(i.monto);
    this.destinoPrestamoForm.controls['id_destino'].setValue(i.id_destino);
    this.destinoPrestamoForm.controls['id_prestamo'].setValue(i.id_prestamo);
  }

  async setDesembolso(i: any, index: number) {
    i.index = index;
    this.desembolso = i;

    this.desembolsoForm.controls['numero'].setValue(i.numero);
    this.desembolsoForm.controls['mes'].setValue(i.mes);
    this.desembolsoForm.controls['monto'].setValue(i.monto);
    this.desembolsoForm.controls['id_prestamo'].setValue(i.id_prestamo);
  }

  async setOrdenPago(i: any, index: number) {
    i.index = index;
    this.orden_pago = i;

    this.ordenPagoForm.controls['numero'].setValue(i.numero);
    this.ordenPagoForm.controls['no_desembolso'].setValue(i.no_desembolso);
    this.ordenPagoForm.controls['fecha'].setValue(i.fecha);
    this.ordenPagoForm.controls['monto'].setValue(i.monto);
    this.ordenPagoForm.controls['no_recibo'].setValue(i.no_recibo);
    this.ordenPagoForm.controls['no_acta'].setValue(i.no_acta);
    this.ordenPagoForm.controls['punto_acta'].setValue(i.punto_acta);
    this.ordenPagoForm.controls['fecha_acta'].setValue(i.fecha_acta);
    this.ordenPagoForm.controls['id_prestamo'].setValue(i.id_prestamo);

    this.orden_pago.fecha = moment(i.fecha).format('DD [de] MMMM [de] YYYY')
  }

  async getAmortizaciones(i: any, index: number) {
    i.index = index;
    this.prestamo = i;

    this.ngxService.start();
    this.amortizaciones = [];
    let amortizaciones = await this.amortizacionesService.getAmortizacionesPrestamo(this.prestamo.id);
    if (amortizaciones) {
      this.amortizaciones = amortizaciones;

      for (let a = 0; a < this.amortizaciones.length; a++) {
        let detalles = await this.amortizaciones_detallesService.getAmortizacionesDetallesAmortizacion(this.amortizaciones[a].id);
        if (detalles) {
          this.amortizaciones[a].amortizaciones_detalles = detalles;
        }
      }

    }
    this.ngxService.stop();
  }

  calcAmortizacion() {
    let monto_total = this.prestamo.monto;
    let plazo_meses = parseFloat(this.prestamo.plazo_meses);
    let tasa = parseFloat(this.prestamo.tasa);

    let fecha_inicio = this.amortizacionForm.controls['fecha_inicio'].value;
    let fecha_fin = this.amortizacionForm.controls['fecha_fin'].value;

    if (fecha_inicio && fecha_fin) {
      let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days') + 1;
      let capital = monto_total / plazo_meses;
      let saldo_inicial = monto_total;

      if (!this.amortizacion || this.amortizacion.index == 0) {
        capital = monto_total / plazo_meses;
        saldo_inicial = monto_total;
      } else {
        capital = monto_total / plazo_meses;
        // capital = parseFloat(this.amortizaciones[this.amortizacion.index - 1].capital);
        saldo_inicial = parseFloat(this.amortizaciones[this.amortizacion.index - 1].saldo_final);
      }

      let interes = (saldo_inicial * (tasa / 100) / 365) * dias;
      let iva = interes * parseFloat(this.configuracion.porcentaje_iva) / 100;
      let cuota = capital + interes + iva;
      let saldo_final = saldo_inicial - capital;

      this.amortizacionForm.controls['dias'].setValue(dias);
      this.amortizacionForm.controls['saldo_inicial'].setValue(saldo_inicial.toFixed(8));
      this.amortizacionForm.controls['capital'].setValue(capital.toFixed(8));
      this.amortizacionForm.controls['interes'].setValue(interes.toFixed(8))
      this.amortizacionForm.controls['iva'].setValue(iva.toFixed(8))
      this.amortizacionForm.controls['cuota'].setValue(cuota.toFixed(8))
      this.amortizacionForm.controls['saldo_final'].setValue(saldo_final.toFixed(8));

    }
  }

  getDias() {
    let total = 0;
    for (let a = 0; a < this.proyecciones.length; a++) {
      total += this.proyecciones[a].dias;
    }
    return total;
  }

  getCapital() {
    let total = 0;
    for (let a = 0; a < this.proyecciones.length; a++) {
      total += parseFloat(this.proyecciones[a].capital);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getInteres() {
    let total = 0;
    for (let a = 0; a < this.proyecciones.length; a++) {
      total += parseFloat(this.proyecciones[a].interes);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getIva() {
    let total = 0;
    for (let a = 0; a < this.proyecciones.length; a++) {
      total += parseFloat(this.proyecciones[a].iva);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getInteresIva() {
    let total = 0;
    for (let a = 0; a < this.proyecciones.length; a++) {
      total += parseFloat(this.proyecciones[a].iva) + parseFloat(this.proyecciones[a].interes);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getCuota() {
    let total = 0;
    for (let a = 0; a < this.proyecciones.length; a++) {
      total += parseFloat(this.proyecciones[a].cuota);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getTotalDias() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += this.amortizaciones[a].dias;
    }
    return total;
  }

  getTotalCapital() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += parseFloat(this.amortizaciones[a].capital);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getTotalInteres() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += parseFloat(this.amortizaciones[a].interes);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getTotalIva() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += parseFloat(this.amortizaciones[a].iva);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getTotalCuota() {
    let total = 0;
    for (let a = 0; a < this.amortizaciones.length; a++) {
      total += parseFloat(this.amortizaciones[a].cuota);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getTotalDestinosPrestamos() {
    let total = 0;
    for (let a = 0; a < this.destinos_prestamos.length; a++) {
      total += parseFloat(this.destinos_prestamos[a].monto);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getTotalDesembolsos() {
    let total = 0;
    for (let a = 0; a < this.desembolsos.length; a++) {
      total += parseFloat(this.desembolsos[a].monto);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getTotalOrdenesPagos() {
    let total = 0;
    for (let a = 0; a < this.ordenes_pagos.length; a++) {
      total += parseFloat(this.ordenes_pagos[a].monto);
      total = Math.round((total + Number.EPSILON) * 100) / 100
    }
    return total;
  }

  getInteresMasIva(interes: any, iva: any) {
    return parseFloat(interes) + parseFloat(iva);
  }

  colorClass(p: any) {
    if (p.estado == 'Pendiente') {
      return 'pendiente'
    }
    if (p.estado == 'Aprobado') {
      return 'aprobado'
    }
    if (p.estado == 'Acreditado') {
      return 'acreditado'
    }
    if (p.estado == 'Cancelado') {
      return 'cancelado'
    }
    if (p.estado == 'Anulado') {
      return 'anulado'
    }
    return '';
  }

  destinosCompletos() {
    if (this.destinos_prestamos.length == parseInt(this.prestamo.no_destinos)) {
      if (parseFloat(this.prestamo.monto) == this.getTotalDestinosPrestamos()) {
        return true
      }
    }
    return false;
  }

  desembolsosCompletos() {
    if (parseFloat(this.prestamo.monto) == this.getTotalDesembolsos()) {
      return true
    }
    return false;
  }

  ordenesPagosCompletos() {
    if (parseFloat(this.prestamo.monto) == this.getTotalOrdenesPagos()) {
      return true
    }
    return false;
  }

  limpiar() {
    this.prestamoForm.reset();
    // this.prestamoForm.controls['no_dictamen'].setValue(1);
    // this.prestamoForm.controls['no_convenio'].setValue(1);
    // this.prestamoForm.controls['no_prestamo'].setValue(1);

    this.prestamoForm.controls['fecha'].setValue(moment.utc().format('YYYY-MM-DD'));
    this.prestamoForm.controls['monto'].setValue(0);
    this.prestamoForm.controls['tasa'].setValue(this.configuracion.porcentaje_tasa);
    this.prestamoForm.controls['periodo_gracia'].setValue(0);
    this.prestamoForm.controls['estado'].setValue('Pendiente');
    this.prestamoForm.controls['id_usuario'].setValue(HomeComponent.id_usuario);

    this.prestamoForm.controls['id_regional'].setValue(this.regionales[0].id);
    this.prestamoForm.controls['id_funcionario'].setValue(this.funcionarios[0].id);

    this.prestamo = null;
    this.filtros.codigo_departamento = null;
    this.filtros.codigo_municipio = null;
    this.amortizaciones = [];
    this.programas_garantias = [];
  }

  limpiar2() {
    this.amortizacionForm.reset();
    if (this.amortizaciones.length) {
      let amortizacion = this.amortizaciones[this.amortizaciones.length - 1];
      this.amortizacionForm.controls['fecha_inicio'].setValue(moment(amortizacion.fecha_inicio).add(1, 'month').format('YYYY-MM-DD'));
      this.amortizacionForm.controls['fecha_fin'].setValue(moment(amortizacion.fecha_fin).add(1, 'month').format('YYYY-MM-DD'));
      this.calcAmortizacion();
    }
    this.amortizacionForm.controls['id_prestamo'].setValue(this.prestamo.id);
    this.amortizacion = null;
  }

  limpiar3() {
    this.destinoPrestamoForm.reset();
    this.destinoPrestamoForm.controls['id_prestamo'].setValue(this.prestamo.id);
    this.destino_prestamo = null;
    this.destino = {
      codigo: null
    };
  }

  limpiar4() {
    this.desembolsoForm.reset();
    this.desembolsoForm.controls['id_prestamo'].setValue(this.prestamo.id);
    this.desembolso = null;
  }

  limpiar5() {
    this.ordenPagoForm.reset();
    this.ordenPagoForm.controls['no_desembolso'].setValue(this.ordenes_pagos.length + 1);
    this.ordenPagoForm.controls['id_prestamo'].setValue(this.prestamo.id);
    this.orden_pago = null;
  }

  limpiarFiltros() {
    this.filtros = {
      id_regional: null,
      id_funcionario: null,
      id_municipalidad: null,
      id_tipo_prestamo: null,
      id_programa: null,
      id_usuario: null,
      estado: null,
      codigo_departamento: null,
      codigo_municipio: null
    }
  }

  public async reporteHojaTecnica() {
    this.ngxService.start();

    let vigentes = await this.prestamosService.getPrestamosEstadoMunicipalidad('Acreditado', this.prestamo.id_municipalidad);
    if (vigentes) {
      this.vigentes = vigentes;
      for (let v = 0; v < this.vigentes.length; v++) {
        let destinos = await this.destinos_prestamosService.getDestinosPrestamosPrestamo(this.vigentes[v].id);
        if (destinos) {
          this.vigentes[v].destinos = destinos;
        }

        let movimiento = await this.movimientosService.getMovimientosUltimo(this.prestamo.id);
        if (movimiento) {
          this.vigentes[v].saldo = movimiento.saldo_final;
        }
      }
    }

    let rep: any = await this.reportesService.get('prestamos/pr-hoja-tecnica');
    let contenido: any = document.getElementById('pr-hoja-tecnica');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{departamento}}", this.prestamo.municipalidad.departamento.nombre);
    rep = rep.replaceAll("{{municipio}}", this.prestamo.municipalidad.municipio.nombre);
    rep = rep.replaceAll("{{no_resolucion}}", `${this.prestamo.resolucion.numero}`);
    rep = rep.replaceAll("{{no_dictamen}}", `${this.prestamo.no_dictamen}`);
    rep = rep.replaceAll("{{no_convenio}}", `${this.prestamo.no_convenio}`);
    rep = rep.replaceAll("{{no_convenio_i}}", `${this.prestamo.municipalidad.no_convenio}`);

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{contenido}}", contenido);
    rep = rep.replaceAll("{{letra}}", this.conf.letra);
    rep = rep.replaceAll("{{interlineado}}", this.conf.interlineado);
    rep = rep.replaceAll("{{ancho}}", this.conf.ancho);
    rep = rep.replaceAll("{{alto}}", this.conf.alto);

    let popupWin: any = window.open('', '_blank');
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();

    this.reporte_view = this.sanitizer.bypassSecurityTrustResourceUrl(popupWin);

    this.ngxService.stop();
  }

  public async reporteDictamen() {
    this.ngxService.start();

    let desembolsos = await this.desembolsosService.getDesembolsosPrestamo(this.prestamo.id);
    if (desembolsos) {

    }
    this.desembolsos = desembolsos;

    let vigentes = await this.prestamosService.getPrestamosEstadoMunicipalidad('Acreditado', this.prestamo.id_municipalidad);
    if (vigentes) {
      this.vigentes = vigentes;
      for (let v = 0; v < this.vigentes.length; v++) {
        let destinos = await this.destinos_prestamosService.getDestinosPrestamosPrestamo(this.vigentes[v].id);
        if (destinos) {
          this.vigentes[v].destinos = destinos;
        }

        let movimiento = await this.movimientosService.getMovimientosUltimo(this.prestamo.id);
        if (movimiento) {
          this.vigentes[v].saldo = movimiento.saldo_final;
        }
      }
    }

    let aporte = await this.aportesService.getAportesDepartamentoMunicipioMes(this.prestamo.municipalidad.departamento.codigo, this.prestamo.municipalidad.municipio.codigo, moment(this.prestamo.fecha_amortizacion).format('YYYY-MM'))
    if (aporte) {
      this.aporte = aporte;
    }
    let rep: any = await this.reportesService.get('prestamos/pr-dictamen');
    let contenido: any = document.getElementById('pr-dictamen');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{departamento}}", this.prestamo.municipalidad.departamento.nombre);
    rep = rep.replaceAll("{{municipio}}", this.prestamo.municipalidad.municipio.nombre);
    rep = rep.replaceAll("{{no_resolucion}}", `${this.prestamo.resolucion.numero}`);
    rep = rep.replaceAll("{{no_dictamen}}", `${this.prestamo.no_dictamen}`);
    rep = rep.replaceAll("{{no_convenio}}", `${this.prestamo.no_convenio}`);
    rep = rep.replaceAll("{{no_convenio_i}}", `${this.prestamo.municipalidad.no_convenio}`);

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{contenido}}", contenido);
    rep = rep.replaceAll("{{letra}}", this.conf.letra);
    rep = rep.replaceAll("{{interlineado}}", this.conf.interlineado);
    rep = rep.replaceAll("{{ancho}}", this.conf.ancho);
    rep = rep.replaceAll("{{alto}}", this.conf.alto);

    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();

    this.ngxService.stop();
  }

  public async reporteResolucion() {
    this.ngxService.start();

    let desembolsos = await this.desembolsosService.getDesembolsosPrestamo(this.prestamo.id);
    if (desembolsos) {

    }
    this.desembolsos = desembolsos;

    let vigentes = await this.prestamosService.getPrestamosEstadoMunicipalidad('Acreditado', this.prestamo.id_municipalidad);
    if (vigentes) {
      this.vigentes = vigentes;
      for (let v = 0; v < this.vigentes.length; v++) {
        let destinos = await this.destinos_prestamosService.getDestinosPrestamosPrestamo(this.vigentes[v].id);
        if (destinos) {
          this.vigentes[v].destinos = destinos;
        }

        let movimiento = await this.movimientosService.getMovimientosUltimo(this.prestamo.id);
        if (movimiento) {
          this.vigentes[v].saldo = movimiento.saldo_final;
        }
      }
    }

    let aporte = await this.aportesService.getAportesDepartamentoMunicipioMes(this.prestamo.municipalidad.departamento.codigo, this.prestamo.municipalidad.municipio.codigo, moment(this.prestamo.fecha_amortizacion).format('YYYY-MM'))
    if (aporte) {
      this.aporte = aporte;
    }
    let rep: any = await this.reportesService.get('prestamos/pr-resolucion');
    let contenido: any = document.getElementById('pr-resolucion');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{departamento}}", this.prestamo.municipalidad.departamento.nombre);
    rep = rep.replaceAll("{{municipio}}", this.prestamo.municipalidad.municipio.nombre);
    rep = rep.replaceAll("{{no_resolucion}}", `${this.prestamo.resolucion.numero}`);
    rep = rep.replaceAll("{{no_dictamen}}", `${this.prestamo.no_dictamen}`);
    rep = rep.replaceAll("{{no_convenio}}", `${this.prestamo.no_convenio}`);
    rep = rep.replaceAll("{{no_convenio_i}}", `${this.prestamo.municipalidad.no_convenio}`);

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{contenido}}", contenido);
    rep = rep.replaceAll("{{letra}}", this.conf.letra);
    rep = rep.replaceAll("{{interlineado}}", this.conf.interlineado);
    rep = rep.replaceAll("{{ancho}}", this.conf.ancho);
    rep = rep.replaceAll("{{alto}}", this.conf.alto);

    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();

    this.ngxService.stop();
  }

  public async reporteConvenioAsistencia() {
    this.ngxService.start();

    let representante = await this.representantesService.getRepresentanteUltimo('Activo');
    if (representante) {
      this.representante = representante;
    }

    let funcionario = await this.funcionariosService.getFuncionarioUltimo(this.municipalidad.id, 'Activo');
    if (funcionario) {
      this.funcionario = funcionario;
    }

    this.banco = this.prestamo.municipalidad.banco;
    

    let rep: any = await this.reportesService.get('prestamos/pr-convenio-asistencia-fi');
    let contenido: any = document.getElementById('pr-convenio-asistencia-fi');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{departamento}}", this.prestamo.municipalidad.departamento.nombre);
    rep = rep.replaceAll("{{municipio}}", this.prestamo.municipalidad.municipio.nombre);
    rep = rep.replaceAll("{{no_resolucion}}", `${this.prestamo.resolucion.numero}`);
    rep = rep.replaceAll("{{no_dictamen}}", `${this.prestamo.no_dictamen}`);
    rep = rep.replaceAll("{{no_convenio}}", `${this.prestamo.no_convenio}`);
    rep = rep.replaceAll("{{no_convenio_i}}", `${this.prestamo.municipalidad.no_convenio}`);

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{contenido}}", contenido);
    rep = rep.replaceAll("{{letra}}", this.conf.letra);
    rep = rep.replaceAll("{{interlineado}}", this.conf.interlineado);
    rep = rep.replaceAll("{{ancho}}", this.conf.ancho);
    rep = rep.replaceAll("{{alto}}", this.conf.alto);

    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();

    this.ngxService.stop();
  }

  public async reporteConvenioInter() {
    this.ngxService.start();

    let representante = await this.representantesService.getRepresentanteUltimo('Activo');
    if (representante) {
      this.representante = representante;
    }

    let funcionario = await this.funcionariosService.getFuncionarioUltimo(this.municipalidad.id, 'Activo');
    if (funcionario) {
      this.funcionario = funcionario;
    }

    this.banco = this.prestamo.municipalidad.banco;

    let rep: any = await this.reportesService.get('prestamos/pr-convenio-interistitucional');
    let contenido: any = document.getElementById('pr-convenio-interistitucional');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{departamento}}", this.prestamo.municipalidad.departamento.nombre);
    rep = rep.replaceAll("{{municipio}}", this.prestamo.municipalidad.municipio.nombre);
    rep = rep.replaceAll("{{no_resolucion}}", `${this.prestamo.resolucion.numero}`);
    rep = rep.replaceAll("{{no_dictamen}}", `${this.prestamo.no_dictamen}`);
    rep = rep.replaceAll("{{no_convenio}}", `${this.prestamo.no_convenio}`);
    rep = rep.replaceAll("{{no_convenio_i}}", `${this.prestamo.municipalidad.no_convenio}`);

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{contenido}}", contenido);
    rep = rep.replaceAll("{{letra}}", this.conf.letra);
    rep = rep.replaceAll("{{interlineado}}", this.conf.interlineado);
    rep = rep.replaceAll("{{ancho}}", this.conf.ancho);
    rep = rep.replaceAll("{{alto}}", this.conf.alto);

    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();

    this.ngxService.stop();
  }

  public async reporteOrdenPago() {
    this.ngxService.start();

    let rep: any = await this.reportesService.get('prestamos/pr-orden-pago');
    let contenido: any = document.getElementById('pr-orden-pago');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{departamento}}", this.prestamo.municipalidad.departamento.nombre);
    rep = rep.replaceAll("{{municipio}}", this.prestamo.municipalidad.municipio.nombre);
    rep = rep.replaceAll("{{no_resolucion}}", `${this.prestamo.resolucion.numero}`);
    rep = rep.replaceAll("{{no_dictamen}}", `${this.prestamo.no_dictamen}`);
    rep = rep.replaceAll("{{no_convenio}}", `${this.prestamo.no_convenio}`);
    rep = rep.replaceAll("{{no_convenio_i}}", `${this.prestamo.municipalidad.no_convenio}`);

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{contenido}}", contenido);
    rep = rep.replaceAll("{{letraD}}", this.conf.letra + 1);
    rep = rep.replaceAll("{{interlineadoD}}", this.conf.interlineado + 1);
    rep = rep.replaceAll("{{letra}}", this.conf.letra);
    rep = rep.replaceAll("{{interlineado}}", this.conf.interlineado);
    rep = rep.replaceAll("{{ancho}}", this.conf.ancho);
    rep = rep.replaceAll("{{alto}}", this.conf.alto);

    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();

    this.ngxService.stop();
  }

  public async reporteCedula() {
    this.ngxService.start();

    let rep: any = await this.reportesService.get('prestamos/pr-cedula-prestamo');
    let contenido: any = document.getElementById('pr-cedula-prestamo');
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{contenido}}", contenido);

    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();

    this.ngxService.stop();
  }

  letras(number: any) {
    return numeroALetras(number);
  }

  letrasMoneda(number: any) {
    return numeroALetrasMoneda(number);
  }

  letrasDPI(d: string) {
    // let f = `${d[0]}${d[1]}${d[2]}${d[3]} ${d[4]}${d[5]}${d[6]}${d[7]}${d[8]} ${d[9]}${d[10]}${d[11]}${d[12]}`;
    let g = d.split(' ');
    return `${numeroALetrasDPI(g[0])}, ${numeroALetrasDPI(g[1])}, ${g[2][0] == '0' ? 'CERO' : ''} ${numeroALetrasDPI(g[2])}`;
  }

  letrasDoc(d: string) {
    let texto = '';
    let g: any = d.split('-');
    for (let i = 0; i < g.length; i++) {
      if(isNaN(g[i])) {
        texto += `${g[i]}`;
      } else {
        if (g[i][0] == '0') {
          texto += 'CERO ';
        }
        // if (g[i][1] == '0') {
        //   texto += 'CERO ';
        // }
        texto += `${numeroALetrasDPI(g[i])}`;
      }
      if(i < g.length - 1) {
        texto += ' GUION '
      }
    }
    return texto;
  }

  letrasFecha(date: any) {
    let dia = moment().format('DD');
    let mes = moment().format('MMMM');
    let anio = moment().format('YYYY');
    if (date) {
      dia = moment(date).format('DD');
      mes = moment(date).format('MMMM');
      anio = moment(date).format('YYYY');
    }
    return `${numeroALetras(dia)} (${dia}) de ${mes} del ${numeroALetras(anio)} (${anio})`.toLowerCase();
  }

  letrasEdad(date: any) {
    return this.letras(this.getEdad(date)).toLowerCase();
  }

  fecha(date: any) {
    let fecha = moment().format('DD/MM/YYYY');
    if (date) {
      fecha = moment(date).format('DD/MM/YYYY');
    }
    return fecha;
  }

  formatoFecha(date: any, format: string) {
    if (date) {
      return moment(date).format(format)
    }
    return moment().format(format)
  }

  print(rep: any) {
    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();
  }

  // Disponibilidad

  public async getDisponibilidad(print: boolean = true) {
    this.ngxService.start();

    this.totales_disp = {
      constitucional: 0,
      iva_paz: 0,
      total: 0
    }

    this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
    if (this.municipalidad) {
      let periodo_gracia = parseInt(this.prestamoForm.controls['periodo_gracia'].value);
      let mes = moment(this.prestamoForm.controls['fecha_amortizacion'].value).format('YYYY-MM');
      let aporte = await this.aportesService.getAportesDepartamentoMunicipioMes(this.filtros.codigo_departamento, this.filtros.codigo_municipio, mes);
      if (!aporte) {
        // this.alert.alertMax('Operacion Incorrecta', `Aporte de ${mes} no encontrado`, 'error');
        // this.ngxService.stop();
        // return;
        aporte = await this.aportesService.getAportesDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      }
      this.garantias = await this.garantiasService.getGarantias();
      let prestamos = await this.prestamosService.getPrestamosEstadoMunicipalidad('Acreditado', this.municipalidad.id);
      for (let i = 0; i < prestamos.length; i++) {
        let prestamos_garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(prestamos[i].id);
        prestamos[i].prestamos_garantias = prestamos_garantias
      }

      aporte.mes = moment(aporte.mes).add(periodo_gracia, 'months');
      this.disponibilidad = [];
      for (let i = 0; i < this.filtros.plazo_meses; i++) {
        this.disponibilidad.push({
          mes: moment(aporte.mes).add(i, 'month').format('YYYY-MM'),
        });
      }

      for (let g = 0; g < this.garantias.length; g++) {
        this.garantias[g].prestamos = [];
        if (this.garantias[g].id == 1) {
          this.garantias[g].aporte_total = aporte.constitucional;
          this.garantias[g].aporte = aporte.constitucional * this.garantias[g].porcentaje / 100;
        }
        if (this.garantias[g].id == 2) {
          this.garantias[g].aporte_total = aporte.iva_paz
          this.garantias[g].aporte = aporte.iva_paz * this.garantias[g].porcentaje / 100;
        }
        this.garantias[g].aporte = Math.round((this.garantias[g].aporte + Number.EPSILON) * 100) / 100;

        for (let p = 0; p < prestamos.length; p++) {
          for (let pg = 0; pg < prestamos[p].prestamos_garantias.length; pg++) {
            if (prestamos[p].prestamos_garantias[pg].id_garantia == this.garantias[g].id) {

              let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
              let monto_total = parseFloat(prestamos[p].prestamos_garantias[pg].monto);
              let plazo_meses = parseFloat(prestamos[p].plazo_meses);
              let tasa = parseFloat(prestamos[p].tasa);
              let fecha = prestamos[p].fecha_amortizacion;

              let proyecciones = await this.prestamosService.getProyeccion(monto_total, plazo_meses, tasa, fecha, porcentaje_iva);

              this.garantias[g].prestamos.push({
                no_prestamo: prestamos[p].no_prestamo,
                monto: prestamos[p].prestamos_garantias[pg].monto,
                proyecciones: proyecciones
              })
            }
          }
        }

        for (let i = 0; i < this.disponibilidad.length; i++) {

          let monto = this.getMontoDispTotal(this.disponibilidad[i].mes, this.garantias[g].prestamos, this.garantias[g].aporte);
          if (this.prestamoForm.controls['id_programa'].value == 1 && this.garantias[g].id == 1) {
            for (let p = 0; p < this.proyecciones.length; p++) {
              if (this.disponibilidad[i].mes == moment(this.proyecciones[p].fecha_fin).format('YYYY-MM')) {
                this.proyecciones[p].disponible = monto;
              }
            }
          }
          if (this.prestamoForm.controls['id_programa'].value == 2 && this.garantias[g].id == 2) {
            for (let p = 0; p < this.proyecciones.length; p++) {
              if (this.disponibilidad[i].mes == moment(this.proyecciones[p].fecha_fin).format('YYYY-MM')) {
                this.proyecciones[p].disponible = monto;
              }
            }
          }
          if (this.prestamoForm.controls['id_programa'].value == '3') {
            for (let p = 0; p < this.proyecciones.length; p++) {
              if (this.disponibilidad[i].mes == moment(this.proyecciones[p].fecha_fin).format('YYYY-MM')) {
                this.proyecciones[p].disponible = this.getMontoDispTotalDisponible(this.disponibilidad[i].mes);
              }
            }
          }

        }

        let tot = this.getTotalMontoDispTotal(this.garantias[g].prestamos, this.garantias[g].aporte);
        if (this.garantias[g].id == 1) {
          this.totales_disp.constitucional = tot
        }
        if (this.garantias[g].id == 2) {
          this.totales_disp.iva_paz = tot
        }
        this.totales_disp.total = this.getTotalMontoDispTotalDisponible();

      }

      this.disp = true;
      for (let p = 0; p < this.proyecciones.length; p++) {
        if (this.proyecciones[p].cuota > this.proyecciones[p].disponible) {
          this.disp = false;
        }
      }

      let rep: any = await this.reportesService.get('disponibilidad');
      rep = rep.replaceAll("{{codigo_municipalidad}}", `${this.municipalidad.departamento.codigo}.${this.municipalidad.municipio.codigo}`);
      rep = rep.replaceAll("{{constitucional}}", parseFloat(aporte.constitucional).toLocaleString('en-US'));
      rep = rep.replaceAll("{{iva_paz}}", parseFloat(aporte.iva_paz).toLocaleString('en-US'));
      rep = rep.replaceAll("{{municipalidad}}", `${this.municipalidad.municipio.nombre}, ${this.municipalidad.departamento.nombre}`);

      let contenido: any = document.getElementById('disponibilidad');
      contenido = contenido.innerHTML.toString();

      rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
      rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
      rep = rep.replaceAll("{{contenido}}", contenido);

      if (print) {
        this.print(rep)
      }

    } else {
      this.alert.alertMax('Operacion Incorrecta', 'Municipalidad no encontrada', 'error');
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

    if (prestamos) {
      for (let p = 0; p < prestamos.length; p++) {
        for (let a = 0; a < prestamos[p].proyecciones.length; a++) {
          let mes_inicio = moment(prestamos[p].proyecciones[a].fecha_inicio).format('YYYY-MM');
          let mes_fin = moment(prestamos[p].proyecciones[a].fecha_fin).format('YYYY-MM');
          if (mes_fin == mes) {
            total -= prestamos[p].proyecciones[a].cuota;
          }
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

  getSumaAportes(constitucional: any, iva_paz: any) {
    return parseFloat(constitucional) + parseFloat(iva_paz);
  }

  getAmortizacionIguales() {
    let monto = this.prestamo.monto / this.prestamo.plazo_meses;
    for (let p = 0; p < this.proyecciones.length; p++) {
      if (monto != this.proyecciones[p].capital) {
        return false;
      }
    }
    return true;
  }

  getEdad(fecha_nacimiento: any) {
    let nacimiento = moment(fecha_nacimiento);
    let hoy = moment();
    let anios = hoy.diff(nacimiento, "years");
    return anios;
  }

}
