import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { RegionalesService } from 'src/app/services/seguridad/regionales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-regionales',
  templateUrl: './regionales.component.html',
  styleUrls: ['./regionales.component.css']
})
export class RegionalesComponent {

  regionalForm: FormGroup;
  regionales: any = [];
  regional: any;

  constructor(
    private alert: AlertService,
    private regionalesService: RegionalesService
  ) {
    this.regionalForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      direccion: new FormControl(null),
      telefono: new FormControl(null),
      correo: new FormControl(null),
      encargado: new FormControl(null)
    });
  }

  async ngOnInit() {
    await this.getRegionales();
  }

  // CRUD regionales
  async getRegionales() {
    let regionales = await this.regionalesService.getRegionales();
    if (regionales) {
      this.regionales = regionales;
    }
  }

  async postRegional() {
    let regional = await this.regionalesService.postRegional(this.regionalForm.value);
    if (regional.resultado) {
      await this.getRegionales();
      this.alert.alertMax('Transaccion Correcta', regional.mensaje, 'success');
      this.cancelarEdicion();
    }
  }

  async putRegional() {
    let regional = await this.regionalesService.putRegional(this.regional.id, this.regionalForm.value);
    if (regional.resultado) {
      await this.getRegionales();
      this.alert.alertMax('Transaccion Correcta', regional.mensaje, 'success');
      this.cancelarEdicion();
    }
  }

  async deleteRegional(i: any, index: number) {
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
        let regional = await this.regionalesService.deleteRegional(i.id);
        if (regional.resultado) {
          this.regionales.splice(index, 1);
          this.alert.alertMax('Correcto', regional.mensaje, 'success');
          this.cancelarEdicion();
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setRegional(i: any, index: number) {
    i.index = index;
    this.regional = i;
    this.regionalForm.controls['codigo'].setValue(i.codigo);
    this.regionalForm.controls['nombre'].setValue(i.nombre);
    this.regionalForm.controls['direccion'].setValue(i.direccion);
    this.regionalForm.controls['telefono'].setValue(i.telefono);
    this.regionalForm.controls['correo'].setValue(i.correo);
    this.regionalForm.controls['encargado'].setValue(i.encargado);
  }

  cancelarEdicion() {
    this.regionalForm.reset();
    this.regional = null;
  }

}
