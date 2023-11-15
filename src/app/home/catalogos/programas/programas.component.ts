import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { ProgramasService } from 'src/app/services/catalogos/programas.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';
import { ProgramasGarantiasService } from 'src/app/services/catalogos/clases-prestamos-garantias.service';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.css']
})
export class ProgramasComponent {

  programaForm: FormGroup;
  programa_garantiaForm: FormGroup;
  programas: any = [];
  programas_garantias: any = [];
  garantias: any = [];
  programa: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private programaService: ProgramasService,
    private programas_garantiasService: ProgramasGarantiasService,
    private garantiasService: GarantiasService
  ) {
    this.programaForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      siglas: new FormControl(null, [Validators.required])
    });
    this.programa_garantiaForm = new FormGroup({
      id_garantia: new FormControl(null, [Validators.required]),
      id_programa: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getProgramas();
    await this.getGarantias();
    this.ngxService.stop();
  }

  // CRUD programas
  async getProgramas() {
    let programas = await this.programaService.getProgramas();
    if (programas) {
      this.programas = programas;
    }
  }

  async getGarantias() {
    let garantias = await this.garantiasService.getGarantias();
    if (garantias) {
      this.garantias = garantias;
    }
  }

  async getProgramasGarantias() {
    let programas_garantias = await this.programas_garantiasService.getProgramasGarantias(this.programa.id);
    if (programas_garantias) {
      this.programas_garantias = programas_garantias;
    }
  }

  async postPrograma() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let programa = await this.programaService.postPrograma(this.programaForm.value);
    if (programa.resultado) {
      await this.getProgramas();
      this.alert.alertMax('Operacion Correcta', programa.mensaje, 'success');
      this.programaForm.reset();
    }
    this.ngxService.stop();
  }

  async putPrograma() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let programa = await this.programaService.putPrograma(this.programa.id, this.programaForm.value);
    if (programa.resultado) {
      await this.getProgramas();
      this.alert.alertMax('Operacion Correcta', programa.mensaje, 'success');
      this.programaForm.reset();
      this.programa = null;
    }
    this.ngxService.stop();
  }

  async deletePrograma(i: any, index: number) {
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
        let programa = await this.programaService.deletePrograma(i.id);
        if (programa.resultado) {
          this.programas.splice(index, 1);
          this.alert.alertMax('Correcto', programa.mensaje, 'success');
          this.programa = null;
        }
        this.ngxService.stop();
      }
    })
  }

  async postProgramaGarantia() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let programa_garantia = await this.programas_garantiasService.postProgramaGarantia(this.programa_garantiaForm.value);
    if (programa_garantia.resultado) {
      await this.getProgramasGarantias();
      this.alert.alertMax('Operacion Correcta', programa_garantia.mensaje, 'success');
      this.programa_garantiaForm.controls['id_garantia'].setValue(null);
    }
    this.ngxService.stop();
  }


  async deleteProgramaGarantia(i: any, index: number) {
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
        let programa = await this.programas_garantiasService.deleteProgramaGarantia(i.id);
        if (programa.resultado) {
          this.getProgramasGarantias();
          this.alert.alertMax('Correcto', programa.mensaje, 'success');
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  async setPrograma(i: any, index: number) {
    this.ngxService.start();
    i.index = index;
    this.programa = i;
    this.programaForm.controls['codigo'].setValue(i.codigo);
    this.programaForm.controls['nombre'].setValue(i.nombre);
    this.programaForm.controls['siglas'].setValue(i.siglas);

    this.programa_garantiaForm.controls['id_programa'].setValue(i.id);

    await this.getProgramasGarantias();

    this.ngxService.stop();
  }

  cancelarEdicion() {
    this.programaForm.reset();
    this.programa = null;
  }

}
