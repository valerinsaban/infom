import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent {

  configuracionForm: FormGroup;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private configuracionesService: ConfiguracionesService
  ) {
    this.configuracionForm = new FormGroup({
      id: new FormControl(null),
      logo: new FormControl(null),
      portada: new FormControl(null),
      nombre: new FormControl(null),
      correo: new FormControl(null),
      telefono: new FormControl(null),
      direccion: new FormControl(null),
      sitio_web: new FormControl(null),
      porcentaje_interes: new FormControl(null),
      porcentaje_iva: new FormControl(null),
      periodo_fin: new FormControl(null)
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getConfiguraciones();
    this.ngxService.stop();
  }

  async getConfiguraciones() {
    let configuraciones = await this.configuracionesService.getConfiguraciones();
    if (configuraciones) {
      this.configuracionForm.setValue(configuraciones[0])
    }
  }

  async putCongifuracion() {
    this.ngxService.start();
    let configuracion = await this.configuracionesService.putConfiguracion(1, this.configuracionForm.value);
    if (configuracion.resultado) {
      this.alert.alertMax('Transaccion Correcta', configuracion.mensaje, 'success');
    }
    this.ngxService.stop();
  }

  get configuracion() {
    return this.configuracionForm.value;
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.configuracionForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

}
