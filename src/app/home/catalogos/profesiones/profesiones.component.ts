import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ProfesionesService } from 'src/app/services/catalogos/profesiones.service';
import Swal from 'sweetalert2';

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
    private profesionesService: ProfesionesService
  ) {
    this.profesionForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getProfesiones();
  }

  // CRUD Profesiones
  async getProfesiones() {
    let profesiones = await this.profesionesService.getProfesiones();
    if (profesiones) {
      this.profesiones = profesiones;
    }
  }

  async postProfesion() {
    let profesion = await this.profesionesService.postProfesion(this.profesionForm.value);
    if (profesion.resultado) {
      await this.getProfesiones();
      this.alert.alertMax('Transaccion Correcta', profesion.mensaje, 'success');
      this.profesionForm.reset();
    }
  }

  async putProfesion() {
    let profesion = await this.profesionesService.putProfesion(this.profesion.id, this.profesionForm.value);
    if (profesion.resultado) {
      await this.getProfesiones();
      this.alert.alertMax('Transaccion Correcta', profesion.mensaje, 'success');
      this.profesionForm.reset();
      this.profesion = null;
    }
  }

  async deleteProfesion(i: any, index: number) {
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
        let profesion = await this.profesionesService.deleteProfesion(i.id);
        if (profesion.resultado) {
          this.profesiones.splice(index, 1);
          this.alert.alertMax('Correcto', profesion.mensaje, 'success');
          this.profesion = null;
        }
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
