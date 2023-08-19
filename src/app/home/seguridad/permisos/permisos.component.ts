import { Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { MenusService } from 'src/app/services/seguridad/menu.service';
import { PermisosService } from 'src/app/services/seguridad/permisos.service';
import { RolesService } from 'src/app/services/seguridad/roles.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class PermisosComponent {

  roles: any = [];
  menus: any = [];
  permisos: any = [];

  constructor(
    private alert: AlertService,
    private rolesService: RolesService,
    private menusService: MenusService,
    private permisosService: PermisosService
  ) {

  }

  async ngOnInit() {
    await this.getRoles();
    await this.getMenus();
    await this.getPermisos();
  }

  async getRoles() {
    let roles = await this.rolesService.getRoles();
    if (roles) {
      this.roles = roles;
    }
  }

  async getMenus() {
    let menus = await this.menusService.getMenus();
    if (menus) {
      this.menus = menus;
    }
  }

  async getPermisos() {
    let permisos = await this.permisosService.getPermisos();
    if (permisos) {
      this.permisos = permisos;
    }
  }

  getPermiso(accion: string, rol: any, menu: any, submenu: any = null) {     
    for (let p = 0; p < this.permisos.length; p++) {
      let per = this.permisos[p];
      if (per.accion == accion && per.id_rol == rol.id && per.id_menu == menu.id && per.id_submenu == (submenu ? submenu.id : null)) {
        return true;
      }
    }
    return false;
  }

  async setPermiso(accion: string, rol: any, menu: any, submenu: any = null) {
    let permiso = await this.permisosService.postPermiso({
      accion: accion,
      id_rol: rol ? rol.id : null,
      id_menu: menu ? menu.id : null,
      id_submenu: submenu ? submenu.id : null
    });
    if (permiso.resultado) {
      await this.getPermisos();
      this.alert.alertMin(permiso.mensaje, 'success');
    }3
  }

}
