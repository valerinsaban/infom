import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { ProfesionesService } from 'src/app/services/catalogos/profesiones.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-profesiones',
  templateUrl: './profesiones.component.html',
  styleUrls: ['./profesiones.component.css']
})
export class ProfesionesComponent {

  profesionForm: FormGroup;
  profesiones: any = [];
  profesion: any;


  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private profesionesService: ProfesionesService
  ) {
    this.profesionForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getProfesiones();
    this.ngxService.stop();
  }

  // CRUD Profesiones
  async getProfesiones() {
    let profesiones = await this.profesionesService.getProfesiones();
    if (profesiones) {
      this.profesiones = profesiones;
    }
  }

  async postProfesion() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let profesion = await this.profesionesService.postProfesion(this.profesionForm.value);
    if (profesion.resultado) {
      await this.getProfesiones();
      this.alert.alertMax('Transaccion Correcta', profesion.mensaje, 'success');
      this.profesionForm.reset();
    }
    this.ngxService.stop();
  }

  async putProfesion() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let profesion = await this.profesionesService.putProfesion(this.profesion.id, this.profesionForm.value);
    if (profesion.resultado) {
      await this.getProfesiones();
      this.alert.alertMax('Transaccion Correcta', profesion.mensaje, 'success');
      this.profesionForm.reset();
      this.profesion = null;
    }
    this.ngxService.stop();
  }

  async deleteProfesion(i: any, index: number) {
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
        let profesion = await this.profesionesService.deleteProfesion(i.id);
        if (profesion.resultado) {
          this.profesiones.splice(index, 1);
          this.alert.alertMax('Correcto', profesion.mensaje, 'success');
          this.profesion = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setProfesion(i: any, index: number) {
    i.index = index;
    this.profesion = i;
    this.profesionForm.controls['codigo'].setValue(i.codigo);
    this.profesionForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.profesionForm.reset();
    this.profesion = null;
  }

}
