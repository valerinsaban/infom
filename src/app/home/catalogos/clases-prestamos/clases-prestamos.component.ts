import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { ClasesPrestamosService } from 'src/app/services/catalogos/clases-prestamos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';

@Component({
  selector: 'app-clases-prestamos',
  templateUrl: './clases-prestamos.component.html',
  styleUrls: ['./clases-prestamos.component.css']
})
export class ClasesPrestamosComponent {

  clase_prestamoForm: FormGroup;
  clases_prestamos: any = [];
  garantias: any = [];
  clase_prestamo: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private clase_prestamoService: ClasesPrestamosService,
    private garantiasService: GarantiasService
  ) {
    this.clase_prestamoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      monto_min: new FormControl(null, [Validators.required]),
      monto_max: new FormControl(null)
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getClasesPrestamos();
    await this.getGarantias();
    this.ngxService.stop();
  }

  // CRUD clases_prestamos
  async getClasesPrestamos() {
    let clases_prestamos = await this.clase_prestamoService.getClasesPrestamos();
    if (clases_prestamos) {
      this.clases_prestamos = clases_prestamos;
    }
  }

  async getGarantias() {
    let garantias = await this.garantiasService.getGarantias();
    if (garantias) {
      this.garantias = garantias;
    }
  }

  async postClasePrestamo() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let clase_prestamo = await this.clase_prestamoService.postClasePrestamo(this.clase_prestamoForm.value);
    if (clase_prestamo.resultado) {
      await this.getClasesPrestamos();
      this.alert.alertMax('Transaccion Correcta', clase_prestamo.mensaje, 'success');
      this.clase_prestamoForm.reset();
    }
    this.ngxService.stop();
  }

  async putClasePrestamo() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let clase_prestamo = await this.clase_prestamoService.putClasePrestamo(this.clase_prestamo.id, this.clase_prestamoForm.value);
    if (clase_prestamo.resultado) {
      await this.getClasesPrestamos();
      this.alert.alertMax('Transaccion Correcta', clase_prestamo.mensaje, 'success');
      this.clase_prestamoForm.reset();
      this.clase_prestamo = null;
    }
    this.ngxService.stop();
  }

  async deleteClasePrestamo(i: any, index: number) {
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
        let clase_prestamo = await this.clase_prestamoService.deleteClasePrestamo(i.id);
        if (clase_prestamo.resultado) {
          this.clases_prestamos.splice(index, 1);
          this.alert.alertMax('Correcto', clase_prestamo.mensaje, 'success');
          this.clase_prestamo = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  async setClasePrestamo(i: any, index: number) {
    this.ngxService.start();
    i.index = index;
    this.clase_prestamo = i;
    this.clase_prestamoForm.controls['codigo'].setValue(i.codigo);
    this.clase_prestamoForm.controls['nombre'].setValue(i.nombre);
    this.clase_prestamoForm.controls['monto_min'].setValue(i.monto_min);
    this.clase_prestamoForm.controls['monto_max'].setValue(i.monto_max);

    this.ngxService.stop();
  }

  cancelarEdicion() {
    this.clase_prestamoForm.reset();
    this.clase_prestamo = null;
  }

}
