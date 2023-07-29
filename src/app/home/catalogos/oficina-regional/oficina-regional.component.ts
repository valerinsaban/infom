import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { OficinaRegionalService } from 'src/app/services/catalogos/oficina-regional.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oficina-regional',
  templateUrl: './oficina-regional.component.html',
  styleUrls: ['./oficina-regional.component.css']
})
export class OficinaRegionalComponent {

  oficinaRegionalForm: FormGroup;
  oficinasRegionales: any = [];
  oficinaRegional: any;

  constructor(
    private alert: AlertService,
    private oficinaRegionalService: OficinaRegionalService
  ) {
    this.oficinaRegionalForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getOficinasRegionales();
  }

  // CRUD oficinasRegionales
  async getOficinasRegionales() {
    let oficinasRegionales = await this.oficinaRegionalService.getOficinasRegionales();
    if (oficinasRegionales) {
      this.oficinasRegionales = oficinasRegionales;
    }
  }

  async postOficinaRegional() {
    let oficinaRegional = await this.oficinaRegionalService.postOficinaRegional(this.oficinaRegionalForm.value);
    if (oficinaRegional.resultado) {
      this.getOficinasRegionales();
      this.alert.alertMax('Transaccion Correcta', oficinaRegional.mensaje, 'success');
      this.oficinaRegionalForm.reset();
    }
  }

  async putOficinaRegional() {
    let oficinaRegional = await this.oficinaRegionalService.putOficinaRegional(this.oficinaRegional.id, this.oficinaRegionalForm.value);
    if (oficinaRegional.resultado) {
      this.getOficinasRegionales();
      this.alert.alertMax('Transaccion Correcta', oficinaRegional.mensaje, 'success');
      this.oficinaRegionalForm.reset();
      this.oficinaRegional = null;
    }
  }

  async deleteOficinaRegional(i: any, index: number) {
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
        let oficinaRegional = await this.oficinaRegionalService.deleteOficinaRegional(i.id);
        if (oficinaRegional.resultado) {
          this.oficinasRegionales.splice(index, 1);
          this.alert.alertMax('Correcto', oficinaRegional.mensaje, 'success');
          this.oficinaRegional = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setOficinaRegional(i: any, index: number) {
    i.index = index;
    this.oficinaRegional = i;
    this.oficinaRegionalForm.controls['codigo'].setValue(i.codigo);
    this.oficinaRegionalForm.controls['descripcion'].setValue(i.descripcion);
  }

  cancelarEdicion() {
    this.oficinaRegionalForm.reset();
    this.oficinaRegional = null;
  }

}
