import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { UsuariosService } from 'src/app/services/seguridad/usuarios.service';
import decode from 'jwt-decode';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  usuarioForm: FormGroup;
  usuario: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private usuariosService: UsuariosService
  ) {
    this.usuarioForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      dpi: new FormControl(null, [Validators.required]),
      usuario: new FormControl(null, [Validators.required]),
      clave: new FormControl(null),
      clave2: new FormControl(null)
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getUsuario();
    this.ngxService.stop();
  }

  async getUsuario() {
    let token: any = sessionStorage.getItem('token');
    let user: any = decode(token);
    let usuario = await this.usuariosService.getUsuariosByUsuario(user.sub);
    if (usuario) {
      this.usuarioForm.controls['nombre'].setValue(usuario.nombre);
      this.usuarioForm.controls['apellido'].setValue(usuario.apellido);
      this.usuarioForm.controls['dpi'].setValue(usuario.dpi);
      this.usuarioForm.controls['usuario'].setValue(usuario.usuario);

      this.usuario = usuario;
    }
  }

  async putPerfil() {
    this.ngxService.start();
    let usuario = await this.usuariosService.putPerfil(this.usuario.id, {
      nombre: this.usuarioForm.controls['nombre'].value,
      apellido: this.usuarioForm.controls['apellido'].value,
      dpi: this.usuarioForm.controls['dpi'].value,
      usuario: this.usuarioForm.controls['usuario'].value
    });
    if (usuario.resultado) {
      this.alert.alertMax('Operacion Correcta', usuario.mensaje, 'success');
    }
    this.ngxService.stop();
  }

  async putClave() {
    if (this.usuarioForm.controls['clave'].value == this.usuarioForm.controls['clave2'].value) {
      this.ngxService.start();
      let usuario = await this.usuariosService.putClave(this.usuario.id, {
        clave: this.usuarioForm.controls['clave'].value
      });
      if (usuario.resultado) {
        this.alert.alertMax('Operacion Correcta', usuario.mensaje, 'success');
      }
      this.ngxService.stop(); 
    } else {
      this.alert.alertMax('Operacion Incorrecta', 'Las claves no coinciden', 'error');
    }
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.usuarioForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }

}
