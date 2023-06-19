import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import Swal from 'sweetalert2';

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
    private departamentosService: DepartamentosService
  ) {
    this.departamentoForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getDepartamentos();
  }

  // CRUD departamentos
  async getDepartamentos() {
    let departamentos = await this.departamentosService.getDepartamentos();
    if (departamentos) {
      this.departamentos = departamentos.data;
    }
  }

  async postDepartamento() {
    let departamento = await this.departamentosService.postDepartamento(this.departamentoForm.value);
    if (departamento.resultado) {
      this.getDepartamentos();
      this.alert.alertMax('Transaccion Correcta', departamento.mensaje, 'success');
      this.departamentoForm.reset();
    }
  }

  async putDepartamento() {
    let departamento = await this.departamentosService.putDepartamento(this.departamento.id, this.departamentoForm.value);
    if (departamento.resultado) {
      this.getDepartamentos();
      this.alert.alertMax('Transaccion Correcta', departamento.mensaje, 'success');
      this.departamentoForm.reset();
      this.departamento = null;
    }
  }

  async deleteDepartamento(i: any, index: number) {
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
        let departamento = await this.departamentosService.deleteDepartamento(i.id);
        if (departamento.resultado) {
          this.departamentos.splice(index, 1);
          this.alert.alertMax('Correcto', departamento.mensaje, 'success');
          this.departamento = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setDepartamento(i: any, index: number) {
    i.index = index;
    this.departamento = i;
    this.departamentoForm.controls['codigo'].setValue(i.codigo);
    this.departamentoForm.controls['descripcion'].setValue(i.descripcion);
  }

  cancelarEdicion() {
    this.departamentoForm.reset();
    this.departamento = null;
  }

}
