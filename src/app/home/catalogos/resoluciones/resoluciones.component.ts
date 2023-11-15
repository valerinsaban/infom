import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { ResolucionesService } from 'src/app/services/catalogos/resoluciones.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-resoluciones',
  templateUrl: './resoluciones.component.html',
  styleUrls: ['./resoluciones.component.css']
})
export class ResolucionesComponent {

  resolucionForm: FormGroup;
  resoluciones: any = [];
  resolucion: any;


  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private resolucionesService: ResolucionesService) {
    this.resolucionForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      numero: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      articulos: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getResoluciones();
    this.ngxService.stop();
  }

  // CRUD Resoluciones
  async getResoluciones() {
    let resoluciones = await this.resolucionesService.getResoluciones();
    if (resoluciones) {
      this.resoluciones = resoluciones;
    }
  }

  async postResolucion() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let resolucion = await this.resolucionesService.postResolucion(this.resolucionForm.value);
    if (resolucion.resultado) {
      await this.getResoluciones();
      this.alert.alertMax('Operacion Correcta', resolucion.mensaje, 'success');
      this.resolucionForm.reset();
    }
    this.ngxService.stop();
  }

  async putResolucion() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let resolucion = await this.resolucionesService.putResolucion(this.resolucion.id, this.resolucionForm.value);
    if (resolucion.resultado) {
      await this.getResoluciones();
      this.alert.alertMax('Operacion Correcta', resolucion.mensaje, 'success');
      this.resolucionForm.reset();
      this.resolucion = null;
    }
    this.ngxService.stop();
  }

  async deleteResolucion(i: any, index: number) {
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
        let resolucion = await this.resolucionesService.deleteResolucion(i.id);
        if (resolucion.resultado) {
          this.resoluciones.splice(index, 1);
          this.alert.alertMax('Correcto', resolucion.mensaje, 'success');
          this.resolucion = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setResolucion(i: any, index: number) {
    i.index = index;
    this.resolucion = i;
    this.resolucionForm.controls['nombre'].setValue(i.nombre);
    this.resolucionForm.controls['numero'].setValue(i.numero);
    this.resolucionForm.controls['fecha'].setValue(i.fecha);
    this.resolucionForm.controls['articulos'].setValue(i.articulos);
  }

  cancelarEdicion() {
    this.resolucionForm.reset();
    this.resolucion = null;
  }



}
