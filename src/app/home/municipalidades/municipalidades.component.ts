import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { BancosService } from 'src/app/services/catalogos/bancos.service';
import { FuncionariosService } from 'src/app/services/funcionarios.service';
import { PuestosService } from 'src/app/services/catalogos/puestos.service';
import { ProfesionesService } from 'src/app/services/catalogos/profesiones.service';
import { EstadosCivilesService } from 'src/app/services/catalogos/estados-civiles.service';
import { PartidosPoliticosService } from 'src/app/services/catalogos/partidos-politicos.service';
import { AppComponent } from 'src/app/app.component';

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

  departamentos: any = [];
  municipios: any = [];
  funcionarios: any = [];
  puestos: any = [];
  profesiones: any = [];
  estados_civiles: any = [];
  bancos: any = [];
  partidos_politicos: any = [];

  departamento: any;
  municipio: any;
  funcionario: any;

  filtros: any = {
    mes_inicio: moment().startOf('year').format('YYYY-MM'),
    mes_fin: moment().endOf('year').format('YYYY-MM'),
    codigo_departamento: '',
    codigo_municipio: ''
  }

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private municipalidadesService: MunicipalidadesService,
    private departamentosService: DepartamentosService,
    private municipiosService: MunicipiosService,
    private bancosService: BancosService,
    private funcionariosService: FuncionariosService,
    private puestosService: PuestosService,
    private profesionesService: ProfesionesService,
    private estados_civilesService: EstadosCivilesService,
    private partidos_politicosService: PartidosPoliticosService
  ) {
    this.municipalidadForm = new FormGroup({
      direccion: new FormControl(null),
      correo: new FormControl(null),
      telefono: new FormControl(null),
      no_cuenta: new FormControl(null),
      nit: new FormControl(null),
      no_acta: new FormControl(null),
      punto_acta: new FormControl(null),
      fecha_acta: new FormControl(null),
      no_convenio: new FormControl(null),
      fecha_convenio: new FormControl(null),
      id_departamento: new FormControl(null, [Validators.required]),
      id_municipio: new FormControl(null, [Validators.required]),
      id_banco: new FormControl(null),
      id_partido_politico: new FormControl(null)
    });
    this.funcionarioForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      fecha_nacimiento: new FormControl(null, [Validators.required]),
      dpi: new FormControl(null, [Validators.required]),
      carnet: new FormControl(null, [Validators.required]),
      fecha_carnet: new FormControl(null, [Validators.required]),
      acuerdo: new FormControl(null, [Validators.required]),
      fecha_acuerdo: new FormControl(null, [Validators.required]),
      acta_toma_posecion: new FormControl(null, [Validators.required]),
      fecha_acta_toma_posecion: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      imagen_carnet: new FormControl(null),
      imagen_acta_toma_posecion: new FormControl(null),
      imagen_dpi: new FormControl(null),
      imagen_firma: new FormControl(null),
      imagen_sello: new FormControl(null),
      id_municipalidad: new FormControl(null, [Validators.required]),
      id_puesto: new FormControl(null, [Validators.required]),
      id_profesion: new FormControl(null, [Validators.required]),
      id_estado_civil: new FormControl(null)
    });
    AppComponent.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js');
    AppComponent.loadScript('assets/js/mask.js');
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDepartamentos();
    await this.getBancos();
    await this.getProfesiones();
    await this.getPuestos();
    await this.getEstadosCiviles();
    await this.getPartidosPoliticos();
    this.ngxService.stop();
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

  async getPartidosPoliticos() {
    let partidos_politicos = await this.partidos_politicosService.getPartidosPoliticos();
    if (partidos_politicos) {
      this.partidos_politicos = partidos_politicos;
    }
  }

  async getFuncionarios() {
    this.ngxService.start();
    let funcionarios = await this.funcionariosService.getFuncionariosMunicipalidad(this.municipalidad.id);
    if (funcionarios) {
      this.funcionarios = funcionarios;
    }
    this.ngxService.stop();
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
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let municipalidad = await this.municipalidadesService.postMunicipalidad(this.municipalidadForm.value);
    if (municipalidad.resultado) {
      await this.getMunicipalidades();
      this.alert.alertMax('Operacion Correcta', municipalidad.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putMunicipalidad() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let municipalidad = await this.municipalidadesService.putMunicipalidad(this.municipalidad.id, this.municipalidadForm.value);
    if (municipalidad.resultado) {
      await this.getMunicipalidades();
      this.alert.alertMax('Operacion Correcta', municipalidad.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async deleteMunicipalidad(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
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
    this.municipalidadForm.controls['nit'].setValue(i.nit);
    this.municipalidadForm.controls['no_acta'].setValue(i.no_acta);
    this.municipalidadForm.controls['punto_acta'].setValue(i.punto_acta);
    this.municipalidadForm.controls['fecha_acta'].setValue(i.fecha_acta);
    this.municipalidadForm.controls['no_convenio'].setValue(i.no_convenio);
    this.municipalidadForm.controls['fecha_convenio'].setValue(i.fecha_convenio);
    this.municipalidadForm.controls['id_departamento'].setValue(i.id_departamento);
    this.municipalidadForm.controls['id_municipio'].setValue(i.id_municipio);
    this.municipalidadForm.controls['id_banco'].setValue(i.id_banco);
    this.municipalidadForm.controls['id_partido_politico'].setValue(i.id_partido_politico);

    this.funcionarioForm.controls['id_municipalidad'].setValue(i.id);

    this.getFuncionarios();
  }

  async postFuncionario() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let funcionario = await this.funcionariosService.postFuncionario(this.funcionarioForm.value);
    if (funcionario.resultado) {
      await this.getFuncionarios();
      this.alert.alertMax('Operacion Correcta', funcionario.mensaje, 'success');
      this.limpiar2();
    }
    this.ngxService.stop();
  }

  async putFuncionario() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let funcionario = await this.funcionariosService.putFuncionario(this.funcionario.id, this.funcionarioForm.value);
    if (funcionario.resultado) {
      await this.getFuncionarios();
      this.alert.alertMax('Operacion Correcta', funcionario.mensaje, 'success');
      this.limpiar2();
    }
    this.ngxService.stop();
  }

  async deleteFuncionario(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
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
          this.limpiar2();
        }
        this.ngxService.stop();
      }
    })
  }

  setFuncionario(i: any, index: number) {
    i.index = index;
    this.funcionario = i;
    this.funcionarioForm.controls['nombre'].setValue(i.nombre);
    this.funcionarioForm.controls['apellido'].setValue(i.apellido);
    this.funcionarioForm.controls['fecha_nacimiento'].setValue(moment.utc(i.fecha_nacimiento).format('YYYY-MM-DD'));
    this.funcionarioForm.controls['dpi'].setValue(i.dpi);
    this.funcionarioForm.controls['carnet'].setValue(i.carnet);
    this.funcionarioForm.controls['fecha_carnet'].setValue(moment.utc(i.fecha_carnet).format('YYYY-MM-DD'));
    this.funcionarioForm.controls['acuerdo'].setValue(i.acuerdo);
    this.funcionarioForm.controls['fecha_acuerdo'].setValue(moment.utc(i.fecha_acuerdo).format('YYYY-MM-DD'));
    this.funcionarioForm.controls['acta_toma_posecion'].setValue(i.acta_toma_posecion);
    this.funcionarioForm.controls['fecha_acta_toma_posecion'].setValue(moment.utc(i.fecha_acta_toma_posecion).format('YYYY-MM-DD'));
    this.funcionarioForm.controls['estado'].setValue(i.estado);
    this.funcionarioForm.controls['imagen_carnet'].setValue(i.imagen_carnet);
    this.funcionarioForm.controls['imagen_acta_toma_posecion'].setValue(i.imagen_acta_toma_posecion);
    this.funcionarioForm.controls['imagen_dpi'].setValue(i.imagen_dpi);
    this.funcionarioForm.controls['imagen_firma'].setValue(i.imagen_firma);
    this.funcionarioForm.controls['imagen_sello'].setValue(i.imagen_sello);
    this.funcionarioForm.controls['id_municipalidad'].setValue(i.id_municipalidad);
    this.funcionarioForm.controls['id_puesto'].setValue(i.id_puesto);
    this.funcionarioForm.controls['id_profesion'].setValue(i.id_profesion);
    this.funcionarioForm.controls['id_estado_civil'].setValue(i.id_estado_civil);

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

  limpiar2() {
    this.funcionarioForm.reset();
    this.funcionarioForm.controls['id_municipalidad'].setValue(this.municipalidad.id)
    this.funcionario = null;
  }

}
