import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { ClasesPrestamosService } from 'src/app/services/catalogos/clases-prestamos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';
import { ClasesPrestamosGarantiasService } from 'src/app/services/catalogos/clases-prestamos-garantias.service';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';

@Component({
  selector: 'app-clases-prestamos',
  templateUrl: './clases-prestamos.component.html',
  styleUrls: ['./clases-prestamos.component.css']
})
export class ClasesPrestamosComponent {

  clase_prestamoForm: FormGroup;
  clase_prestamo_garantiaForm: FormGroup;
  clases_prestamos: any = [];
  clases_prestamos_garantias: any = [];
  garantias: any = [];
  clase_prestamo: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private clase_prestamoService: ClasesPrestamosService,
    private clases_prestamos_garantiasService: ClasesPrestamosGarantiasService,
    private garantiasService: GarantiasService
  ) {
    this.clase_prestamoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      siglas: new FormControl(null, [Validators.required])
    });
    this.clase_prestamo_garantiaForm = new FormGroup({
      id_garantia: new FormControl(null, [Validators.required]),
      id_clase_prestamo: new FormControl(null, [Validators.required])
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

  async getClasesPrestamosGarantias() {
    let clases_prestamos_garantias = await this.clases_prestamos_garantiasService.getClasesPrestamosGarantias(this.clase_prestamo.id);
    if (clases_prestamos_garantias) {
      this.clases_prestamos_garantias = clases_prestamos_garantias;
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

  async postClasePrestamoGarantia() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let clase_prestamo_garantia = await this.clases_prestamos_garantiasService.postClasePrestamoGarantia(this.clase_prestamo_garantiaForm.value);
    if (clase_prestamo_garantia.resultado) {
      await this.getClasesPrestamosGarantias();
      this.alert.alertMax('Transaccion Correcta', clase_prestamo_garantia.mensaje, 'success');
      this.clase_prestamo_garantiaForm.controls['id_garantia'].setValue(null);
    }
    this.ngxService.stop();
  }


  async deleteClasePrestamoGarantia(i: any, index: number) {
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
        let clase_prestamo = await this.clases_prestamos_garantiasService.deleteClasePrestamoGarantia(i.id);
        if (clase_prestamo.resultado) {
          this.getClasesPrestamosGarantias();
          this.alert.alertMax('Correcto', clase_prestamo.mensaje, 'success');
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
    this.clase_prestamoForm.controls['siglas'].setValue(i.siglas);

    this.clase_prestamo_garantiaForm.controls['id_clase_prestamo'].setValue(i.id);

    await this.getClasesPrestamosGarantias();

    this.ngxService.stop();
  }

  cancelarEdicion() {
    this.clase_prestamoForm.reset();
    this.clase_prestamo = null;
  }

}
