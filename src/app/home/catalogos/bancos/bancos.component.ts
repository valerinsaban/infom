import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { BancosService } from 'src/app/services/catalogos/bancos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent {

  bancoForm: FormGroup;
  bancos: any = [];
  banco: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private bancoService: BancosService
  ) {
    this.bancoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      siglas: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getBancos();
    this.ngxService.stop();
  }

  // CRUD bancos
  async getBancos() {
    let bancos = await this.bancoService.getBancos();
    if (bancos) {
      this.bancos = bancos;
    }
  }

  async postBanco() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let banco = await this.bancoService.postBanco(this.bancoForm.value);
    if (banco.resultado) {
      await this.getBancos();
      this.alert.alertMax('Transaccion Correcta', banco.mensaje, 'success');
      this.bancoForm.reset();
    }
    this.ngxService.stop();
  }

  async putBanco() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let banco = await this.bancoService.putBanco(this.banco.id, this.bancoForm.value);
    if (banco.resultado) {
      await this.getBancos();
      this.alert.alertMax('Transaccion Correcta', banco.mensaje, 'success');
      this.bancoForm.reset();
      this.banco = null;
    }
    this.ngxService.stop();
  }

  async deleteBanco(i: any, index: number) {
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
        let banco = await this.bancoService.deleteBanco(i.id);
        if (banco.resultado) {
          this.banco.splice(index, 1);
          this.alert.alertMax('Correcto', banco.mensaje, 'success');
          this.banco = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setBanco(i: any, index: number) {
    i.index = index;
    this.banco = i;
    this.bancoForm.controls['codigo'].setValue(i.codigo);
    this.bancoForm.controls['nombre'].setValue(i.nombre);
    this.bancoForm.controls['siglas'].setValue(i.siglas);
  }

  cancelarEdicion() {
    this.bancoForm.reset();
    this.banco = null;
  }
  
}
