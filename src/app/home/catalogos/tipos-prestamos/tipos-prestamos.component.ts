import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { TiposPrestamosService } from 'src/app/services/catalogos/tipos-prestamos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';
import { TiposPrestamosGarantiasService } from 'src/app/services/catalogos/tipos-prestamos-garantias.service';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';

@Component({
  selector: 'app-tipos-prestamos',
  templateUrl: './tipos-prestamos.component.html',
  styleUrls: ['./tipos-prestamos.component.css']
})
export class TiposPrestamosComponent {

  tipo_prestamoForm: FormGroup;
  tipo_prestamo_garantiaForm: FormGroup;
  tipos_prestamos: any = [];
  tipos_prestamos_garantias: any = [];
  garantias: any = [];
  tipo_prestamo: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private tipo_prestamoService: TiposPrestamosService,
    private tipos_prestamos_garantiasService: TiposPrestamosGarantiasService,
    private garantiasService: GarantiasService
  ) {
    this.tipo_prestamoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
    this.tipo_prestamo_garantiaForm = new FormGroup({
      id_garantia: new FormControl(null, [Validators.required]),
      id_tipo_prestamo: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getTiposPrestamos();
    await this.getGarantias();
    this.ngxService.stop();
  }

  // CRUD tipos_prestamos
  async getTiposPrestamos() {
    let tipos_prestamos = await this.tipo_prestamoService.getTiposPrestamos();
    if (tipos_prestamos) {
      this.tipos_prestamos = tipos_prestamos;
    }
  }

  async getGarantias() {
    let garantias = await this.garantiasService.getGarantias();
    if (garantias) {
      this.garantias = garantias;
    }
  }

  async getTiposPrestamosGarantias() {
    let tipos_prestamos_garantias = await this.tipos_prestamos_garantiasService.getTiposPrestamosGarantias(this.tipo_prestamo.id);
    if (tipos_prestamos_garantias) {
      this.tipos_prestamos_garantias = tipos_prestamos_garantias;
    }
  }

  async postTipoPrestamo() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let tipo_prestamo = await this.tipo_prestamoService.postTipoPrestamo(this.tipo_prestamoForm.value);
    if (tipo_prestamo.resultado) {
      await this.getTiposPrestamos();
      this.alert.alertMax('Transaccion Correcta', tipo_prestamo.mensaje, 'success');
      this.tipo_prestamoForm.reset();
    }
    this.ngxService.stop();
  }

  async putTipoPrestamo() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let tipo_prestamo = await this.tipo_prestamoService.putTipoPrestamo(this.tipo_prestamo.id, this.tipo_prestamoForm.value);
    if (tipo_prestamo.resultado) {
      await this.getTiposPrestamos();
      this.alert.alertMax('Transaccion Correcta', tipo_prestamo.mensaje, 'success');
      this.tipo_prestamoForm.reset();
      this.tipo_prestamo = null;
    }
    this.ngxService.stop();
  }

  async deleteTipoPrestamo(i: any, index: number) {
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
        let tipo_prestamo = await this.tipo_prestamoService.deleteTipoPrestamo(i.id);
        if (tipo_prestamo.resultado) {
          this.tipos_prestamos.splice(index, 1);
          this.alert.alertMax('Correcto', tipo_prestamo.mensaje, 'success');
          this.tipo_prestamo = null;
        }
        this.ngxService.stop();
      }
    })
  }

  async postTipoPrestamoGarantia() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let tipo_prestamo_garantia = await this.tipos_prestamos_garantiasService.postTipoPrestamoGarantia(this.tipo_prestamo_garantiaForm.value);
    if (tipo_prestamo_garantia.resultado) {
      await this.getTiposPrestamosGarantias();
      this.alert.alertMax('Transaccion Correcta', tipo_prestamo_garantia.mensaje, 'success');
      this.tipo_prestamo_garantiaForm.controls['id_garantia'].setValue(null);
    }
    this.ngxService.stop();
  }


  async deleteTipoPrestamoGarantia(i: any, index: number) {
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
        let tipo_prestamo = await this.tipos_prestamos_garantiasService.deleteTipoPrestamoGarantia(i.id);
        if (tipo_prestamo.resultado) {
          this.getTiposPrestamosGarantias();
          this.alert.alertMax('Correcto', tipo_prestamo.mensaje, 'success');
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  async setTipoPrestamo(i: any, index: number) {
    this.ngxService.start();
    i.index = index;
    this.tipo_prestamo = i;
    this.tipo_prestamoForm.controls['codigo'].setValue(i.codigo);
    this.tipo_prestamoForm.controls['nombre'].setValue(i.nombre);

    this.tipo_prestamo_garantiaForm.controls['id_tipo_prestamo'].setValue(i.id);

    await this.getTiposPrestamosGarantias();

    this.ngxService.stop();
  }

  cancelarEdicion() {
    this.tipo_prestamoForm.reset();
    this.tipo_prestamo = null;
  }

}
