import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { AportesService } from 'src/app/services/aportes.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import readXlsxFile from 'read-excel-file';

@Component({
  selector: 'app-aportes',
  templateUrl: './aportes.component.html',
  styleUrls: ['./aportes.component.css']
})
export class AportesComponent {

  aporteForm: FormGroup;
  aportes: any = [];
  aporte: any;

  aportes_temp: any = [];

  municipalidades: any = [];

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private municipalidadesService: MunicipalidadesService,
    private aportesService: AportesService) {
    this.aporteForm = new FormGroup({
      anio: new FormControl(null, [Validators.required]),
      mes: new FormControl(null, [Validators.required]),
      constitucional: new FormControl(null, [Validators.required]),
      iva_paz: new FormControl(null, [Validators.required]),
      vehiculos: new FormControl(null, [Validators.required]),
      petroleo: new FormControl(null, [Validators.required]),
      total: new FormControl(null, [Validators.required]),
      id_municipalidad: new FormControl(null, [Validators.required]),
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getAportes();
    await this.getMunicipalidades();
    this.ngxService.stop();
  }

  // CRUD aportes
  async getAportes() {
    let aportes = await this.aportesService.getAportes();
    if (aportes) {
      this.aportes = aportes;
      this.aportes.shift();
    }
  }

  async getMunicipalidades() {
    let municipalidades = await this.municipalidadesService.getMunicipalidades();
    if (municipalidades) {
      this.municipalidades = municipalidades;
    }
  }

  uploadExcel() {
    this.aportes_temp = [];

    let file: any = $('#importe').prop('files');
    let _this = this;
    readXlsxFile(file[0]).then(async function (rows: any) {
      _this.ngxService.start();
      for (let i = 1; i < rows.length; i++) {
        let codigo = parseFloat(rows[i][0]);
        if (codigo > 0) {
          let c = codigo.toString().split("");
          
          let muni;

          if (c.length == 3) {
            muni = await _this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(`0${c[0]}`, `${c[1]}${c[2]}`);
          }
          if (c.length == 4) {
            muni = await _this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(`${c[0]}${c[1]}`, `${c[2]}${c[3]}`);
          }
          
          _this.aportes_temp.push({
            municipalidad: muni ? `${muni.departamento.nombre} / ${muni.municipio.nombre}` : `-------`,
            anio: "2023",
            mes: '01',
            constitucional: rows[i][2],
            iva_paz: rows[i][4],
            vehiculos: rows[i][6],
            petroleo: rows[i][8],
            total: rows[i][10],
            id_municipalidad: muni ? `${muni.id}` : null,
          });
        }
      }

      _this.ngxService.stop();
    });
  }

  async postAporte() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let aporte = await this.aportesService.postAporte(this.aporteForm.value);
    if (aporte.resultado) {
      this.getAportes();
      this.alert.alertMax('Transaccion Correcta', aporte.mensaje, 'success');
      this.aporteForm.reset();
    }
    this.ngxService.stop();
  }

  async putAporte() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let aporte = await this.aportesService.putAporte(this.aporte.id, this.aporteForm.value);
    if (aporte.resultado) {
      this.getAportes();
      this.alert.alertMax('Transaccion Correcta', aporte.mensaje, 'success');
      this.aporteForm.reset();
      this.aporte = null;
    }
    this.ngxService.stop();
  }

  async deleteAporte(i: any, index: number) {
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
        let aporte = await this.aportesService.deleteAporte(i.id);
        if (aporte.resultado) {
          this.aporte.splice(index, 1);
          this.alert.alertMax('Correcto', aporte.mensaje, 'success');
          this.aporte = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setAporte(i: any, index: number) {
    i.index = index;
    this.aporte = i;
    this.aporteForm.controls['anio'].setValue(i.anio);
    this.aporteForm.controls['mes'].setValue(i.mes);
    this.aporteForm.controls['constitucional'].setValue(i.constitucional);
    this.aporteForm.controls['iva_paz'].setValue(i.iva_paz);
    this.aporteForm.controls['vehiculos'].setValue(i.vehiculos);
    this.aporteForm.controls['petroleo'].setValue(i.petroleo);
    this.aporteForm.controls['total'].setValue(i.total);
    this.aporteForm.controls['id_municipalidad'].setValue(i.id_municipalidad);
  }

  limpiar() {
    this.aporteForm.reset();
    this.aporte = null;
  }

}
