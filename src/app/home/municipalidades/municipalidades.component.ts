import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import { PermisosService } from 'src/app/services/seguridad/permisos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { BancosService } from 'src/app/services/catalogos/bancos.service';
import { AportesService } from 'src/app/services/aportes.service';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { PrestamosGarantiasService } from 'src/app/services/prestamos_garantias.service';
import { DecimalPipe } from '@angular/common';
import { AmortizacionesService } from 'src/app/services/amortizaciones.service';
import { FuncionariosService } from 'src/app/services/funcionarios.service';
import { PuestosService } from 'src/app/services/catalogos/puestos.service';
import { ProfesionesService } from 'src/app/services/catalogos/profesiones.service';
import { EstadosCivilesService } from 'src/app/services/catalogos/estados-civiles.service';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';

@Component({
  selector: 'app-municipalidades',
  templateUrl: './municipalidades.component.html',
  styleUrls: ['./municipalidades.component.css']
})
export class MunicipalidadesComponent {

  municipalidadForm: FormGroup;
  funcionarioForm: FormGroup;
  municipalidades: any = [];
  municipalidad: any;
  configuracion: any;

  departamentos: any = [];
  municipios: any = [];
  funcionarios: any = [];
  puestos: any = [];
  profesiones: any = [];
  estados_civiles: any = [];
  bancos: any = [];
  garantias: any = [];
  disponibilidad: any = [];

  departamento: any;
  municipio: any;
  funcionario: any;
  plazo_meses: any = 12;

  filtros: any = {
    mes_inicio: moment().startOf('year').format('YYYY-MM'),
    mes_fin: moment().endOf('year').format('YYYY-MM'),
    codigo_departamento: '05',
    codigo_municipio: '07'
  }

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private municipalidadesService: MunicipalidadesService,
    private departamentosService: DepartamentosService,
    private municipiosService: MunicipiosService,
    private bancosService: BancosService,
    private aportesService: AportesService,
    private garantiasService: GarantiasService,
    private prestamosService: PrestamosService,
    private prestamos_garantiasService: PrestamosGarantiasService,
    private amortizacionesService: AmortizacionesService,
    private funcionariosService: FuncionariosService,
    private puestosService: PuestosService,
    private profesionesService: ProfesionesService,
    private estados_civilesService: EstadosCivilesService,
    private configuracionesService: ConfiguracionesService
  ) {
    this.municipalidadForm = new FormGroup({
      direccion: new FormControl(null),
      correo: new FormControl(null),
      telefono: new FormControl(null),
      no_cuenta: new FormControl(null),
      id_departamento: new FormControl(null, [Validators.required]),
      id_municipio: new FormControl(null, [Validators.required]),
      id_banco: new FormControl(null, [Validators.required])
    });
    this.funcionarioForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      fecha_nacimiento: new FormControl(null, [Validators.required]),
      dpi: new FormControl(null, [Validators.required]),
      carnet: new FormControl(null, [Validators.required]),
      fecha_carnet: new FormControl(null, [Validators.required]),
      acta_toma_posecion: new FormControl(null, [Validators.required]),
      fecha_acta_toma_posecion: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      imagen_carnet: new FormControl(null),
      imagen_acta_toma_posecion: new FormControl(null),
      imagen_fotografia: new FormControl(null),
      imagen_firma: new FormControl(null),
      id_municipalidad: new FormControl(null, [Validators.required]),
      id_puesto: new FormControl(null, [Validators.required]),
      id_profesion: new FormControl(null, [Validators.required]),
      id_estado_civil: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDepartamentos();
    await this.getBancos();
    await this.getConfiguraciones();
    this.ngxService.stop();

    await this.getMunicipalidades();
  }

  async getConfiguraciones() {
    let configuraciones = await this.configuracionesService.getConfiguraciones();
    if (configuraciones) {
      this.configuracion = configuraciones[0];
    }
  }

  async getMunicipalidades() {
    this.ngxService.start();
    this.municipalidades = [];
    if (this.filtros.codigo_departamento && this.filtros.codigo_municipio) {
      let municipalidades = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      if (municipalidades) {
        this.municipalidades.push(municipalidades);
      }
    }
    if (this.filtros.codigo_departamento && !this.filtros.codigo_municipio) {
      let municipalidades = await this.municipalidadesService.getMunicipalidadDepartamento(this.filtros.codigo_departamento);
      if (municipalidades) {
        this.municipalidades = municipalidades;
      }
    }
    this.ngxService.stop();
  }

  async getDepartamentos() {
    let departamentos = await this.departamentosService.getDepartamentos();
    if (departamentos) {
      this.departamentos = departamentos;
    }
  }

  async getMunicipios() {
    let municipios = await this.municipiosService.getMunicipioByDepartamento(this.municipalidadForm.controls['id_departamento'].value);
    if (municipios) {
      this.municipios = municipios;
    }
  }

  async getBancos() {
    let bancos = await this.bancosService.getBancos();
    if (bancos) {
      this.bancos = bancos;
    }
  }

  async getFuncionarios() {
    let funcionarios = await this.funcionariosService.getFuncionarios();
    if (funcionarios) {
      this.funcionarios = funcionarios;
    }
  }

  async getPuestos() {
    let puestos = await this.puestosService.getPuestos();
    if (puestos) {
      this.puestos = puestos;
    }
  }

  async getProfesiones() {
    let profesiones = await this.profesionesService.getProfesiones();
    if (profesiones) {
      this.profesiones = profesiones;
    }
  }

  async getEstadosCiviles() {
    let estados_civiles = await this.estados_civilesService.getEstadosCiviles();
    if (estados_civiles) {
      this.estados_civiles = estados_civiles;
    }
  }

  async changeDepartamento() {
    await this.getMunicipios();
  }

  async postMunicipalidad() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let municipalidad = await this.municipalidadesService.postMunicipalidad(this.municipalidadForm.value);
    if (municipalidad.resultado) {
      await this.getMunicipalidades();
      this.alert.alertMax('Transaccion Correcta', municipalidad.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putMunicipalidad() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let municipalidad = await this.municipalidadesService.putMunicipalidad(this.municipalidad.id, this.municipalidadForm.value);
    if (municipalidad.resultado) {
      await this.getMunicipalidades();
      this.alert.alertMax('Transaccion Correcta', municipalidad.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async deleteMunicipalidad(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
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
        let municipalidad = await this.municipalidadesService.deleteMunicipalidad(i.id);
        if (municipalidad.resultado) {
          this.municipalidades.splice(index, 1);
          this.alert.alertMax('Correcto', municipalidad.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setMunicipalidad(i: any, index: number) {
    i.index = index;
    this.municipalidad = i;
    this.municipalidadForm.controls['direccion'].setValue(i.direccion);
    this.municipalidadForm.controls['correo'].setValue(i.correo);
    this.municipalidadForm.controls['telefono'].setValue(i.telefono);
    this.municipalidadForm.controls['no_cuenta'].setValue(i.no_cuenta);
    this.municipalidadForm.controls['id_departamento'].setValue(i.id_departamento);
    this.municipalidadForm.controls['id_municipio'].setValue(i.id_municipio);
    this.municipalidadForm.controls['id_banco'].setValue(i.id_banco);

    this.getFuncionarios();
  }

  async postFuncionario() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let funcionario = await this.funcionariosService.postFuncionario(this.funcionarioForm.value);
    if (funcionario.resultado) {
      await this.getFuncionarios();
      this.alert.alertMax('Transaccion Correcta', funcionario.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putFuncionario() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let funcionario = await this.funcionariosService.putFuncionario(this.funcionario.id, this.funcionarioForm.value);
    if (funcionario.resultado) {
      await this.getFuncionarios();
      this.alert.alertMax('Transaccion Correcta', funcionario.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async deleteFuncionario(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
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
        let funcionario = await this.funcionariosService.deleteFuncionario(i.id);
        if (funcionario.resultado) {
          this.funcionarios.splice(index, 1);
          this.alert.alertMax('Correcto', funcionario.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  setFuncionario(i: any, index: number) {
    i.index = index;
    this.funcionario = i;
    this.funcionarioForm.controls['codigo'].setValue(i.codigo);
    this.funcionarioForm.controls['nombre'].setValue(i.nombre);
    this.funcionarioForm.controls['apellido'].setValue(i.apellido);
    this.funcionarioForm.controls['fecha_nacimiento'].setValue(moment.utc(i.fecha_nacimiento).format('YYYY-MM-DD'));
    this.funcionarioForm.controls['dpi'].setValue(i.dpi);
    this.funcionarioForm.controls['carnet'].setValue(i.carnet);
    this.funcionarioForm.controls['fecha_carnet'].setValue(moment.utc(i.fecha_carnet).format('YYYY-MM-DD'));
    this.funcionarioForm.controls['acta_toma_posecion'].setValue(i.acta_toma_posecion);
    this.funcionarioForm.controls['fecha_acta_toma_posecion'].setValue(moment.utc(i.fecha_acta_toma_posecion).format('YYYY-MM-DD'));
    this.funcionarioForm.controls['estado'].setValue(i.estado);
    this.funcionarioForm.controls['imagen_carnet'].setValue(i.imagen_carnet);
    this.funcionarioForm.controls['imagen_acta_toma_posecion'].setValue(i.imagen_acta_toma_posecion);
    this.funcionarioForm.controls['imagen_fotografia'].setValue(i.imagen_fotografia);
    this.funcionarioForm.controls['imagen_firma'].setValue(i.imagen_firma);
    this.funcionarioForm.controls['id_municipalidad'].setValue(i.id_municipalidad);
    this.funcionarioForm.controls['id_puesto'].setValue(i.id_puesto);
    this.funcionarioForm.controls['id_profesion'].setValue(i.id_profesion);
    this.funcionarioForm.controls['id_estado_civil'].setValue(i.id_estado_civil);

    this.municipalidad = i.municipalidad;
    this.filtros.codigo_departamento = i.municipalidad.departamento.codigo;
    this.filtros.codigo_municipio = i.municipalidad.municipio.codigo;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.funcionarioForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async getDisponibilidad() {
    this.ngxService.start();

    let aporte = await this.aportesService.getAportesDepartamentoMunicipio(this.municipalidad.departamento.codigo, this.municipalidad.municipio.codigo)

    this.garantias = await this.garantiasService.getGarantias();
    let prestamos = await this.prestamosService.getPrestamosEstadoMunicipalidad('Acreditado', this.municipalidad.id);

    for (let i = 0; i < prestamos.length; i++) {
      let prestamos_garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(prestamos[i].id);
      prestamos[i].prestamos_garantias = prestamos_garantias
    }

    this.disponibilidad = [];

    for (let i = 0; i < this.plazo_meses; i++) {
      this.disponibilidad.push({
        mes: moment(aporte.mes).add(i + 1, 'month').format('YYYY-MM'),
      });
    }

    for (let g = 0; g < this.garantias.length; g++) {
      this.garantias[g].prestamos = [];
      if (this.garantias[g].codigo == '01') {
        this.garantias[g].aporte = aporte.iva_paz * this.garantias[g].porcentaje / 100;
      }
      if (this.garantias[g].codigo == '02') {
        this.garantias[g].aporte = aporte.constitucional * this.garantias[g].porcentaje / 100;
      }
      for (let p = 0; p < prestamos.length; p++) {
        for (let pg = 0; pg < prestamos[p].prestamos_garantias.length; pg++) {
          if (prestamos[p].prestamos_garantias[pg].id_garantia == this.garantias[g].id) {
            let amortizaciones = await this.amortizacionesService.getAmortizacionesPrestamo(prestamos[p].id);

            // Fix porcentual
            for (let a = 0; a < amortizaciones.length; a++) {
              amortizaciones[a].capital = amortizaciones[a].capital * prestamos[p].prestamos_garantias[pg].porcentaje / 100;
              amortizaciones[a].interes = amortizaciones[a].interes * prestamos[p].prestamos_garantias[pg].porcentaje / 100;
              amortizaciones[a].iva = amortizaciones[a].iva * prestamos[p].prestamos_garantias[pg].porcentaje / 100;
              amortizaciones[a].cuota = amortizaciones[a].cuota * prestamos[p].prestamos_garantias[pg].porcentaje / 100;
              amortizaciones[a].saldo = amortizaciones[a].saldo * prestamos[p].prestamos_garantias[pg].porcentaje / 100;
            }

            let porcentaje_iva = parseFloat(this.configuracion.porcentaje_iva);
            let monto_total = parseFloat(prestamos[p].prestamos_garantias[pg].monto);
            let plazo_meses = parseFloat(prestamos[p].plazo_meses);
            let intereses = parseFloat(prestamos[p].intereses);
            let fecha = prestamos[p].fecha;

            amortizaciones = await this.prestamosService.getProyeccion(monto_total, plazo_meses, intereses, fecha, porcentaje_iva, amortizaciones)

            this.garantias[g].prestamos.push({
              no_dictamen: prestamos[p].no_dictamen,
              monto: prestamos[p].prestamos_garantias[pg].monto,
              amortizaciones: amortizaciones
            })
          }
        }
      }
    }

    this.ngxService.stop();

  }

  getMontoDisp(mes: string, amortizaciones: any) {
    for (let a = 0; a < amortizaciones.length; a++) {
      let mes_inicio = moment(amortizaciones[a].fecha_inicio).format('YYYY-MM');
      let mes_fin = moment(amortizaciones[a].fecha_fin).format('YYYY-MM');
      if (mes_fin == mes) {
        return amortizaciones[a].cuota;
      }
    }
    return 0;
  }

  getMontoDispTotal(mes: string, prestamos: any, aporte: number) {
    let total = aporte;

    for (let p = 0; p < prestamos.length; p++) {
      for (let a = 0; a < prestamos[p].amortizaciones.length; a++) {
        let mes_inicio = moment(prestamos[p].amortizaciones[a].fecha_inicio).format('YYYY-MM');
        let mes_fin = moment(prestamos[p].amortizaciones[a].fecha_fin).format('YYYY-MM');
        if (mes_fin == mes) {
          total -= prestamos[p].amortizaciones[a].cuota;
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

  getTotalMontoDisp(amortizaciones: any) {
    let total = 0;
    for (let d = 0; d < this.disponibilidad.length; d++) {
      let tot = this.getMontoDisp(this.disponibilidad[d].mes, amortizaciones);
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

  async setDepartamento(event: any) {
    for (let d = 0; d < this.departamentos.length; d++) {
      if (event.target.value == this.departamentos[d].id) {
        this.filtros.codigo_departamento = this.departamentos[d].codigo;
        this.filtros.codigo_municipio = '';
      }
    }
    let municipios = await this.municipiosService.getMunicipioByDepartamento(event.target.value);
    if (municipios) {
      this.municipios = municipios;
    }
  }

  async setMunicipio(event: any) {
    for (let m = 0; m < this.municipios.length; m++) {
      if (event.target.value == this.municipios[m].id) {
        this.filtros.codigo_municipio = this.municipios[m].codigo;
      }
    }
  }


  limpiar() {
    this.municipalidadForm.reset();
    this.municipalidad = null;
  }

}
