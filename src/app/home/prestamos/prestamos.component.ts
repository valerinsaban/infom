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
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';
import { PrestamosGarantiasService } from 'src/app/services/prestamos_garantias.service';
import { ClasesPrestamosService } from 'src/app/services/catalogos/clases-prestamos.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { ClasesPrestamosGarantiasService } from 'src/app/services/catalogos/clases-prestamos-garantias.service';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';
import { TiposPrestamosService } from 'src/app/services/catalogos/tipos-prestamos.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {

  prestamoForm: FormGroup;
  amortizacionForm: FormGroup;

  prestamos: any = [];
  prestamo: any;
  municipalidad: any;
  prestamos_garantias: any = [];

  file: any;
  reales: number = 0;

  clases_prestamos: any = [];
  tipos_prestamos: any = [];
  clases_prestamos_garantias: any = [];
  garantias: any = [];
  funcionarios: any = [];
  regionales: any = [];
  usuarios: any = [];
  departamentos: any = [];
  municipios: any = [];

  amortizaciones: any = [];
  amortizacion: any;

  estado: string = 'Pendiente';

  counts: any = {
    pendientes: null,
    aprobados: null,
    acreditados: null,
    finalizados: null,
    rechazados: null,
  }

  filtros: any = {
    id_regional: null,
    id_funcionario: null,
    id_municipalidad: null,
    id_tipo_prestamo: null,
    id_usuario: null,
    codigo_departamento: null,
    codigo_municipio: null,
    plazo_meses: 12
  }

  disponibilidad: any;
  disp: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private departamentosService: DepartamentosService,
    private municipiosService: MunicipiosService,
    private prestamosService: PrestamosService,
    private tipos_prestamosService: TiposPrestamosService,
    private clases_prestamosService: ClasesPrestamosService,
    private clases_prestamos_garantiasService: ClasesPrestamosGarantiasService,
    private garantiasService: GarantiasService,
    private municipalidadesService: MunicipalidadesService,
    private funcionariosService: FuncionariosService,
    private regionalesService: RegionalesService,
    private usuariosService: UsuariosService,
    private amortizacionesService: AmortizacionesService,
    private prestamos_garantiasService: PrestamosGarantiasService,
    private configuracionesService: ConfiguracionesService
  ) {
    this.prestamoForm = new FormGroup({
      no_dictamen: new FormControl(null),
      no_convenio: new FormControl(null),
      no_prestamo: new FormControl(null),
      fecha: new FormControl(moment.utc().format('YYYY-MM-DD'), [Validators.required]),
      fecha_amortizacion: new FormControl(null, [Validators.required]),
      monto: new FormControl(0, [Validators.required]),
      plazo_meses: new FormControl(null, [Validators.required]),
      fecha_acta: new FormControl(null),
      intereses: new FormControl(null),
      periodo_gracia: new FormControl(0),
      destino_prestamo: new FormControl(null),
      acta: new FormControl(null),
      punto: new FormControl(null),
      fecha_memorial: new FormControl(null),
      certficacion: new FormControl(null),
      no_oficio_aj: new FormControl(null),
      fecha_oficio_aj: new FormControl(null),
      no_oficio_ger: new FormControl(null),
      fecha_oficio_ger: new FormControl(null),
      estado: new FormControl(null, [Validators.required]),
      id_tipo_prestamo: new FormControl(null, [Validators.required]),
      id_clase_prestamo: new FormControl(null, [Validators.required]),
      id_municipalidad: new FormControl(null, [Validators.required]),
      id_funcionario: new FormControl(null, [Validators.required]),
      id_regional: new FormControl(null, [Validators.required]),
      id_usuario: new FormControl(HomeComponent.id_usuario, [Validators.required])
    });
    this.amortizacionForm = new FormGroup({
      fecha_inicio: new FormControl(null, [Validators.required]),
      fecha_fin: new FormControl(null, [Validators.required]),
      dias: new FormControl(null, [Validators.required]),
      capital: new FormControl(null, [Validators.required]),
      interes: new FormControl(null, [Validators.required]),
      iva: new FormControl(null, [Validators.required]),
      cuota: new FormControl(null, [Validators.required]),
      saldo: new FormControl(null, [Validators.required]),
      id_prestamo: new FormControl(null, [Validators.required])
    })
  }

  async ngOnInit() {
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');
    this.ngxService.start();
    await this.getDepartamentos();
    await this.getFuncionarios();
    await this.getRegionales();
    await this.getTiposPrestamos();
    await this.getClasesPrestamos();
    await this.getGarantias();
    await this.getUsuarios();
    await this.getPrestamos();
    await this.getCountPrestamos();
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

  async setNoPrestamo() {
    let correlativo: any = ['', '', '', '', '', '', ''];

    let id_tipo_prestamo = this.prestamoForm.controls['id_tipo_prestamo'].value;
    let id_clase_prestamo = this.prestamoForm.controls['id_clase_prestamo'].value;

    if (id_tipo_prestamo && id_clase_prestamo) {
      for (let t = 0; t < this.tipos_prestamos.length; t++) {
        if (this.tipos_prestamos[t].id == id_tipo_prestamo) {
          // Part 1
          correlativo[0] = this.tipos_prestamos[t].siglas;
        }
      }

      for (let t = 0; t < this.clases_prestamos.length; t++) {
        if (this.clases_prestamos[t].id == id_clase_prestamo) {
          // Part 2
          correlativo[1] = this.clases_prestamos[t].siglas;
        }
      }


      let tipo_clase = await this.prestamosService.getCountPrestamosTipoPrestamoClasePrestamo(id_tipo_prestamo, id_clase_prestamo);
      if (tipo_clase) {
        // Part 3
        correlativo[2] = tipo_clase + 1;
      } else {
        correlativo[2] = 1;
      }

      // Part 4
      correlativo[3] = moment().format('YYYY');

      if (this.filtros.codigo_departamento && this.filtros.codigo_municipio) {

        this.municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);

        if (this.municipalidad) {
          // Part 5, 6
          correlativo[4] = this.municipalidad.departamento.codigo;
          correlativo[5] = this.municipalidad.municipio.codigo

          let prestamo_muni = await this.prestamosService.getCountPrestamosMunicipalidad(this.municipalidad.id);
          if (prestamo_muni) {
            // Part 7
            correlativo[6] = prestamo_muni + 1;
          } else {
            correlativo[6] = 1;
          }
        }

      }

      this.prestamoForm.controls['no_prestamo'].setValue(`${correlativo[0]}.${correlativo[1]}.${correlativo[2]}.${correlativo[3]}.${correlativo[4]}.${correlativo[5]}.${correlativo[6]}`);

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
        return this.tipos_prestamos[t].nombre;
      }
    }
  }

  async getCountPrestamos() {
    this.counts = {};
    this.counts.pendientes = await this.prestamosService.getCountPrestamosEstado('Pendiente', this.fecha_inicio, this.fecha_fin);
    this.counts.aprobados = await this.prestamosService.getCountPrestamosEstado('Aprobado', this.fecha_inicio, this.fecha_fin);
    this.counts.acreditados = await this.prestamosService.getCountPrestamosEstado('Acreditado', this.fecha_inicio, this.fecha_fin);
    this.counts.finalizados = await this.prestamosService.getCountPrestamosEstado('Finalizado', this.fecha_inicio, this.fecha_fin);
    this.counts.rechazados = await this.prestamosService.getCountPrestamosEstado('Rechazado', this.fecha_inicio, this.fecha_fin);
  }

  async getGarantias() {
    this.ngxService.start();
    let garantias = await this.garantiasService.getGarantias();
    if (garantias) {
      this.garantias = garantias;
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

  async getClasesPrestamos() {
    this.ngxService.start();
    let clases_prestamos = await this.clases_prestamosService.getClasesPrestamos();
    if (clases_prestamos) {
      this.clases_prestamos = clases_prestamos;
    }
    this.ngxService.stop();
  }

  async getClasesPrestamosGarantias(event: any) {
    this.ngxService.start();
    let clases_prestamos_garantias = await this.clases_prestamos_garantiasService.getClasesPrestamosGarantias(event.target.value);
    if (clases_prestamos_garantias) {
      this.clases_prestamos_garantias = clases_prestamos_garantias;
      this.prestamoForm.controls['monto'].setValue(0);

      if (this.clases_prestamos_garantias.length == 1) {
        this.clases_prestamos_garantias[0].porcentaje = 100;
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
    let intereses = parseFloat(this.prestamoForm.controls['intereses'].value);
    let periodo_gracia = parseFloat(this.prestamoForm.controls['periodo_gracia'].value);
    let fecha = moment(this.prestamoForm.controls['fecha_amortizacion'].value).add(periodo_gracia, 'month').format('YYYY-MM-DD');

    this.amortizaciones = await this.prestamosService.getProyeccion(monto_total, plazo_meses, intereses, fecha, porcentaje_iva);
  }

  async getProyeccion2() {
    let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
    let monto_total = parseFloat(this.prestamoForm.controls['monto'].value);
    let plazo_meses = parseFloat(this.prestamoForm.controls['plazo_meses'].value);
    let intereses = parseFloat(this.prestamoForm.controls['intereses'].value);
    let periodo_gracia = parseFloat(this.prestamoForm.controls['periodo_gracia'].value);
    let fecha = moment(this.prestamoForm.controls['fecha_amortizacion'].value).add(periodo_gracia, 'month').format('YYYY-MM-DD');

    this.amortizaciones = [];
    this.amortizaciones = await this.prestamosService.getProyeccion(monto_total, plazo_meses, intereses, fecha, porcentaje_iva);
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

    for (let g = 0; g < this.clases_prestamos_garantias.length; g++) {
      this.clases_prestamos_garantias[g].monto = total * this.clases_prestamos_garantias[g].porcentaje / 100;
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
    for (let g = 0; g < this.clases_prestamos_garantias.length; g++) {
      total += parseFloat(this.clases_prestamos_garantias[g].monto)
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
    for (let g = 0; g < this.clases_prestamos_garantias.length; g++) {
      porcentaje += parseFloat(this.clases_prestamos_garantias[g].porcentaje)
    }
    if (edit) {
      porcentaje = 0;
      for (let g = 0; g < this.prestamos_garantias.length; g++) {
        porcentaje += parseFloat(this.prestamos_garantias[g].porcentaje)
      }
    }
    return porcentaje;
  }

  async postPrestamo() {
    this.ngxService.start();
    await this.setNoPrestamo();

    let prestamo = await this.prestamosService.postPrestamo(this.prestamoForm.value);
    if (prestamo.resultado) {

      let monto_total = parseFloat(this.prestamoForm.controls['monto'].value);

      for (let g = 0; g < this.clases_prestamos_garantias.length; g++) {
        if (this.clases_prestamos_garantias[g].monto && this.clases_prestamos_garantias[g].monto > 0) {

          let monto = parseFloat(this.clases_prestamos_garantias[g].monto);

          let porcentaje = monto / monto_total * 100;

          if (this.clases_prestamos_garantias[g].monto) {
            await this.prestamos_garantiasService.postPrestamoGarantia({
              monto: parseFloat(this.clases_prestamos_garantias[g].monto),
              porcentaje: porcentaje,
              id_garantia: this.clases_prestamos_garantias[g].garantia.id,
              id_prestamo: prestamo.data.id
            });
          }

        }
      }

      await this.getPrestamos();
      await this.getCountPrestamos();
      this.alert.alertMax('Transaccion Correcta', prestamo.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putPrestamo() {
    let estado = this.prestamoForm.controls['estado'].value;
    if (estado == 'Finalizado') {
      let saldo = (this.amortizaciones.length ? parseFloat(this.amortizaciones[this.amortizaciones.length - 1].saldo) : this.prestamo.monto).toFixed(2);
      if (parseInt(saldo) != 0) {
        this.alert.alertMax('Transaccion Incorrecta', `Prestamo con Q${saldo} de saldo pendiente`, 'error');
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

      await this.getPrestamos();
      await this.getCountPrestamos();
      this.alert.alertMax('Transaccion Correcta', prestamo.mensaje, 'success');
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
    i.index = index;
    this.prestamo = i;
    this.prestamoForm.controls['no_dictamen'].setValue(i.no_dictamen);
    this.prestamoForm.controls['no_convenio'].setValue(i.no_convenio);
    this.prestamoForm.controls['no_prestamo'].setValue(i.no_prestamo);
    this.prestamoForm.controls['fecha'].setValue(i.fecha ? moment.utc(i.fecha).format('YYYY-MM-DD') : i.fecha);
    this.prestamoForm.controls['fecha_amortizacion'].setValue(i.fecha_amortizacion ? moment.utc(i.fecha_amortizacion).format('YYYY-MM-DD') : i.fecha_amortizacion);
    this.prestamoForm.controls['monto'].setValue(i.monto);
    this.prestamoForm.controls['plazo_meses'].setValue(i.plazo_meses);
    this.prestamoForm.controls['fecha_acta'].setValue(i.fecha_acta ? moment.utc(i.fecha_acta).format('YYYY-MM-DD') : i.fecha_acta);
    this.prestamoForm.controls['intereses'].setValue(i.intereses);
    this.prestamoForm.controls['periodo_gracia'].setValue(i.periodo_gracia);
    this.prestamoForm.controls['destino_prestamo'].setValue(i.destino_prestamo);
    this.prestamoForm.controls['acta'].setValue(i.acta);
    this.prestamoForm.controls['punto'].setValue(i.punto);
    this.prestamoForm.controls['fecha_memorial'].setValue(i.fecha_memorial ? moment.utc(i.fecha_memorial).format('YYYY-MM-DD') : i.fecha_memorial);
    this.prestamoForm.controls['certficacion'].setValue(i.certficacion);
    this.prestamoForm.controls['no_oficio_aj'].setValue(i.no_oficio_aj);
    this.prestamoForm.controls['fecha_oficio_aj'].setValue(i.fecha_oficio_aj);
    this.prestamoForm.controls['no_oficio_ger'].setValue(i.no_oficio_ger);
    this.prestamoForm.controls['fecha_oficio_ger'].setValue(i.fecha_oficio_ger);
    this.prestamoForm.controls['estado'].setValue(i.estado);
    this.prestamoForm.controls['id_tipo_prestamo'].setValue(i.id_tipo_prestamo);
    this.prestamoForm.controls['id_clase_prestamo'].setValue(i.id_clase_prestamo);
    this.prestamoForm.controls['id_municipalidad'].setValue(i.id_municipalidad);
    this.prestamoForm.controls['id_funcionario'].setValue(i.id_funcionario);
    this.prestamoForm.controls['id_regional'].setValue(i.id_regional);
    this.prestamoForm.controls['id_usuario'].setValue(i.id_usuario);

    this.amortizacionForm.controls['id_prestamo'].setValue(i.id);

    this.prestamos_garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(i.id);

    this.municipalidad = i.municipalidad;
    this.filtros.codigo_departamento = i.municipalidad.departamento.codigo;
    this.filtros.codigo_municipio = i.municipalidad.municipio.codigo;

    await this.getProyeccion();
    this.calcAmortizacion();
  }

  async getAmortizaciones(i: any, index: number) {
    i.index = index;
    this.prestamo = i;

    this.amortizaciones = [];
    let amortizaciones = await this.amortizacionesService.getAmortizacionesPrestamo(this.prestamo.id);
    if (amortizaciones) {
      this.amortizaciones = amortizaciones;
      this.reales = amortizaciones.length;
    }
  }

  calcAmortizacion() {
    let monto_total = this.prestamo.monto;
    let plazo_meses = parseFloat(this.prestamo.plazo_meses);
    let intereses = parseFloat(this.prestamo.intereses);

    let fecha_inicio = this.amortizacionForm.controls['fecha_inicio'].value;
    let fecha_fin = this.amortizacionForm.controls['fecha_fin'].value;

    if (fecha_inicio && fecha_fin) {
      let dias = moment(fecha_fin).diff(moment(fecha_inicio), 'days') + 1;
      let capital = monto_total / plazo_meses;
      let saldo_actual = monto_total;

      if (!this.amortizacion || this.amortizacion.index == 0) {
        capital = monto_total / plazo_meses;
        saldo_actual = monto_total;
      } else {
        capital = monto_total / plazo_meses;
        // capital = parseFloat(this.amortizaciones[this.amortizacion.index - 1].capital);
        saldo_actual = parseFloat(this.amortizaciones[this.amortizacion.index - 1].saldo);
      }

      let interes = (saldo_actual * (intereses / 100) / 365) * dias;
      let iva = interes * parseFloat(this.configuracion.porcentaje_iva) / 100;
      let cuota = capital + interes + iva;
      let saldo = saldo_actual - capital;

      this.amortizacionForm.controls['dias'].setValue(dias);
      this.amortizacionForm.controls['capital'].setValue(capital.toFixed(8));
      this.amortizacionForm.controls['saldo'].setValue(saldo.toFixed(8));
      this.amortizacionForm.controls['interes'].setValue(interes.toFixed(8))
      this.amortizacionForm.controls['iva'].setValue(iva.toFixed(8))
      this.amortizacionForm.controls['cuota'].setValue(cuota.toFixed(8))

    }
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
    if (p.estado == 'Finalizado') {
      return 'finalizado'
    }
    if (p.estado == 'Rechazado') {
      return 'rechazado'
    }
    return '';
  }

  async reporte(format: string, id: number) {
    this.ngxService.start();
    window.open(HomeComponent.apiUrl + '/reportes/' + format + '/prestamo/resumen/' + id, "_blank");
    this.ngxService.stop();
  }

  limpiar() {
    this.prestamoForm.reset();
    // this.prestamoForm.controls['no_dictamen'].setValue(1);
    // this.prestamoForm.controls['no_convenio'].setValue(1);
    // this.prestamoForm.controls['no_prestamo'].setValue(1);

    this.prestamoForm.controls['fecha'].setValue(moment.utc().format('YYYY-MM-DD'));
    this.prestamoForm.controls['monto'].setValue(0);
    this.prestamoForm.controls['intereses'].setValue(this.configuracion.porcentaje_interes);
    this.prestamoForm.controls['periodo_gracia'].setValue(0);
    this.prestamoForm.controls['estado'].setValue('Pendiente');
    this.prestamoForm.controls['id_usuario'].setValue(HomeComponent.id_usuario);

    this.prestamoForm.controls['id_regional'].setValue(this.regionales[0].id);
    this.prestamoForm.controls['id_funcionario'].setValue(this.funcionarios[0].id);

    this.prestamo = null;
    this.filtros.codigo_departamento = null;
    this.filtros.codigo_municipio = null;
    this.amortizaciones = [];
    this.clases_prestamos_garantias = [];
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

  limpiarFiltros() {
    this.filtros = {
      id_regional: null,
      id_funcionario: null,
      id_municipalidad: null,
      id_tipo_prestamo: null,
      id_usuario: null,
      codigo_departamento: null,
      codigo_municipio: null
    }
  }

  recibirDisp(event: any) {
    this.disponibilidad = event;

    let monto_total = parseFloat(this.prestamoForm.controls['monto'].value);

    for (let c = 0; c < this.clases_prestamos_garantias.length; c++) {
      let monto = this.clases_prestamos_garantias[c].monto;
      if (this.clases_prestamos_garantias[c].garantia.codigo == '01') {
        if (monto <= this.disponibilidad.constitucional) {
          this.disp = true;
          return;
        }
      }
      if (this.clases_prestamos_garantias[c].garantia.codigo == '02') {
        if (monto <= this.disponibilidad.constitucional) {
          this.disp = true;
          return;
        }
      }
    }

    this.disp = false;

  }

}
