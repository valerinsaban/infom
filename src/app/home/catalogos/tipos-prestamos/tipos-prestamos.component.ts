import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { TiposPrestamosService } from 'src/app/services/catalogos/tipos-prestamos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';

@Component({
  selector: 'app-tipos-prestamos',
  templateUrl: './tipos-prestamos.component.html',
  styleUrls: ['./tipos-prestamos.component.css']
})
export class TiposPrestamosComponent {

  tipo_prestamoForm: FormGroup;
  tipos_prestamos: any = [];
  garantias: any = [];
  tipo_prestamo: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private tipo_prestamoService: TiposPrestamosService,
    private garantiasService: GarantiasService
  ) {
    this.tipo_prestamoForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      siglas: new FormControl(null, [Validators.required]),
      monto_min: new FormControl(null, [Validators.required]),
      monto_max: new FormControl(null),
      centro_costo: new FormControl(null),
      producto: new FormControl(null),
      subproducto: new FormControl(null)
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

  async postTipoPrestamo() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let tipo_prestamo = await this.tipo_prestamoService.postTipoPrestamo(this.tipo_prestamoForm.value);
    if (tipo_prestamo.resultado) {
      await this.getTiposPrestamos();
      this.alert.alertMax('Operacion Correcta', tipo_prestamo.mensaje, 'success');
      this.tipo_prestamoForm.reset();
    }
    this.ngxService.stop();
  }

  async putTipoPrestamo() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let tipo_prestamo = await this.tipo_prestamoService.putTipoPrestamo(this.tipo_prestamo.id, this.tipo_prestamoForm.value);
    if (tipo_prestamo.resultado) {
      await this.getTiposPrestamos();
      this.alert.alertMax('Operacion Correcta', tipo_prestamo.mensaje, 'success');
      this.tipo_prestamoForm.reset();
      this.tipo_prestamo = null;
    }
    this.ngxService.stop();
  }

  async deleteTipoPrestamo(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
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

  // Metodos para obtener data y id de registro seleccionado
  async setTipoPrestamo(i: any, index: number) {
    this.ngxService.start();
    i.index = index;
    this.tipo_prestamo = i;
    this.tipo_prestamoForm.controls['nombre'].setValue(i.nombre);
    this.tipo_prestamoForm.controls['siglas'].setValue(i.siglas);
    this.tipo_prestamoForm.controls['monto_min'].setValue(i.monto_min);
    this.tipo_prestamoForm.controls['monto_max'].setValue(i.monto_max);
    this.tipo_prestamoForm.controls['centro_costo'].setValue(i.centro_costo);
    this.tipo_prestamoForm.controls['producto'].setValue(i.producto);
    this.tipo_prestamoForm.controls['subproducto'].setValue(i.subproducto);

    this.ngxService.stop();
  }

  cancelarEdicion() {
    this.tipo_prestamoForm.reset();
    this.tipo_prestamo = null;
  }

}
