import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { TiposPrestamosService } from 'src/app/services/catalogos/tipos_prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos_prestamos',
  templateUrl: './tipos-prestamos.component.html',
  styleUrls: ['./tipos-prestamos.component.css']
})
export class TiposPrestamosComponent {

  tipo_prestamoForm: FormGroup;
  tipos_prestamos: any = [];
  tipo_prestamo: any;

  constructor(
    private alert: AlertService,
    private tipo_prestamoService: TiposPrestamosService
  ) {
    this.tipo_prestamoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getTiposPrestamos();
  }

  // CRUD tipos_prestamos
  async getTiposPrestamos() {
    let tipos_prestamos = await this.tipo_prestamoService.getTiposPrestamos();
    if (tipos_prestamos) {
      this.tipos_prestamos = tipos_prestamos;
    }
  }

  async postTipoPrestamo() {
    let tipo_prestamo = await this.tipo_prestamoService.postTipoPrestamo(this.tipo_prestamoForm.value);
    if (tipo_prestamo.resultado) {
      await this.getTiposPrestamos();
      this.alert.alertMax('Transaccion Correcta', tipo_prestamo.mensaje, 'success');
      this.tipo_prestamoForm.reset();
    }
  }

  async putTipoPrestamo() {
    let tipo_prestamo = await this.tipo_prestamoService.putTipoPrestamo(this.tipo_prestamo.id, this.tipo_prestamoForm.value);
    if (tipo_prestamo.resultado) {
      await this.getTiposPrestamos();
      this.alert.alertMax('Transaccion Correcta', tipo_prestamo.mensaje, 'success');
      this.tipo_prestamoForm.reset();
      this.tipo_prestamo = null;
    }
  }

  async deleteTipoPrestamo(i: any, index: number) {
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
        let tipo_prestamo = await this.tipo_prestamoService.deleteTipoPrestamo(i.id);
        if (tipo_prestamo.resultado) {
          this.tipo_prestamo.splice(index, 1);
          this.alert.alertMax('Correcto', tipo_prestamo.mensaje, 'success');
          this.tipo_prestamo = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setTipoPrestamo(i: any, index: number) {
    i.index = index;
    this.tipo_prestamo = i;
    this.tipo_prestamoForm.controls['codigo'].setValue(i.codigo);
    this.tipo_prestamoForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.tipo_prestamoForm.reset();
    this.tipo_prestamo = null;
  }




}
