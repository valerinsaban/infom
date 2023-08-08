import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DestinoPrestamoService } from 'src/app/services/catalogos/destino-prestamo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-destino-prestamo',
  templateUrl: './destino-prestamo.component.html',
  styleUrls: ['./destino-prestamo.component.css']
})
export class DestinoPrestamoComponent {

  destinoPrestamoForm: FormGroup;
  destinoPrestamos: any = [];
  destinoPrestamo: any;


  constructor(
    private alert: AlertService,
    private destinoPrestamoService: DestinoPrestamoService
  ) {
    this.destinoPrestamoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getDestinoPrestamos();
  }


  // CRUD Destino Prestamos
  async getDestinoPrestamos() {
    let destinoPrestamos = await this.destinoPrestamoService.getDestinoPrestamos();
    if (destinoPrestamos) {
      this.destinoPrestamos = destinoPrestamos;
    }
  }


  async postDestinoPrestamo() {
    let destinoPrestamo = await this.destinoPrestamoService.postDestinoPrestamo(this.destinoPrestamoForm.value);
    if (destinoPrestamo.resultado) {
      this.getDestinoPrestamos();
      this.alert.alertMax('Transaccion Correcta', destinoPrestamo.mensaje, 'success');
      this.destinoPrestamoForm.reset();
    }
  }

  async putDestinoPrestamo() {
    let destinoPrestamo = await this.destinoPrestamoService.putDestinoPrestamo(this.destinoPrestamo.id, this.destinoPrestamoForm.value);
    if (destinoPrestamo.resultado) {
      this.getDestinoPrestamos();
      this.alert.alertMax('Transaccion Correcta', destinoPrestamo.mensaje, 'success');
      this.destinoPrestamoForm.reset();
      this.destinoPrestamo = null;
    }
  }

  async deleteDestinoPrestamo(i: any, index: number) {
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
        let destinoPrestamo = await this.destinoPrestamoService.deleteDestinoPrestamo(i.id);
        if (destinoPrestamo.resultado) {
          this.destinoPrestamos.splice(index, 1);
          this.alert.alertMax('Correcto', destinoPrestamo.mensaje, 'success');
          this.destinoPrestamo = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setDestinoPrestamo(i: any, index: number) {
    i.index = index;
    this.destinoPrestamo = i;
    this.destinoPrestamoForm.controls['codigo'].setValue(i.codigo);
    this.destinoPrestamoForm.controls['descripcion'].setValue(i.descripcion);
  }

  cancelarEdicion() {
    this.destinoPrestamoForm.reset();
    this.destinoPrestamo = null;
  }



}
