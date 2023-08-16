import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-garantias',
  templateUrl: './garantias.component.html',
  styleUrls: ['./garantias.component.css']
})
export class GarantiasComponent {

  garantiaForm: FormGroup;
  garantias: any = [];
  garantia: any;

  constructor(
    private alert: AlertService,
    private garantiaService: GarantiasService
  ) {
    this.garantiaForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getGarantias();
  }

  // CRUD garantias
  async getGarantias() {
    let garantias = await this.garantiaService.getGarantias();
    if (garantias) {
      this.garantias = garantias;
    }
  }

  async postGarantia() {
    let garantia = await this.garantiaService.postGarantia(this.garantiaForm.value);
    if (garantia.resultado) {
      await this.getGarantias();
      this.alert.alertMax('Transaccion Correcta', garantia.mensaje, 'success');
      this.garantiaForm.reset();
    }
  }

  async putGarantia() {
    let garantia = await this.garantiaService.putGarantia(this.garantia.id, this.garantiaForm.value);
    if (garantia.resultado) {
      await this.getGarantias();
      this.alert.alertMax('Transaccion Correcta', garantia.mensaje, 'success');
      this.garantiaForm.reset();
      this.garantia = null;
    }
  }

  async deleteGarantia(i: any, index: number) {
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
        let garantia = await this.garantiaService.deleteGarantia(i.id);
        if (garantia.resultado) {
          this.garantia.splice(index, 1);
          this.alert.alertMax('Correcto', garantia.mensaje, 'success');
          this.garantia = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setGarantia(i: any, index: number) {
    i.index = index;
    this.garantia = i;
    this.garantiaForm.controls['codigo'].setValue(i.codigo);
    this.garantiaForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.garantiaForm.reset();
    this.garantia = null;
  }




}
