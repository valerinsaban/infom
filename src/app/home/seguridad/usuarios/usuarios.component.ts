import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { RegionalesService } from 'src/app/services/catalogos/regionales.service';
import { RolesService } from 'src/app/services/seguridad/roles.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  usuarioForm: FormGroup;
  usuarios: any = [];
  usuario: any;
  regionales: any = [];
  roles: any = [];

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private usuariosService: UsuariosService,
    private regionalesService: RegionalesService,
    private rolesService: RolesService
  ) {
    this.usuarioForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      dpi: new FormControl(null, [Validators.required]),
      usuario: new FormControl(null, [Validators.required]),
      clave: new FormControl(null),
      id_regional: new FormControl(null, [Validators.required]),
      id_rol: new FormControl(null, [Validators.required])
    })
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getUsuarios();
    await this.getRegionales();
    await this.getRoles();
    this.ngxService.stop();
  }

  // CRUD Usuarios
  async getUsuarios() {
    let usuarios = await this.usuariosService.getUsuarios();
    if (usuarios) {
      this.usuarios = usuarios;
    }
  }

  async getRegionales() {
    let regionales = await this.regionalesService.getRegionales();
    if (regionales) {
      this.regionales = regionales;
    }
  }

  async getRoles() {
    let roles = await this.rolesService.getRoles();
    if (roles) {
      this.roles = roles;
    }
  }

  async postUsuario() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let usaurio = await this.usuariosService.postUsuario(this.usuarioForm.value);
    if (usaurio.resultado) {
      this.getUsuarios();
      this.alert.alertMax('Transaccion Correcta', usaurio.mensaje, 'success');
      this.usuarioForm.reset();
    }
    this.ngxService.stop();
  }

  async putUsuario() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let usuario = await this.usuariosService.putUsuario(this.usuario.id, this.usuarioForm.value);
    if (usuario.resultado) {
      this.getUsuarios();
      this.alert.alertMax('Transaccion Correcta', usuario.mensaje, 'success');
      this.usuarioForm.reset();
      this.usuario = null;
    }
    this.ngxService.stop();
  }

  async putClave() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let usuario = await this.usuariosService.putClave(this.usuario.id, this.usuarioForm.value);
    if (usuario.resultado) {
      this.getUsuarios();
      this.alert.alertMax('Transaccion Correcta', usuario.mensaje, 'success');
      this.usuarioForm.reset();
      this.usuario = null;
    }
    this.ngxService.stop();
  }

  async deleteUsuario(i: any, index: number) {
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
        let usuario = await this.usuariosService.deleteUsuario(i.id);
        if (usuario.resultado) {
          this.usuarios.splice(index, 1);
          this.alert.alertMax('Correcto', usuario.mensaje, 'success');
          this.usuario = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setUsuario(i: any, index: number) {
    i.index = index;
    this.usuario = i;
    this.usuarioForm.controls['nombre'].setValue(i.nombre);
    this.usuarioForm.controls['apellido'].setValue(i.apellido);
    this.usuarioForm.controls['dpi'].setValue(i.dpi);
    this.usuarioForm.controls['usuario'].setValue(i.usuario);
    // this.usuarioForm.controls['clave'].setValue(i.clave);
    this.usuarioForm.controls['id_regional'].setValue(i.id_regional);
    this.usuarioForm.controls['id_rol'].setValue(i.id_rol);
  }

  async cancelarEdicion() {
    this.usuarioForm.reset();
    this.usuario = null;
    await this.getRegionales();
  }

  changeRegion(e: any) {
    console.log(e.target.value)
  }


}
