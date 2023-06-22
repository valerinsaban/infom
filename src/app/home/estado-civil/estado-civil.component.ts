import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { EstadoCivilService } from 'src/app/services/catalogos/estado-civil.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estado-civil',
  templateUrl: './estado-civil.component.html',
  styleUrls: ['./estado-civil.component.css']
})
export class EstadoCivilComponent {

  estadoCivilForm: FormGroup;
  estadosCiviles: any = [];
  estadoCivil: any;

  constructor(
    private alert: AlertService,
    private estadoCivilService: EstadoCivilService
  ) {
    this.estadoCivilForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getEstadosCiviles();
  }

  // CRUD departamentos
  async getEstadosCiviles() {
    let departamentos = await this.estadoCivilService.getEstadosCiviles();
    if (departamentos) {
      this.estadosCiviles = departamentos.data;
    }
  }

  async postEstadoCivil() {
    let estadoCivil = await this.estadoCivilService.postEstadoCivil(this.estadoCivilForm.value);
    if (estadoCivil.resultado) {
      this.getEstadosCiviles();
      this.alert.alertMax('Transaccion Correcta', estadoCivil.mensaje, 'success');
      this.estadoCivilForm.reset();
    }
  }

  async putEstadoCivil() {
    let departamento = await this.estadoCivilService.putEstadoCivil(this.estadoCivil.id, this.estadoCivilForm.value);
    if (departamento.resultado) {
      this.getEstadosCiviles();
      this.alert.alertMax('Transaccion Correcta', departamento.mensaje, 'success');
      this.estadoCivilForm.reset();
      this.estadoCivil = null;
    }
  }

  async deleteEstadoCivil(i: any, index: number) {
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
        let estadoCivil = await this.estadoCivilService.deleteEstadoCivil(i.id);
        if (estadoCivil.resultado) {
          this.estadoCivil.splice(index, 1);
          this.alert.alertMax('Correcto', estadoCivil.mensaje, 'success');
          this.estadoCivil = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setEstadoCivil(i: any, index: number) {
    i.index = index;
    this.estadoCivil = i;
    this.estadoCivilForm.controls['codigo'].setValue(i.codigo);
    this.estadoCivil.controls['descripcion'].setValue(i.descripcion);
  }

  cancelarEdicion() {
    this.estadoCivilForm.reset();
    this.estadoCivil = null;
  }

}
