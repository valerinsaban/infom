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

@Component({
  selector: 'app-municipalidades',
  templateUrl: './municipalidades.component.html',
  styleUrls: ['./municipalidades.component.css']
})
export class MunicipalidadesComponent {

  municipalidadForm: FormGroup;
  municipalidades: any = [];
  municipalidad: any;

  departamentos: any = [];
  municipios: any = [];

  departamento: any;
  municipio: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private municipalidadesService: MunicipalidadesService,
    private departamentosService: DepartamentosService,
    private municipiosService: MunicipiosService,
  ) {
    this.municipalidadForm = new FormGroup({
      direccion: new FormControl(null, [Validators.required]),
      id_departamento: new FormControl(null, [Validators.required]),
      id_municipio: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getMunicipalidades();
    await this.getDepartamentos();
    this.ngxService.stop();
  }

  async getMunicipalidades() {
    let municipalidades = await this.municipalidadesService.getMunicipalidades();
    if (municipalidades) {
      this.municipalidades = municipalidades;
    }
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
    this.municipalidadForm.controls['id_departamento'].setValue(i.id_departamento);
    this.municipalidadForm.controls['id_municipio'].setValue(i.id_municipio);
  }

  limpiar() {
    this.municipalidadForm.reset();
    this.municipalidad = null;
  }

}
