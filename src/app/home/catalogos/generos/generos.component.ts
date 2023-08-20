import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { GenerosService } from 'src/app/services/catalogos/generos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-generos',
  templateUrl: './generos.component.html',
  styleUrls: ['./generos.component.css']
})
export class GenerosComponent {

  generoForm: FormGroup;
  generos: any = [];
  genero: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private generoService: GenerosService
  ) {
    this.generoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }


  async ngOnInit() {
    this.ngxService.start();
    await this.getGeneros();
    this.ngxService.stop();
  }


  // CRUD Generos
  async getGeneros() {
    let generos = await this.generoService.getGeneros();
    if (generos) {
      this.generos = generos;
    }
  }

  async postGenero() {
    if (!HomeComponent.getPermiso('Agregar')){
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let genero = await this.generoService.postGenero(this.generoForm.value);
    if (genero.resultado) {
      await this.getGeneros();
      this.alert.alertMax('Transaccion Correcta', genero.mensaje, 'success');
      this.generoForm.reset();
    }
    this.ngxService.stop();
  }

  async putGenero() {
    if (!HomeComponent.getPermiso('Editar')){
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let genero = await this.generoService.putGenero(this.genero.id, this.generoForm.value);
    if (genero.resultado) {
      await this.getGeneros();
      this.alert.alertMax('Transaccion Correcta', genero.mensaje, 'success');
      this.generoForm.reset();
      this.genero = null;
    }
    this.ngxService.stop();
  }

  async deleteGenero(i: any, index: number) {
    if (!HomeComponent.getPermiso('Eliminar')){
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
        let genero = await this.generoService.deleteGenero(i.id);
        if (genero.resultado) {
          this.generos.splice(index, 1);
          this.alert.alertMax('Correcto', genero.mensaje, 'success');
          this.generos = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setGenero(i: any, index: number) {
    i.index = index;
    this.genero = i;
    this.generoForm.controls['codigo'].setValue(i.codigo);
    this.generoForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.generoForm.reset();
    this.genero = null;
  }

}
