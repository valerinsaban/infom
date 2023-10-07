import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import decode from 'jwt-decode';
import { UsuariosService } from './seguridad/usuarios.service';
import { HomeComponent } from '../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private rootService: RootService,
    private usuariosService: UsuariosService
  ) { }

  async login(data: any): Promise<any> {
    try {
      let auth = await this.rootService.authPost('/auth/login', data);
      if (auth.token) {
        let u: any = decode(auth.token);
        let usuario: any = await this.usuariosService.getUsuariosByUsuario(u.sub);
        HomeComponent.id_usuario = usuario.id;
        await this.rootService.bitacora('auth', 'auth', 'ha iniciado sesión', auth);
      }
      return auth;
    } catch (error) {
      return { resultado: false, message: 'Credenciales Inválidas' }
    }
  }

}
