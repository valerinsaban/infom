import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

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
    private ngxService: NgxUiLoaderService,
    private garantiaService: GarantiasService
  ) {
    this.garantiaForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getGarantias();
    this.ngxService.stop();
  }

  // CRUD garantias
  async getGarantias() {
    let garantias = await this.garantiaService.getGarantias();
    if (garantias) {
      this.garantias = garantias;
    }
  }

  async postGarantia() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let garantia = await this.garantiaService.postGarantia(this.garantiaForm.value);
    if (garantia.resultado) {
      await this.getGarantias();
      this.alert.alertMax('Transaccion Correcta', garantia.mensaje, 'success');
      this.garantiaForm.reset();
    }
    this.ngxService.stop();
  }

  async putGarantia() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let garantia = await this.garantiaService.putGarantia(this.garantia.id, this.garantiaForm.value);
    if (garantia.resultado) {
      await this.getGarantias();
      this.alert.alertMax('Transaccion Correcta', garantia.mensaje, 'success');
      this.garantiaForm.reset();
      this.garantia = null;
    }
    this.ngxService.stop();
  }

  async deleteGarantia(i: any, index: number) {
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
        let garantia = await this.garantiaService.deleteGarantia(i.id);
        if (garantia.resultado) {
          this.garantia.splice(index, 1);
          this.alert.alertMax('Correcto', garantia.mensaje, 'success');
          this.garantia = null;
        }
        this.ngxService.stop();
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
