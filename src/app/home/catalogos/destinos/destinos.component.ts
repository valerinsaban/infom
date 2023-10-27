import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { DestinosService } from 'src/app/services/catalogos/destinos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-destinos',
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.css']
})
export class DestinosComponent {

  destinoForm: FormGroup;
  destinos: any = [];
  destino: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private destinosService: DestinosService) {
    this.destinoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDestinos();
    this.ngxService.stop();
  }

  // CRUD Destinos
  async getDestinos() {
    let destinos = await this.destinosService.getDestinos();
    if (destinos) {
      this.destinos = destinos;
    }
  }

  async postDestino() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let destino = await this.destinosService.postDestino(this.destinoForm.value);
    if (destino.resultado) {
      await this.getDestinos();
      this.alert.alertMax('Transaccion Correcta', destino.mensaje, 'success');
      this.destinoForm.reset();
    }
    this.ngxService.stop();
  }

  async putDestino() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let destino = await this.destinosService.putDestino(this.destino.id, this.destinoForm.value);
    if (destino.resultado) {
      await this.getDestinos();
      this.alert.alertMax('Transaccion Correcta', destino.mensaje, 'success');
      this.destinoForm.reset();
      this.destino = null;
    }
    this.ngxService.stop();
  }

  async deleteDestino(i: any, index: number) {
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
        let destino = await this.destinosService.deleteDestino(i.id);
        if (destino.resultado) {
          this.destinos.splice(index, 1);
          this.alert.alertMax('Correcto', destino.mensaje, 'success');
          this.destino = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setDestino(i: any, index: number) {
    i.index = index;
    this.destino = i;
    this.destinoForm.controls['codigo'].setValue(i.codigo);
    this.destinoForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.destinoForm.reset();
    this.destino = null;
  }



}
