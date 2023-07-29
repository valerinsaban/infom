import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { EscolaridadesService } from 'src/app/services/catalogos/escolaridades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-escolaridades',
  templateUrl: './escolaridades.component.html',
  styleUrls: ['./escolaridades.component.css']
})
export class EscolaridadesComponent {

  escolaridadForm: FormGroup;
  escolaridades: any = [];
  escolaridad: any;

  constructor(
    private alert: AlertService,
    private escolaridadesService: EscolaridadesService
  ){
    this.escolaridadForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    })
  }

  async ngOnInit() {
    await this.getEscolaridades();
  }

  async getEscolaridades(){
    let escoladidades = await this.escolaridadesService.getEscolaridades();
    if(escoladidades){
      this.escolaridades = escoladidades
    }
  }

  async postEscolaridades() {
    let escolaridad = await this.escolaridadesService.postEscolaridades(this.escolaridadForm.value);
    if (escolaridad.resultado) {
      this.getEscolaridades();
      this.alert.alertMax('Transaccion Correcta', escolaridad.mensaje, 'success');
      this.escolaridadForm.reset();
    }
  }

  async putEscolaridades() {
    let escolaridad = await this.escolaridadesService.putEscolaridades(this.escolaridad.id, this.escolaridadForm.value);
    if (escolaridad.resultado) {
      this.getEscolaridades();
      this.alert.alertMax('Transaccion Correcta', escolaridad.mensaje, 'success');
      this.escolaridadForm.reset();
      this.escolaridad = null;
    }
  }

  async deleteEscolaridad(i: any, index: number) {
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
        let escolaridades = await this.escolaridadesService.deleteEscolaridades(i.id);
        if (escolaridades.resultado) {
          this.escolaridad.splice(index, 1);
          this.alert.alertMax('Correcto', escolaridades.mensaje, 'success');
          this.escolaridad = null;
        }
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setEscolaridad(i: any, index: number) {
    i.index = index;
    this.escolaridad = i;
    this.escolaridadForm.controls['codigo'].setValue(i.codigo);
    this.escolaridadForm.controls['descripcion'].setValue(i.descripcion);
  }

  cancelarEdicion() {
    this.escolaridadForm.reset();
    this.escolaridad = null;
  }

}
