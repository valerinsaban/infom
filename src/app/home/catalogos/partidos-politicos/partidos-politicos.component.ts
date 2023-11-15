import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { PartidosPoliticosService } from 'src/app/services/catalogos/partidos-politicos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-partidos-politicos',
  templateUrl: './partidos-politicos.component.html',
  styleUrls: ['./partidos-politicos.component.css']
})
export class PartidosPoliticosComponent {

  partidoPoliticoForm: FormGroup;
  partidosPoliticos: any = [];
  partidoPolitico: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private partidoPoliticoService: PartidosPoliticosService
  ) {
    this.partidoPoliticoForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getPartidosPoliticos();
    this.ngxService.stop();
  }

  // CRUD estado civil
  async getPartidosPoliticos() {
    let partidoPolitico = await this.partidoPoliticoService.getPartidosPoliticos();
    if (partidoPolitico) {
      this.partidosPoliticos = partidoPolitico;
    }
  }

  async postPartidoPolitico() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let partidoPolitico = await this.partidoPoliticoService.postPartidoPolitico(this.partidoPoliticoForm.value);
    if (partidoPolitico.resultado) {
      await this.getPartidosPoliticos();
      this.alert.alertMax('Operacion Correcta', partidoPolitico.mensaje, 'success');
      this.partidoPoliticoForm.reset();
    }
    this.ngxService.stop();
  }

  async putPartidoPolitico() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let partidoPolitico = await this.partidoPoliticoService.putPartidoPolitico(this.partidoPolitico.id, this.partidoPoliticoForm.value);
    if (partidoPolitico.resultado) {
      await this.getPartidosPoliticos();
      this.alert.alertMax('Operacion Correcta', partidoPolitico.mensaje, 'success');
      this.partidoPoliticoForm.reset();
      this.partidoPolitico = null;
    }
    this.ngxService.stop();
  }

  async deletePartidoPolitico(i: any, index: number) {
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
        let partidoPolitico = await this.partidoPoliticoService.deletePartidoPolitico(i.id);
        if (partidoPolitico.resultado) {
          this.partidosPoliticos.splice(index, 1);
          this.alert.alertMax('Correcto', partidoPolitico.mensaje, 'success');
          this.partidoPolitico = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setPartidoPolitico(i: any, index: number) {
    i.index = index;
    this.partidoPolitico = i;
    this.partidoPoliticoForm.controls['nombre'].setValue(i.nombre);
  }

  cancelarEdicion() {
    this.partidoPoliticoForm.reset();
    this.partidoPolitico = null;
  }

}
