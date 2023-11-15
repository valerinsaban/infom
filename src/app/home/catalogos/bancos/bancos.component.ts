import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { BancosService } from 'src/app/services/catalogos/bancos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';
import { ProfesionesService } from 'src/app/services/catalogos/profesiones.service';
import { EstadosCivilesService } from 'src/app/services/catalogos/estados-civiles.service';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent {

  bancoForm: FormGroup;
  bancos: any = [];
  profesiones: any = [];
  estados_civiles: any = [];
  banco: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private bancoService: BancosService,
    private profesionesService: ProfesionesService,
    private estados_civilesService: EstadosCivilesService
  ) {
    this.bancoForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      siglas: new FormControl(null, [Validators.required]),
      r_nombre: new FormControl(null, [Validators.required]),
      r_apellido: new FormControl(null, [Validators.required]),
      fecha_nacimiento: new FormControl(null, [Validators.required]),
      dpi: new FormControl(null, [Validators.required]),
      notario_autoriza: new FormControl(null, [Validators.required]),
      acta_notarial: new FormControl(null, [Validators.required]),
      fecha_acta_notarial: new FormControl(null, [Validators.required]),
      libro: new FormControl(null, [Validators.required]),
      folio: new FormControl(null, [Validators.required]),
      id_profesion: new FormControl(null, [Validators.required]),
      id_estado_civil: new FormControl(null, [Validators.required]),
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getBancos();
    await this.getProfesiones();
    await this.getEstadosCiviles();
    this.ngxService.stop();
  }

  // CRUD bancos
  async getBancos() {
    let bancos = await this.bancoService.getBancos();
    if (bancos) {
      this.bancos = bancos;
    }
  }

  async getProfesiones() {
    let profesiones = await this.profesionesService.getProfesiones();
    if (profesiones) {
      this.profesiones = profesiones;
    }
  }

  async getEstadosCiviles() {
    let estados_civiles = await this.estados_civilesService.getEstadosCiviles();
    if (estados_civiles) {
      this.estados_civiles = estados_civiles;
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
          this.bancos.splice(index, 1);
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
    this.bancoForm.controls['nombre'].setValue(i.nombre);
    this.bancoForm.controls['siglas'].setValue(i.siglas);
    this.bancoForm.controls['r_nombre'].setValue(i.r_nombre);
    this.bancoForm.controls['r_apellido'].setValue(i.r_apellido);
    this.bancoForm.controls['fecha_nacimiento'].setValue(i.fecha_nacimiento);
    this.bancoForm.controls['dpi'].setValue(i.dpi);
    this.bancoForm.controls['notario_autoriza'].setValue(i.notario_autoriza);
    this.bancoForm.controls['acta_notarial'].setValue(i.acta_notarial);
    this.bancoForm.controls['fecha_acta_notarial'].setValue(i.fecha_acta_notarial);
    this.bancoForm.controls['libro'].setValue(i.libro);
    this.bancoForm.controls['folio'].setValue(i.folio);
    this.bancoForm.controls['id_profesion'].setValue(i.id_profesion);
    this.bancoForm.controls['id_estado_civil'].setValue(i.id_estado_civil);

  }

  cancelarEdicion() {
    this.bancoForm.reset();
    this.banco = null;
  }
  
}
