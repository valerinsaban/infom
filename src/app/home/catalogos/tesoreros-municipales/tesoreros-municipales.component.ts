import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { TesorerosMunicipalesService } from 'src/app/services/catalogos/tesoreros-municipales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tesoreros-municipales',
  templateUrl: './tesoreros-municipales.component.html',
  styleUrls: ['./tesoreros-municipales.component.css']
})
export class TesorerosMunicipalesComponent {

  tesorerosMunicipalForm: FormGroup;
  tesorerosMunicipales: any = [];
  tesoreroMunicipal: any;


  constructor(
    private alert: AlertService,
    private tesorerosMunicipalesService: TesorerosMunicipalesService
  ) {
    this.tesorerosMunicipalForm = new FormGroup({
      codigo: new FormControl(null, [Validators.required]),
      descripcion: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    await this.getTesorerosMunicipales();
  }

    // CRUD Tesorero municipal
    async getTesorerosMunicipales() {
      let tesorerosMunicipales = await this.tesorerosMunicipalesService.getTesorerosMunicipales();
      if (tesorerosMunicipales) {
        this.tesorerosMunicipales = tesorerosMunicipales.data;
      }
    }

    async postTesoreroMunicipal() {
      let tesorerosMunicipal = await this.tesorerosMunicipalesService.postTesoreroMunicipal(this.tesorerosMunicipalForm.value);
      if (tesorerosMunicipal.resultado) {
        this.getTesorerosMunicipales();
        this.alert.alertMax('Transaccion Correcta', tesorerosMunicipal.mensaje, 'success');
        this.tesorerosMunicipalForm.reset();
      }
    }

    async putTesoreroMunicipal() {
      let tesoreroMunicipal = await this.tesorerosMunicipalesService.putTesoreroMunicipal(this.tesoreroMunicipal.id, this.tesorerosMunicipalForm.value);
      if (tesoreroMunicipal.resultado) {
        this.getTesorerosMunicipales();
        this.alert.alertMax('Transaccion Correcta', tesoreroMunicipal.mensaje, 'success');
        this.tesorerosMunicipalForm.reset();
        this.tesoreroMunicipal = null;
      }
    }

    async deleteTesoreroMunicipal(i: any, index: number) {
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
          let departamento = await this.tesorerosMunicipalesService.deleteTesoreroMunicipal(i.id);
          if (departamento.resultado) {
            this.tesorerosMunicipales.splice(index, 1);
            this.alert.alertMax('Correcto', departamento.mensaje, 'success');
            this.tesoreroMunicipal = null;
          }
        }
      })
    }

    // Metodos para obtener data y id de registro seleccionado
    setTesoreroMunicipal(i: any, index: number) {
      i.index = index;
      this.tesoreroMunicipal = i;
      this.tesorerosMunicipales.controls['codigo'].setValue(i.codigo);
      this.tesorerosMunicipales.controls['descripcion'].setValue(i.descripcion);
    }

    cancelarEdicion() {
      this.tesorerosMunicipales.reset();
      this.tesoreroMunicipal = null;
    }




}
