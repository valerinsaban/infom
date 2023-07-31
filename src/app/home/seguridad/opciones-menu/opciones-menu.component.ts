import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { OpcionesMenuService } from 'src/app/services/seguridad/opciones-menu.service';
import { MenuService } from 'src/app/services/seguridad/menu.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-opciones-menu',
  templateUrl: './opciones-menu.component.html',
  styleUrls: ['./opciones-menu.component.css']
})
export class OpcionesMenuComponent {

  opcionesMenuForm: FormGroup;
  opcionesMenus: any = [];
  opcionesMenu: any;
  menus: any = [];

  constructor(
    private alert: AlertService,
    private opcionesMenuService: OpcionesMenuService,
    private menuService: MenuService
  ){
    this.opcionesMenuForm = new FormGroup({
      idMenu: new FormControl(null, [Validators.required]),
      nombreOpcion: new FormControl(null, [Validators.required]),
    });
  }

  async ngOnInit() {
    //
    await this.getOpcionesMenus();
    await this.getMenus();
  }

  async getMenus(){
    this.opcionesMenuForm.controls['idMenu'].setValue(1);
    let menus = await this.menuService.getMenus();
    if (menus) {
      this.menus = menus.data;
    }
  }

  // CRUD opciones menu
  async getOpcionesMenus() {
    this.opcionesMenuForm.controls['idDepartamento'].setValue(1);
    let opcionesMenus = await this.opcionesMenuService.getOpcionesMenus();
    if (opcionesMenus) {
      this.opcionesMenus = opcionesMenus.data;
    }
  }


  async postOpcionesMenu() {
    let opcionesMenu = await this.opcionesMenuService.postOpcionesMenu(this.opcionesMenuForm.value);
    if (opcionesMenu.resultado) {
      this.getOpcionesMenus();
      this.alert.alertMax('Transaccion Correcta', opcionesMenu.mensaje, 'success');
      this.opcionesMenuForm.reset();
    }
  }

  async putOpcionesMenu() {
    let opcionesMenu = await this.opcionesMenuService.putOpcionesMenu(this.opcionesMenu.id, this.opcionesMenuForm.value);
    if (opcionesMenu.resultado) {
      this.getMenus();
      this.getOpcionesMenus();
      this.alert.alertMax('Transaccion Correcta', opcionesMenu.mensaje, 'success');
      this.opcionesMenuForm.reset();
      this.opcionesMenu = null;
    }
  }

  async deleteOpcionesMenu(i: any, index: number) {
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
        let opcionesMenu = await this.opcionesMenuService.deleteOpcionesMenu(i.id);
        if (opcionesMenu.resultado) {
          this.opcionesMenus.splice(index, 1);
          this.alert.alertMax('Correcto', opcionesMenu.mensaje, 'success');
          this.opcionesMenu = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setOpcionesMenu(i: any, index: number) {
    i.index = index;
    this.opcionesMenu = i;
    this.opcionesMenuForm.controls['idMenu'].setValue(i.idMenu);
    this.opcionesMenuForm.controls['nombreOpcion'].setValue(i.nombreOpcion);
  }

  cancelarEdicion() {
    this.opcionesMenuForm.reset();
    this.opcionesMenu = null;
  }

  changeMenu(e: any){
    console.log(e.target.value)
  }



}
