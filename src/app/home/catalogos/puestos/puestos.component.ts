import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { PuestosService } from 'src/app/services/catalogos/puestos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

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
    private ngxService: NgxUiLoaderService,
    private puestosService: PuestosService) {
    this.puestoForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getPuestos();
    this.ngxService.stop();
  }

  // CRUD Puestos
  async getPuestos() {
    let puestos = await this.puestosService.getPuestos();
    if (puestos) {
      this.puestos = puestos;
    }
  }

  async postPuesto() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let puesto = await this.puestosService.postPuesto(this.puestoForm.value);
    if (puesto.resultado) {
      await this.getPuestos();
      this.alert.alertMax('Operacion Correcta', puesto.mensaje, 'success');
      this.puestoForm.reset();
    }
    this.ngxService.stop();
  }

  async putPuesto() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let puesto = await this.puestosService.putPuesto(this.puesto.id, this.puestoForm.value);
    if (puesto.resultado) {
      await this.getPuestos();
      this.alert.alertMax('Operacion Correcta', puesto.mensaje, 'success');
      this.puestoForm.reset();
      this.puesto = null;
    }
    this.ngxService.stop();
  }

  async deletePuesto(i: any, index: number) {
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
        let puesto = await this.puestosService.deletePuesto(i.id);
        if (puesto.resultado) {
          this.puestos.splice(index, 1);
          this.alert.alertMax('Correcto', puesto.mensaje, 'success');
          this.puesto = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setPuesto(i: any, index: number) {
    i.index = index;
    this.puesto = i;
    this.puestoForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.puestoForm.reset();
    this.puesto = null;
  }



}
