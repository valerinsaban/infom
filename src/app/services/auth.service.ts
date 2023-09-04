import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private rootService: RootService
  ) { }

  async login(data: any): Promise<any> {
    let auth = await this.rootService.authPost('/auth/login', data);
    if (auth.token) {
      await this.rootService.bitacora('auth', 'ha iniciado sesión', auth);
    }
    return auth;
  }

}
