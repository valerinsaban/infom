import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';


@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.css']
})
export class MunicipiosComponent {
  municipioForm: FormGroup;
  municipios: any = [];
  municipio: any;
  departamentos: any = [];

  constructor(
      private alert: AlertService,
      private municipiosService: MunicipiosService,
      private ngxService: NgxUiLoaderService,
      private departamentosService: DepartamentosService
  ){
    this.municipioForm = new FormGroup({
      codigo: new FormControl(null,[Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      id_departamento: new FormControl(null, [Validators.required]),
    });

  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getMunicipios();
    await this.getDepartamentos();
    this.ngxService.stop();
  }

  // CRUD municipios
  async getMunicipios() {
    let municipios = await this.municipiosService.getMunicipios();
    if (municipios) {
      this.municipios = municipios;
    }
  }

  // get Departamentos para dropdown
  async getDepartamentos(){
    let departamentos = await this.departamentosService.getDepartamentos();
    if(departamentos){
      this.departamentos = departamentos;
    }
  }

  async postMunicipio() {
    if (!HomeComponent.getPermiso('Agregar')){
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let municipio = await this.municipiosService.postMunicipio(this.municipioForm.value);
    if (municipio.resultado) {
      await this.getMunicipios();
      this.alert.alertMax('Transaccion Correcta', municipio.mensaje, 'success');
      this.municipioForm.reset();
    }
    this.ngxService.stop();
  }

  async putMunicipio() {
    if (!HomeComponent.getPermiso('Editar')){
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let municipio = await this.municipiosService.putMunicipio(this.municipio.id, this.municipioForm.value);
    if (municipio.resultado) {
      await this.getMunicipios();
      this.alert.alertMax('Transaccion Correcta', municipio.mensaje, 'success');
      this.municipioForm.reset();
      this.municipio = null;
    }
    this.ngxService.stop();
  }

  async deleteMunicipio(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')){
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
        let municipio = await this.municipiosService.deleteMunicipio(i.id);
        if (municipio.resultado) {
          this.municipios.splice(index, 1);
          this.alert.alertMax('Correcto', municipio.mensaje, 'success');
          this.municipio = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setMunicipio(i: any, index: number) {
    i.index = index;
    this.municipio = i;
    this.municipioForm.controls['codigo'].setValue(i.codigo);
    this.municipioForm.controls['nombre'].setValue(i.nombre);
    this.municipioForm.controls['id_departamento'].setValue(i.id_departamento);
  }

  cancelarEdicion() {
    this.municipioForm.reset();
    this.municipio = null;
  }

}
