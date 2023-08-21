import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../../home.component';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent {

  departamentoForm: FormGroup;
  departamentos: any = [];
  departamento: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private reportesService: ReportesService,
    private departamentosService: DepartamentosService
  ) {
    this.departamentoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDepartamentos();
    this.ngxService.stop();
  }

  // CRUD departamentos
  async getDepartamentos() {
    let departamentos = await this.departamentosService.getDepartamentos();
    if (departamentos) {
      this.departamentos = departamentos;
    }
  }

  async postDepartamento() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let departamento = await this.departamentosService.postDepartamento(this.departamentoForm.value);
    if (departamento.resultado) {
      await this.getDepartamentos();
      this.alert.alertMax('Transaccion Correcta', departamento.mensaje, 'success');
      this.cancelarEdicion();
    }
    this.ngxService.stop();
  }

  async putDepartamento() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let departamento = await this.departamentosService.putDepartamento(this.departamento.id, this.departamentoForm.value);
    if (departamento.resultado) {
      await this.getDepartamentos();
      this.alert.alertMax('Transaccion Correcta', departamento.mensaje, 'success');
      this.cancelarEdicion();
    }
    this.ngxService.stop();
  }

  async deleteDepartamento(i: any, index: number) {
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
        let departamento = await this.departamentosService.deleteDepartamento(i.id);
        if (departamento.resultado) {
          this.departamentos.splice(index, 1);
          this.alert.alertMax('Correcto', departamento.mensaje, 'success');
          this.cancelarEdicion();
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setDepartamento(i: any, index: number) {
    i.index = index;
    this.departamento = i;
    this.departamentoForm.controls['codigo'].setValue(i.codigo);
    this.departamentoForm.controls['nombre'].setValue(i.nombre);
  }

  async reporte(format: string) {
    this.ngxService.start();
    // let departamento = await this.reportesService.getReporteDepartamentos('PDF');
    window.open(HomeComponent.apiUrl + '/reportes/departamentos/' + format, "_blank");
    this.ngxService.stop();
  }

  cancelarEdicion() {
    this.departamentoForm.reset();
    this.departamento = null;
  }

}
