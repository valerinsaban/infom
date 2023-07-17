import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { RegionesService } from 'src/app/services/catalogos/regiones.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

usuarioForm: FormGroup;
usuarios: any = [];
usuario: any;
regiones: any = [];

constructor(
  private alert: AlertService,
  private usuarioService: UsuariosService,
  private regionService: RegionesService
){
  this.usuarioForm = new FormGroup({

    codigo: new FormControl(null, [Validators.required]),
    idRegion: new FormControl(null, [Validators.required]),
    login: new FormControl(null, [Validators.required]),
    nombre: new FormControl(null, [Validators.required]),
    fotografia: new FormControl(null, [Validators.required]),
    firma: new FormControl(null, [Validators.required]),

  })
}

async ngOnInit() {
  await this.getRegion();
  await this.getUsuarios();
}

// Listado registro
async getRegion() {
  this.usuarioForm.controls['idRegion'].setValue(1);
  let regiones = await this.regionService.getRegiones();
 // console.log(regiones);
  if (regiones) {
    this.regiones = regiones.data;
  }
}

 // CRUD Usuarios
async getUsuarios() {
  let usuarios = await this.usuarioService.getUsuarios();
  if (usuarios) {
    this.usuarios = usuarios.data;
  }
}

async postUsuario() {
  let usaurio = await this.usuarioService.postUsuario(this.usuarioForm.value);
  if (usaurio.resultado) {
    this.getUsuarios();
    this.alert.alertMax('Transaccion Correcta', usaurio.mensaje, 'success');
    this.usuarioForm.reset();
  }
}

async putUsuario() {
  let usuario = await this.usuarioService.putUsuario(this.usuario.id, this.usuarioForm.value);
  if (usuario.resultado) {
    this.getUsuarios();
    this.alert.alertMax('Transaccion Correcta', usuario.mensaje, 'success');
    this.usuarioForm.reset();
    this.usuario = null;
  }
}

async deleteUsuario(i: any, index: number) {
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
      let usuario = await this.usuarioService.deleteUsuario(i.id);
      if (usuario.resultado) {
        this.usuarios.splice(index, 1);
        this.alert.alertMax('Correcto', usuario.mensaje, 'success');
        this.usuario = null;
      }
    }
  })
}

 // Metodos para obtener data y id de registro seleccionado
setUsuario(i: any, index: number) {
  i.index = index;
  this.usuario = i;
  this.usuarioForm.controls['codigo'].setValue(i.codigo);
  this.usuarioForm.controls['idRegion'].setValue(i.idRegion);
  this.usuarioForm.controls['nombre'].setValue(i.nombre);
  this.usuarioForm.controls['login'].setValue(i.login);
  this.usuarioForm.controls['fotografia'].setValue(i.fotografia);
  this.usuarioForm.controls['firma'].setValue(i.firma);
}

async cancelarEdicion() {
  this.usuarioForm.reset();
  this.usuario = null;
  await this.getRegion();
}

changeRegion(e: any){
  console.log(e.target.value)
}


}
