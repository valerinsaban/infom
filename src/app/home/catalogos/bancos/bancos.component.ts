import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { BancosService } from 'src/app/services/catalogos/bancos.service';
import Swal from 'sweetalert2';

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
    private bancoService: BancosService
  ) {
    this.bancoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      siglas: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getBancos();
  }

  // CRUD bancos
  async getBancos() {
    let bancos = await this.bancoService.getBancos();
    if (bancos) {
      this.bancos = bancos;
    }
  }

  async postBanco() {
    let banco = await this.bancoService.postBanco(this.bancoForm.value);
    if (banco.resultado) {
      await this.getBancos();
      this.alert.alertMax('Transaccion Correcta', banco.mensaje, 'success');
      this.bancoForm.reset();
    }
  }

  async putBanco() {
    let banco = await this.bancoService.putBanco(this.banco.id, this.bancoForm.value);
    if (banco.resultado) {
      await this.getBancos();
      this.alert.alertMax('Transaccion Correcta', banco.mensaje, 'success');
      this.bancoForm.reset();
      this.banco = null;
    }
  }

  async deleteBanco(i: any, index: number) {
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
        let banco = await this.bancoService.deleteBanco(i.id);
        if (banco.resultado) {
          this.banco.splice(index, 1);
          this.alert.alertMax('Correcto', banco.mensaje, 'success');
          this.banco = null;
        }
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
