import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { RolesService } from 'src/app/services/seguridad/roles.service';
import Swal from 'sweetalert2';

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
    private rolService: RolesService) {
    this.rolForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getRoles();
  }

  // CRUD roles
  async getRoles() {
    let rol = await this.rolService.getRoles();
    if (rol) {
      this.roles = rol;
    }
  }

  async postRol() {
    let rol = await this.rolService.postRol(this.rolForm.value);
    if (rol.resultado) {
      this.getRoles();
      this.alert.alertMax('Transaccion Correcta', rol.mensaje, 'success');
      this.rolForm.reset();
    }
  }

  async putRol() {
    let rol = await this.rolService.putRol(this.rol.id, this.rolForm.value);
    if (rol.resultado) {
      this.getRoles();
      this.alert.alertMax('Transaccion Correcta', rol.mensaje, 'success');
      this.rolForm.reset();
      this.rol = null;
    }
  }

  async deleteEstadoCivil(i: any, index: number) {
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
        let rol = await this.rolService.deleteRol(i.id);
        if (rol.resultado) {
          this.rol.splice(index, 1);
          this.alert.alertMax('Correcto', rol.mensaje, 'success');
          this.rol = null;
        }
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
