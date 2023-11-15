import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { RolesService } from 'src/app/services/seguridad/roles.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {

  rolForm: FormGroup;
  roles: any = [];
  rol: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private rolService: RolesService) {
    this.rolForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getRoles();
    this.ngxService.stop();
  }

  // CRUD roles
  async getRoles() {
    let roles = await this.rolService.getRoles();
    if (roles) {
      this.roles = roles;
      this.roles.shift();
    }
  }

  async postRol() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let rol = await this.rolService.postRol(this.rolForm.value);
    if (rol.resultado) {
      this.getRoles();
      this.alert.alertMax('Operacion Correcta', rol.mensaje, 'success');
      this.rolForm.reset();
    }
    this.ngxService.stop();
  }

  async putRol() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let rol = await this.rolService.putRol(this.rol.id, this.rolForm.value);
    if (rol.resultado) {
      this.getRoles();
      this.alert.alertMax('Operacion Correcta', rol.mensaje, 'success');
      this.rolForm.reset();
      this.rol = null;
    }
    this.ngxService.stop();
  }

  async deleteEstadoCivil(i: any, index: number) {
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
        let rol = await this.rolService.deleteRol(i.id);
        if (rol.resultado) {
          this.roles.splice(index, 1);
          this.alert.alertMax('Correcto', rol.mensaje, 'success');
          this.rol = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setRol(i: any, index: number) {
    i.index = index;
    this.rol = i;
    this.rolForm.controls['nombre'].setValue(i.nombre);
    this.rolForm.controls['color'].setValue(i.color);
  }

  cancelarEdicion() {
    this.rolForm.reset();
    this.rol = null;
  }
}
