import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { RegionesService } from 'src/app/services/catalogos/regiones.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.component.html',
  styleUrls: ['./regiones.component.css']
})
export class RegionesComponent {


  regionForm: FormGroup;
  regiones: any = [];
  region: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private regionService: RegionesService
  ) {
    this.regionForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getRegiones();
    this.ngxService.stop();
  }


   // CRUD regiones
   async getRegiones() {
    let regiones = await this.regionService.getRegiones();
    if (regiones) {
      this.regiones = regiones;
    }
  }

  async postRegion() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let region = await this.regionService.postRegion(this.regionForm.value);
    if (region.resultado) {
      await this.getRegiones();
      this.alert.alertMax('Operacion Correcta', region.mensaje, 'success');
      this.regionForm.reset();
    }
    this.ngxService.stop();
  }

  async putRegion() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let region = await this.regionService.putRegion(this.region.id, this.regionForm.value);
    if (region.resultado) {
      await this.getRegiones();
      this.alert.alertMax('Operacion Correcta', region.mensaje, 'success');
      this.regionForm.reset();
      this.region = null;
    }
    this.ngxService.stop();
  }

  async deleteRegion(i: any, index: number) {
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
        let region = await this.regionService.deleteRegion(i.id);
        if (region.resultado) {
          this.regiones.splice(index, 1);
          this.alert.alertMax('Correcto', region.mensaje, 'success');
          this.region = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setRegion(i: any, index: number) {
    i.index = index;
    this.region = i;
    this.regionForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.regionForm.reset();
    this.region = null;
  }



}
