import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { PuestosService } from 'src/app/services/catalogos/puestos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class PuestosComponent {

  puestoForm: FormGroup;
  puestos: any = [];
  puesto: any;


  constructor(
    private alert: AlertService,
    private puestosService: PuestosService) {
    this.puestoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getPuestos();
  }

  // CRUD Puestos
  async getPuestos() {
    let puestos = await this.puestosService.getPuestos();
    if (puestos) {
      this.puestos = puestos;
    }
  }

  async postPuesto() {
    let puesto = await this.puestosService.postPuesto(this.puestoForm.value);
    if (puesto.resultado) {
      await this.getPuestos();
      this.alert.alertMax('Transaccion Correcta', puesto.mensaje, 'success');
      this.puestoForm.reset();
    }
  }

  async putPuesto() {
    let puesto = await this.puestosService.putPuesto(this.puesto.id, this.puestoForm.value);
    if (puesto.resultado) {
      await this.getPuestos();
      this.alert.alertMax('Transaccion Correcta', puesto.mensaje, 'success');
      this.puestoForm.reset();
      this.puesto = null;
    }
  }

  async deletePuesto(i: any, index: number) {
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
        let puesto = await this.puestosService.deletePuesto(i.id);
        if (puesto.resultado) {
          this.puestos.splice(index, 1);
          this.alert.alertMax('Correcto', puesto.mensaje, 'success');
          this.puesto = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setPuesto(i: any, index: number) {
    i.index = index;
    this.puesto = i;
    this.puestoForm.controls['codigo'].setValue(i.codigo);
    this.puestoForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.puestoForm.reset();
    this.puesto = null;
  }



}
