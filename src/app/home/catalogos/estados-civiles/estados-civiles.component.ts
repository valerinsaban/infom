import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { EstadosCivilesService } from 'src/app/services/catalogos/estados-civiles.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-estados-civiles',
  templateUrl: './estados-civiles.component.html',
  styleUrls: ['./estados-civiles.component.css']
})
export class EstadosCivilesComponent {

  estadoCivilForm: FormGroup;
  estadosCiviles: any = [];
  estadoCivil: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private estadoCivilService: EstadosCivilesService
  ) {
    this.estadoCivilForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getEstadosCiviles();
    this.ngxService.stop();
  }

  // CRUD estado civil
  async getEstadosCiviles() {
    let estadoCivil = await this.estadoCivilService.getEstadosCiviles();
    if (estadoCivil) {
      this.estadosCiviles = estadoCivil;
    }
  }

  async postEstadoCivil() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let estadoCivil = await this.estadoCivilService.postEstadoCivil(this.estadoCivilForm.value);
    if (estadoCivil.resultado) {
      await this.getEstadosCiviles();
      this.alert.alertMax('Transaccion Correcta', estadoCivil.mensaje, 'success');
      this.estadoCivilForm.reset();
    }
    this.ngxService.stop();
  }

  async putEstadoCivil() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let estadoCivil = await this.estadoCivilService.putEstadoCivil(this.estadoCivil.id, this.estadoCivilForm.value);
    if (estadoCivil.resultado) {
      await this.getEstadosCiviles();
      this.alert.alertMax('Transaccion Correcta', estadoCivil.mensaje, 'success');
      this.estadoCivilForm.reset();
      this.estadoCivil = null;
    }
    this.ngxService.stop();
  }

  async deleteEstadoCivil(i: any, index: number) {
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
        let estadoCivil = await this.estadoCivilService.deleteEstadoCivil(i.id);
        if (estadoCivil.resultado) {
          this.estadosCiviles.splice(index, 1);
          this.alert.alertMax('Correcto', estadoCivil.mensaje, 'success');
          this.estadoCivil = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setEstadoCivil(i: any, index: number) {
    i.index = index;
    this.estadoCivil = i;
    this.estadoCivilForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.estadoCivilForm.reset();
    this.estadoCivil = null;
  }

}
