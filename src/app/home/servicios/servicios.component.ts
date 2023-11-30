import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';
import { RegionalesService } from 'src/app/services/catalogos/regionales.service';
import { FuncionariosService } from 'src/app/services/funcionarios.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import Swal from 'sweetalert2';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios.service';
import { HomeComponent } from '../home.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from 'src/app/app.component';
import { AmortizacionesDetallesService } from 'src/app/services/amortizaciones_detalles.service';
import { ProgramasService } from 'src/app/services/catalogos/programas.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { ProgramasGarantiasService } from 'src/app/services/catalogos/programas-garantias.service';
import { TiposServiciosService } from 'src/app/services/catalogos/tipos-servicios.service';
import { DestinosService } from 'src/app/services/catalogos/destinos.service';
import { DesembolsosService } from 'src/app/services/desembolsos.service';
import { ResolucionesService } from 'src/app/services/catalogos/resoluciones.service';
import { ReporteService } from 'src/app/services/reportes.service';
import { OrdenesPagosService } from 'src/app/services/ordenes_pagos.service';
import { ProyeccionesService } from 'src/app/services/proyecciones.service';
import { AportesService } from 'src/app/services/aportes.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';

declare function numeroALetras(number: any): any;
declare function numeroALetrasMoneda(number: any): any;

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {

  servicioForm: FormGroup;
  amortizacionForm: FormGroup;
  destinoServicioForm: FormGroup;
  desembolsoForm: FormGroup;
  ordenPagoForm: FormGroup;

  servicios: any = [];
  servicio: any;
  municipalidad: any;
  servicios_garantias: any = [];

  file: any;

  programas: any = [];
  tipos_servicios: any = [];
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
  destinos_servicios: any = [];
  destino_servicio: any;
  desembolsos: any = [];
  desembolso: any;
  ordenes_pagos: any = [];
  orden_pago: any;
  vigentes: any = [];

  aporte: any;

  estado: string = 'Pendiente';

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

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private departamentosService: DepartamentosService,
    private municipiosService: MunicipiosService,
    private serviciosService: ServiciosService,
    private tipos_serviciosService: TiposServiciosService,
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
    private destinosService: DestinosService,
    private desembolsosService: DesembolsosService,
    private ordenes_pagosService: OrdenesPagosService,
    private resolucionesService: ResolucionesService,
    private reportesService: ReporteService,
    private aportesService: AportesService,
    private movimientosService: MovimientosService
  ) {
    this.servicioForm = new FormGroup({
      no_dictamen: new FormControl(null),
      no_convenio: new FormControl(null),
      no_servicio: new FormControl(null),
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
      id_tipo_servicio: new FormControl(null, [Validators.required]),
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
    this.destinoServicioForm = new FormGroup({
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
    this.getTiposServicios();
    this.getTiposServicios();
    this.getProgramas();
    this.getGarantias();
    this.getDestinos();
    await this.getServicios();
    await this.getCountServicios();
  }

  get configuracion() {
    return HomeComponent.configuracion;
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
    let no_servicio: string = '';

    let fecha_inicio = moment().startOf('year').format('YYYY-MM-DD');
    let fecha_fin = moment().endOf('year').format('YYYY-MM-DD');
    let id_tipo_prestamo = this.servicioForm.controls['id_tipo_prestamo'].value;
    let id_programa = this.servicioForm.controls['id_programa'].value;
    let tipo_clase = await this.serviciosService.getCountServiciosTipoServicioPrograma(id_tipo_prestamo, id_programa, fecha_inicio, fecha_fin);
    if (this.filtros.codigo_departamento && this.filtros.codigo_municipio) {
      this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
    }

    let prestamo_muni = await this.serviciosService.getCountServiciosMunicipalidad(this.municipalidad.id);
    let prestamo_ano = await this.serviciosService.getCountServiciosFecha(fecha_inicio, fecha_fin)

    if (id_tipo_prestamo && id_programa && this.municipalidad) {

      no_servicio += this.municipalidad.departamento.codigo;
      no_servicio += '.'
      no_servicio += this.municipalidad.municipio.codigo;
      no_servicio += '.'
      no_servicio += prestamo_muni + 1;
      no_servicio += '.'

      for (let t = 0; t < this.tipos_servicios.length; t++) {
        if (this.tipos_servicios[t].id == id_tipo_prestamo) {
          no_servicio += this.tipos_servicios[t].siglas;
          no_servicio += '.FP.'
          no_dictamen += this.tipos_servicios[t].siglas;
          no_dictamen += '.FP.'
          no_convenio += this.tipos_servicios[t].siglas;
          no_convenio += '-'
        }
      }

      for (let t = 0; t < this.programas.length; t++) {
        if (this.programas[t].id == id_programa) {
          no_servicio += this.programas[t].siglas;

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

      this.servicioForm.controls['no_servicio'].setValue(no_servicio);
      this.servicioForm.controls['no_dictamen'].setValue(no_dictamen);
      this.servicioForm.controls['no_convenio'].setValue(no_convenio);

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
            this.servicioForm.controls['id_municipalidad'].setValue(municipalidad.id);
            this.municipalidad = municipalidad;
            this.filtros.id_municipalidad = municipalidad.id;
          }
        }
      }
    } else {
      let municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      if (municipalidad) {
        this.servicioForm.controls['id_municipalidad'].setValue(municipalidad.id);
        this.municipalidad = municipalidad;
        this.filtros.id_municipalidad = municipalidad.id;
      }
    }
  }

  async setDestino(event: any) {
    for (let d = 0; d < this.destinos.length; d++) {
      if (event.target.value == this.destinos[d].id) {
        this.destino = this.destinos[d];
        this.destinoServicioForm.controls['id_destino'].setValue(this.destino.id);
      }
    }
  }

  async getServicios() {
    this.ngxService.start();
    let servicios = await this.serviciosService.getServiciosEstadoFecha(this.estado, this.fecha_inicio, this.fecha_fin);
    if (servicios) {
      this.servicios = servicios;
    }
    this.ngxService.stop();
  }

  async getServiciosFiltros() {
    let servicios = await this.serviciosService.getServiciosFiltros(this.filtros);
    if (servicios) {
      this.servicios = servicios;
    }
  }

  getTipoServicio() {
    for (let t = 0; t < this.tipos_servicios.length; t++) {
      if (this.servicioForm.controls['id_tipo_prestamo'].value == this.tipos_servicios[t].id) {
        return this.tipos_servicios[t];
      }
    }
  }

  async getCountServicios() {
    this.counts = {};
    this.counts.pendientes = await this.serviciosService.getCountServiciosEstado('Pendiente', this.fecha_inicio, this.fecha_fin);
    this.counts.aprobados = await this.serviciosService.getCountServiciosEstado('Aprobado', this.fecha_inicio, this.fecha_fin);
    this.counts.acreditados = await this.serviciosService.getCountServiciosEstado('Acreditado', this.fecha_inicio, this.fecha_fin);
    this.counts.cancelados = await this.serviciosService.getCountServiciosEstado('Cancelado', this.fecha_inicio, this.fecha_fin);
    this.counts.anulados = await this.serviciosService.getCountServiciosEstado('Anulado', this.fecha_inicio, this.fecha_fin);
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

  async getTiposServicios() {
    this.ngxService.start();
    let tipos_servicios = await this.tipos_serviciosService.getTiposServicios();
    if (tipos_servicios) {
      this.tipos_servicios = tipos_servicios;
    }
    this.ngxService.stop();
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
      this.servicioForm.controls['monto'].setValue(0);

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
    let monto_total = parseFloat(this.servicioForm.controls['monto'].value);
    let plazo_meses = parseFloat(this.servicioForm.controls['plazo_meses'].value);
    let tasa = parseFloat(this.servicioForm.controls['tasa'].value);
    let periodo_gracia = parseFloat(this.servicioForm.controls['periodo_gracia'].value);
    let fecha = moment(this.servicioForm.controls['fecha_amortizacion'].value).add(periodo_gracia, 'month').format('YYYY-MM-DD');

    this.amortizaciones = await this.serviciosService.getProyeccion(monto_total, plazo_meses, tasa, fecha, porcentaje_iva);
  }

  async getProyeccion2() {
    this.disp = null;

    let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
    let monto_total = parseFloat(this.servicioForm.controls['monto'].value);
    let plazo_meses = parseFloat(this.servicioForm.controls['plazo_meses'].value);
    let fecha_amortizacion = this.servicioForm.controls['fecha_amortizacion'].value;
    let tasa = parseFloat(this.servicioForm.controls['tasa'].value);
    let periodo_gracia = parseFloat(this.servicioForm.controls['periodo_gracia'].value);
    let fecha = moment(this.servicioForm.controls['fecha_amortizacion'].value).add(periodo_gracia, 'month').format('YYYY-MM-DD');

    this.proyecciones = [];
    this.proyecciones = await this.serviciosService.getProyeccion(monto_total, plazo_meses, tasa, fecha, porcentaje_iva);

    this.filtros.plazo_meses = plazo_meses;
    this.servicioForm.controls['fecha_vencimiento'].setValue(moment(fecha_amortizacion).add(plazo_meses - 1, 'months').endOf('month').format('YYYY-MM-DD'));
  }

  async updateProyeccion() {
    this.disp = null;
    let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
    let monto_total = parseFloat(this.servicioForm.controls['monto'].value);
    let tasa = parseFloat(this.servicioForm.controls['tasa'].value);

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
    let total = parseFloat(this.servicioForm.controls['monto'].value);

    for (let c = 0; c < this.tipos_servicios.length; c++) {
      let monto_min = parseFloat(this.tipos_servicios[c].monto_min);
      let monto_max = parseFloat(this.tipos_servicios[c].monto_max);
      if (monto_max) {
        if (total >= monto_min && total <= monto_max) {
          this.servicioForm.controls['id_tipo_prestamo'].setValue(this.tipos_servicios[c].id);
        }
      } else {
        if (total >= monto_min) {
          this.servicioForm.controls['id_tipo_prestamo'].setValue(this.tipos_servicios[c].id);
        }
      }
    }
    this.setMonto()
  }

  async setMonto(edit: boolean = false) {
    let total = parseFloat(this.servicioForm.controls['monto'].value);

    for (let g = 0; g < this.programas_garantias.length; g++) {
      this.programas_garantias[g].monto = total * this.programas_garantias[g].porcentaje / 100;
    }

    if (edit) {
      for (let g = 0; g < this.servicios_garantias.length; g++) {
        this.servicios_garantias[g].monto = total * this.servicios_garantias[g].porcentaje / 100;
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
      for (let g = 0; g < this.servicios_garantias.length; g++) {
        total += parseFloat(this.servicios_garantias[g].monto)
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
      for (let g = 0; g < this.servicios_garantias.length; g++) {
        porcentaje += parseFloat(this.servicios_garantias[g].porcentaje)
      }
    }
    return porcentaje;
  }

  async postServicio() {
    this.ngxService.start();
    await this.setCorrelativo();

    let prestamo = await this.serviciosService.postServicio(this.servicioForm.value);
    if (prestamo.resultado) {

      let monto_total = parseFloat(this.servicioForm.controls['monto'].value);

      for (let p = 0; p < this.proyecciones.length; p++) {
        this.proyecciones[p].id_prestamo = prestamo.data.id;
        await this.proyeccionesService.postProyeccion(this.proyecciones[p])
      }

      await this.getServicios();
      await this.getCountServicios();
      this.alert.alertMax('Operacion Correcta', prestamo.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putServicio() {
    let estado = this.servicioForm.controls['estado'].value;
    if (estado == 'Cancelado') {
      let saldo_final = (this.amortizaciones.length ? parseFloat(this.amortizaciones[this.amortizaciones.length - 1].saldo_final) : this.servicio.monto).toFixed(2);
      if (parseInt(saldo_final) != 0) {
        this.alert.alertMax('Operacion Incorrecta', `Servicio con Q${saldo_final} de saldo pendiente`, 'error');
        return;
      }
    }
    this.ngxService.start();
    let prestamo = await this.serviciosService.putServicio(this.servicio.id, this.servicioForm.value);
    if (prestamo.resultado) {

      // await this.proyeccionesService.deleteProyeccionesServicio(this.prestamo.id)

      // for (let p = 0; p < this.proyecciones.length; p++) {
      //   this.proyecciones[p].id_prestamo = prestamo.data.id;
      //   await this.proyeccionesService.postProyeccion(this.proyecciones[p])
      // }

      await this.getServicios();
      await this.getCountServicios();
      this.alert.alertMax('Operacion Correcta', prestamo.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async deleteServicio(i: any, index: number) {
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
        let prestamo = await this.serviciosService.deleteServicio(i.id);
        if (prestamo.resultado) {
          this.servicios.splice(index, 1);
          await this.getCountServicios();
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
      this.servicioForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }


  // Metodos para obtener data y id de registro seleccionado
  async setServicio(i: any, index: number) {
    i.index = index;
    this.servicio = i;
    this.servicioForm.controls['no_dictamen'].setValue(i.no_dictamen);
    this.servicioForm.controls['no_convenio'].setValue(i.no_convenio);
    this.servicioForm.controls['no_servicio'].setValue(i.no_servicio);
    this.servicioForm.controls['fecha'].setValue(i.fecha ? moment.utc(i.fecha).format('YYYY-MM-DD') : i.fecha);
    this.servicioForm.controls['fecha_amortizacion'].setValue(i.fecha_amortizacion ? moment.utc(i.fecha_amortizacion).format('YYYY-MM-DD') : i.fecha_amortizacion);
    this.servicioForm.controls['fecha_vencimiento'].setValue(i.fecha_vencimiento ? moment.utc(i.fecha_vencimiento).format('YYYY-MM-DD') : i.fecha_vencimiento);
    this.servicioForm.controls['monto'].setValue(i.monto);
    this.servicioForm.controls['plazo_meses'].setValue(i.plazo_meses);
    this.servicioForm.controls['fecha_acta'].setValue(i.fecha_acta ? moment.utc(i.fecha_acta).format('YYYY-MM-DD') : i.fecha_acta);
    this.servicioForm.controls['tasa'].setValue(i.tasa);
    this.servicioForm.controls['periodo_gracia'].setValue(i.periodo_gracia);
    this.servicioForm.controls['destino'].setValue(i.destino);
    this.servicioForm.controls['no_destinos'].setValue(i.no_destinos);
    this.servicioForm.controls['acta'].setValue(i.acta);
    this.servicioForm.controls['punto'].setValue(i.punto);
    this.servicioForm.controls['fecha_memorial'].setValue(i.fecha_memorial ? moment.utc(i.fecha_memorial).format('YYYY-MM-DD') : i.fecha_memorial);
    this.servicioForm.controls['certificacion'].setValue(i.certificacion);
    this.servicioForm.controls['no_oficio_aj'].setValue(i.no_oficio_aj);
    this.servicioForm.controls['fecha_oficio_aj'].setValue(i.fecha_oficio_aj);
    this.servicioForm.controls['no_oficio_ger'].setValue(i.no_oficio_ger);
    this.servicioForm.controls['fecha_oficio_ger'].setValue(i.fecha_oficio_ger);
    this.servicioForm.controls['motivo_anulacion'].setValue(i.motivo_anulacion);
    this.servicioForm.controls['estado'].setValue(i.estado);
    this.servicioForm.controls['id_tipo_prestamo'].setValue(i.id_tipo_prestamo);
    this.servicioForm.controls['id_programa'].setValue(i.id_programa);
    this.servicioForm.controls['id_municipalidad'].setValue(i.id_municipalidad);
    this.servicioForm.controls['id_resolucion'].setValue(i.id_resolucion);
    this.servicioForm.controls['id_funcionario'].setValue(i.id_funcionario);
    this.servicioForm.controls['id_regional'].setValue(i.id_regional);
    this.servicioForm.controls['id_usuario'].setValue(i.id_usuario);

    this.amortizacionForm.controls['id_prestamo'].setValue(i.id);
    this.destinoServicioForm.controls['id_prestamo'].setValue(i.id);
    this.desembolsoForm.controls['id_prestamo'].setValue(i.id);
    this.ordenPagoForm.controls['id_prestamo'].setValue(i.id);

    this.proyecciones = await this.proyeccionesService.getProyeccionesServicio(i.id);

    this.municipalidad = i.municipalidad;
    this.filtros.codigo_departamento = i.municipalidad.departamento.codigo;
    this.filtros.codigo_municipio = i.municipalidad.municipio.codigo;

    this.calcAmortizacion();
  }

  async setDestinoServicio(i: any, index: number) {
    i.index = index;
    this.destino_servicio = i;
    this.destino = i.destino;

    this.destinoServicioForm.controls['descripcion'].setValue(i.descripcion);
    this.destinoServicioForm.controls['monto'].setValue(i.monto);
    this.destinoServicioForm.controls['id_destino'].setValue(i.id_destino);
    this.destinoServicioForm.controls['id_prestamo'].setValue(i.id_prestamo);
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

    this.orden_pago.fecha = moment(this.orden_pago.fecha).format('d [de] MMMM [de] YYYY')
  }

  async getAmortizaciones(i: any, index: number) {
    i.index = index;
    this.servicio = i;

    this.ngxService.start();
    this.amortizaciones = [];
    let amortizaciones = await this.amortizacionesService.getAmortizacionesServicio(this.servicio.id);
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
    let monto_total = this.servicio.monto;
    let plazo_meses = parseFloat(this.servicio.plazo_meses);
    let tasa = parseFloat(this.servicio.tasa);

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

  getTotalDestinosServicios() {
    let total = 0;
    for (let a = 0; a < this.destinos_servicios.length; a++) {
      total += parseFloat(this.destinos_servicios[a].monto);
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
    if (this.destinos_servicios.length == parseInt(this.servicio.no_destinos)) {
      if (parseFloat(this.servicio.monto) == this.getTotalDestinosServicios()) {
        return true
      }
    }
    return false;
  }

  desembolsosCompletos() {
    if (parseFloat(this.servicio.monto) == this.getTotalDesembolsos()) {
      return true
    }
    return false;
  }

  ordenesPagosCompletos() {
    if (parseFloat(this.servicio.monto) == this.getTotalOrdenesPagos()) {
      return true
    }
    return false;
  }

  limpiar() {
    this.servicioForm.reset();
    // this.prestamoForm.controls['no_dictamen'].setValue(1);
    // this.prestamoForm.controls['no_convenio'].setValue(1);
    // this.prestamoForm.controls['no_servicio'].setValue(1);

    this.servicioForm.controls['fecha'].setValue(moment.utc().format('YYYY-MM-DD'));
    this.servicioForm.controls['monto'].setValue(0);
    this.servicioForm.controls['tasa'].setValue(this.configuracion.porcentaje_tasa);
    this.servicioForm.controls['periodo_gracia'].setValue(0);
    this.servicioForm.controls['estado'].setValue('Pendiente');
    this.servicioForm.controls['id_usuario'].setValue(HomeComponent.id_usuario);

    this.servicioForm.controls['id_regional'].setValue(this.regionales[0].id);
    this.servicioForm.controls['id_funcionario'].setValue(this.funcionarios[0].id);

    this.servicio = null;
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
    this.amortizacionForm.controls['id_prestamo'].setValue(this.servicio.id);
    this.amortizacion = null;
  }

  limpiar3() {
    this.destinoServicioForm.reset();
    this.destinoServicioForm.controls['id_prestamo'].setValue(this.servicio.id);
    this.destino_servicio = null;
    this.destino = {
      codigo: null
    };
  }

  limpiar4() {
    this.desembolsoForm.reset();
    this.desembolsoForm.controls['id_prestamo'].setValue(this.servicio.id);
    this.desembolso = null;
  }

  limpiar5() {
    this.ordenPagoForm.reset();
    this.ordenPagoForm.controls['no_desembolso'].setValue(this.ordenes_pagos.length + 1);
    this.ordenPagoForm.controls['id_prestamo'].setValue(this.servicio.id);
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

  recibirDisp(event: any) {
    this.disponibilidad = event;

    for (let c = 0; c < this.programas_garantias.length; c++) {
      let monto = this.programas_garantias[c].monto;

      if (this.programas_garantias[c].garantia.id == 1) {
        if (monto <= this.disponibilidad.constitucional) {
          this.disp = true;
          return;
        }
      }
      if (this.programas_garantias[c].garantia.id == 2) {
        if (monto <= this.disponibilidad.iva_paz) {
          this.disp = true;
          return;
        }
      }
    }

    this.disp = false;

  }

  letras(number: number) {
    return numeroALetras(number);
  }

  letrasMoneda(number: number) {
    return numeroALetrasMoneda(number);
  }

  formatoFecha(date: string, format: string) {
    return moment(date).format(format)
  }

  print(rep: any) {
    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();
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

  getMontoDispTotal(mes: string, servicios: any, aporte: number) {
    let total = aporte;

    if (servicios) {
      for (let p = 0; p < servicios.length; p++) {
        for (let a = 0; a < servicios[p].proyecciones.length; a++) {
          let mes_inicio = moment(servicios[p].proyecciones[a].fecha_inicio).format('YYYY-MM');
          let mes_fin = moment(servicios[p].proyecciones[a].fecha_fin).format('YYYY-MM');
          if (mes_fin == mes) {
            total -= servicios[p].proyecciones[a].cuota;
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
      total += this.getMontoDispTotal(mes, this.garantias[g].servicios, this.garantias[g].aporte)
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

  getTotalMontoDispTotal(servicios: any, aporte: number) {
    let total = 0;
    for (let d = 0; d < this.disponibilidad.length; d++) {
      let tot = this.getMontoDispTotal(this.disponibilidad[d].mes, servicios, aporte);
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

}
