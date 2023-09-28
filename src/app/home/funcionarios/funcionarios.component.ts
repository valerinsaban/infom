import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from 'src/app/app.component';
import { AlertService } from 'src/app/services/alert.service';
import { EstadosCivilesService } from 'src/app/services/catalogos/estados-civiles.service';
import { ProfesionesService } from 'src/app/services/catalogos/profesiones.service';
import { PuestosService } from 'src/app/services/catalogos/puestos.service';
import { FuncionariosService } from 'src/app/services/funcionarios.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent {

  funcionarioForm: FormGroup;
  funcionarios: any = [];
  funcionario: any;

  file: any;

  departamentos: any = [];
  municipios: any = [];
  puestos: any = [];
  profesiones: any = [];
  estados_civiles: any = [];

  municipalidad: any;

  filtros: any = {
    codigo_departamento: null,
    codigo_municipio: null
  }

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private funcionariosService: FuncionariosService,
    private municipalidadesService: MunicipalidadesService,
    private puestosService: PuestosService,
    private profesionesService: ProfesionesService,
    private estados_civilesService: EstadosCivilesService,
    private departamentosService: DepartamentosService,
    private municipiosService: MunicipiosService
  ) {
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
    await this.getFuncionarios();
    await this.getProfesiones();
    await this.getPuestos();
    await this.getEstadosCiviles();
    await this.getDepartamentos();
    this.ngxService.stop();
  }

  async getDepartamentos() {
    let departamentos = await this.departamentosService.getDepartamentos();
    if (departamentos) {
      this.departamentos = departamentos;
    }
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

  async setMunicipio(event: any = null) {
    if (event) {
      for (let m = 0; m < this.municipios.length; m++) {
        if (event.target.value == this.municipios[m].id) {
          this.filtros.codigo_municipio = this.municipios[m].codigo;
          let municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
          if (municipalidad) {
            this.funcionarioForm.controls['id_municipalidad'].setValue(municipalidad.id);
            this.municipalidad = municipalidad;
            this.filtros.id_municipalidad = municipalidad.id;
          }
        }
      }
    } else {
      let municipalidad = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      if (municipalidad) {
        this.funcionarioForm.controls['id_municipalidad'].setValue(municipalidad.id);
        this.municipalidad = municipalidad;
        this.filtros.id_municipalidad = municipalidad.id;
      }
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

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.funcionarioForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }


  // Metodos para obtener data y id de registro seleccionado
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

  limpiar() {
    this.funcionarioForm.reset();
    this.funcionario = null;
  }

}
