import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { RegionesService } from 'src/app/services/catalogos/regiones.service';
import Swal from 'sweetalert2';

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
    private regionService: RegionesService
  ) {
    this.regionForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getRegiones();
  }


   // CRUD regiones
   async getRegiones() {
    let regiones = await this.regionService.getRegiones();
    if (regiones) {
      this.regiones = regiones;
    }
  }

  async postRegion() {
    let region = await this.regionService.postRegion(this.regionForm.value);
    if (region.resultado) {
      this.getRegiones();
      this.alert.alertMax('Transaccion Correcta', region.mensaje, 'success');
      this.regionForm.reset();
    }
  }

  async putRegion() {
    let region = await this.regionService.putRegion(this.region.id, this.regionForm.value);
    if (region.resultado) {
      this.getRegiones();
      this.alert.alertMax('Transaccion Correcta', region.mensaje, 'success');
      this.regionForm.reset();
      this.region = null;
    }
  }

  async deleteRegion(i: any, index: number) {
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
        let region = await this.regionService.deleteRegion(i.id);
        if (region.resultado) {
          this.regiones.splice(index, 1);
          this.alert.alertMax('Correcto', region.mensaje, 'success');
          this.region = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setRegion(i: any, index: number) {
    i.index = index;
    this.region = i;
    this.regionForm.controls['codigo'].setValue(i.codigo);
    this.regionForm.controls['descripcion'].setValue(i.descripcion);
  }

  cancelarEdicion() {
    this.regionForm.reset();
    this.region = null;
  }



}
