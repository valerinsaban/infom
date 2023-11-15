import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { TiposServiciosService } from 'src/app/services/catalogos/tipos-servicios.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';

@Component({
  selector: 'app-tipos-servicios',
  templateUrl: './tipos-servicios.component.html',
  styleUrls: ['./tipos-servicios.component.css']
})
export class TiposServiciosComponent {

  tipo_servicioForm: FormGroup;
  tipos_servicios: any = [];
  garantias: any = [];
  tipo_servicio: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private tipo_servicioService: TiposServiciosService,
    private garantiasService: GarantiasService
  ) {
    this.tipo_servicioForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      iva: new FormControl(null)
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getTiposServicios();
    await this.getGarantias();
    this.ngxService.stop();
  }

  // CRUD tipos_servicios
  async getTiposServicios() {
    let tipos_servicios = await this.tipo_servicioService.getTiposServicios();
    if (tipos_servicios) {
      this.tipos_servicios = tipos_servicios;
    }
  }

  async getGarantias() {
    let garantias = await this.garantiasService.getGarantias();
    if (garantias) {
      this.garantias = garantias;
    }
  }

  async postTipoServicio() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let tipo_servicio = await this.tipo_servicioService.postTipoServicio(this.tipo_servicioForm.value);
    if (tipo_servicio.resultado) {
      await this.getTiposServicios();
      this.alert.alertMax('Operacion Correcta', tipo_servicio.mensaje, 'success');
      this.tipo_servicioForm.reset();
    }
    this.ngxService.stop();
  }

  async putTipoServicio() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let tipo_servicio = await this.tipo_servicioService.putTipoServicio(this.tipo_servicio.id, this.tipo_servicioForm.value);
    if (tipo_servicio.resultado) {
      await this.getTiposServicios();
      this.alert.alertMax('Operacion Correcta', tipo_servicio.mensaje, 'success');
      this.tipo_servicioForm.reset();
      this.tipo_servicio = null;
    }
    this.ngxService.stop();
  }

  async deleteTipoServicio(i: any, index: number) {
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
        let tipo_servicio = await this.tipo_servicioService.deleteTipoServicio(i.id);
        if (tipo_servicio.resultado) {
          this.tipos_servicios.splice(index, 1);
          this.alert.alertMax('Correcto', tipo_servicio.mensaje, 'success');
          this.tipo_servicio = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  async setTipoServicio(i: any, index: number) {
    this.ngxService.start();
    i.index = index;
    this.tipo_servicio = i;
    this.tipo_servicioForm.controls['nombre'].setValue(i.nombre);
    this.tipo_servicioForm.controls['iva'].setValue(i.iva);

    this.ngxService.stop();
  }

  cancelarEdicion() {
    this.tipo_servicioForm.reset();
    this.tipo_servicio = null;
  }

}
