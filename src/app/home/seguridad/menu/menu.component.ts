import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { MenuService } from 'src/app/services/seguridad/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  menuForm: FormGroup;
  menus: any = [];
  menu: any;

  constructor(
    private alert: AlertService,
    private menuService: MenuService){
        this.menuForm = new FormGroup({
          nombreMenu: new FormControl(null, [Validators.required])
      });
    }

    async ngOnInit() {
      await this.getMenus();
    }

    // CRUD roles
  async getMenus() {
    let menus = await this.menuService.getMenus();
    if (menus) {
      this.menus = menus.data;
    }
  }


  async postMenu() {
    let menu = await this.menuService.postMenu(this.menuForm.value);
    if (menu.resultado) {
      this.getMenus();
      this.alert.alertMax('Transaccion Correcta', menu.mensaje, 'success');
      this.menuForm.reset();
    }
  }

  async putMenu() {
    let menu = await this.menuService.putMenu(this.menu.id, this.menuForm.value);
    if (menu.resultado) {
      this.getMenus();
      this.alert.alertMax('Transaccion Correcta', menu.mensaje, 'success');
      this.menuForm.reset();
      this.menu = null;
    }
  }

  async deleteMenu(i: any, index: number) {
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
        let menu = await this.menuService.deleteMenu(i.id);
        if (menu.resultado) {
          this.menu.splice(index, 1);
          this.alert.alertMax('Correcto', menu.mensaje, 'success');
          this.menu = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setMenu(i: any, index: number) {
    i.index = index;
    this.menu = i;
    this.menuForm.controls['nombreMenu'].setValue(i.nombreMenu);
  }

  cancelarEdicion() {
    this.menuForm.reset();
    this.menu = null;
  }

}
