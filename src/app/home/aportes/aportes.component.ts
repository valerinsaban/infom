import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { AportesService } from 'src/app/services/aportes.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import readXlsxFile from 'read-excel-file';
import * as moment from 'moment';
import { ImportesService } from 'src/app/services/importes.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';

@Component({
  selector: 'app-aportes',
  templateUrl: './aportes.component.html',
  styleUrls: ['./aportes.component.css']
})
export class AportesComponent {

  aporteForm: FormGroup;
  importeForm: FormGroup;
  aportes: any = [];
  aporte: any;
  importes: any = [];
  importe: any;
  importados: any = 0;
  porcentaje: any = 0;

  constitucional: any = 0;
  iva_paz: any = 0;
  vehiculos: any = 0;
  petroleo: any = 0;
  total: any = 0;

  aportes_temp: any = [];

  departamentos: any = [];
  municipios: any = [];
  municipalidades: any = [];

  filtros: any = {
    mes_inicio: moment().startOf('year').format('YYYY-MM'),
    mes_fin: moment().endOf('year').format('YYYY-MM'),
    codigo_departamento: '',
    codigo_municipio: ''
  }

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private municipalidadesService: MunicipalidadesService,
    private departamentosService: DepartamentosService,
    private municipiosService: MunicipiosService,
    private aportesService: AportesService,
    private importesService: ImportesService
  ) {
    this.aporteForm = new FormGroup({
      mes: new FormControl(null, [Validators.required]),
      constitucional: new FormControl(null, [Validators.required]),
      iva_paz: new FormControl(null, [Validators.required]),
      vehiculos: new FormControl(null, [Validators.required]),
      petroleo: new FormControl(null, [Validators.required]),
      total: new FormControl(null, [Validators.required]),
      codigo_departamento: new FormControl(null, [Validators.required]),
      codigo_municipio: new FormControl(null, [Validators.required]),
      id_municipalidad: new FormControl(null, [Validators.required]),
    });
    this.importeForm = new FormGroup({
      mes: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null),
      observaciones: new FormControl(null),
      constitucional: new FormControl(null, [Validators.required]),
      iva_paz: new FormControl(null, [Validators.required]),
      vehiculos: new FormControl(null, [Validators.required]),
      petroleo: new FormControl(null, [Validators.required]),
      total: new FormControl(null, [Validators.required]),
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    this.getDepartamentos();
    await this.getImportes();
    this.ngxService.stop();
  }

  // CRUD aportes
  async getAportes() {
    this.ngxService.start();
    let aportes = await this.aportesService.getAportesMesDepartamentoMunicipio(this.filtros.mes_inicio, this.filtros.mes_fin, this.filtros.codigo_departamento, this.filtros.codigo_municipio);
    if (aportes) {
      this.aportes = aportes;

      this.constitucional = 0;
      this.iva_paz = 0;
      this.vehiculos = 0;
      this.petroleo = 0;
      this.total = 0;
      for (let a = 0; a < this.aportes.length; a++) {
        this.constitucional += parseFloat(this.aportes[a].constitucional);
        this.iva_paz += parseFloat(this.aportes[a].iva_paz);
        this.vehiculos += parseFloat(this.aportes[a].vehiculos);
        this.petroleo += parseFloat(this.aportes[a].petroleo);
        this.total += parseFloat(this.aportes[a].total);
      }
    }
    this.ngxService.stop();
  }

  async getImportes() {
    let importes = await this.importesService.getImportes();
    if (importes) {
      this.importes = importes;
    }
  }

  async getMunicipalidades() {
    let municipalidades = await this.municipalidadesService.getMunicipalidades();
    if (municipalidades) {
      this.municipalidades = municipalidades;
    }
  }

  async getDepartamentos() {
    let departamentos = await this.departamentosService.getDepartamentos();
    if (departamentos) {
      this.departamentos = departamentos;
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
          let codigo_departamento;
          let codigo_municipio;

          if (c.length == 3) {
            codigo_departamento = `0${c[0]}`;
            codigo_municipio = `${c[1]}${c[2]}`;
            // muni = await _this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(codigo_departamento, codigo_municipio);
          }
          if (c.length == 4) {
            codigo_departamento = `${c[0]}${c[1]}`;
            codigo_municipio = `${c[2]}${c[3]}`;
            // muni = await _this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(`${c[0]}${c[1]}`, `${c[2]}${c[3]}`);
          }

          if (codigo_municipio != '00') {
            _this.aportes_temp.push({
              // departamento: muni ? muni.departamento : null,
              // municipio: muni ? muni.municipio : null,
              municipio: `${codigo_departamento}${codigo_municipio} - ${rows[i][1]}`,
              constitucional: rows[i][2],
              iva_paz: rows[i][4],
              vehiculos: rows[i][6],
              petroleo: rows[i][8],
              total: rows[i][10],
              codigoDepartamento: codigo_departamento,
              codigoMunicipio: codigo_municipio,
              // id_municipalidad: muni ? `${muni.id}` : null,
            });
          }
        }
      }

      _this.constitucional = 0;
      _this.iva_paz = 0;
      _this.vehiculos = 0;
      _this.petroleo = 0;
      _this.total = 0;

      for (let a = 0; a < _this.aportes_temp.length; a++) {
        _this.constitucional += parseFloat(_this.aportes_temp[a].constitucional);
        _this.iva_paz += parseFloat(_this.aportes_temp[a].iva_paz);
        _this.vehiculos += parseFloat(_this.aportes_temp[a].vehiculos);
        _this.petroleo += parseFloat(_this.aportes_temp[a].petroleo);
        _this.total += parseFloat(_this.aportes_temp[a].total);
      }
      _this.importeForm.controls['constitucional'].setValue(_this.constitucional);
      _this.importeForm.controls['iva_paz'].setValue(_this.iva_paz);
      _this.importeForm.controls['vehiculos'].setValue(_this.vehiculos);
      _this.importeForm.controls['petroleo'].setValue(_this.petroleo);
      _this.importeForm.controls['total'].setValue(_this.total);

      _this.ngxService.stop();
    });
  }

  async importar() {
    Swal.fire({
      title: '¿Estas seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Importar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.startBackground();

        this.importeForm.controls['fecha'].setValue(moment().format('YYYY-MM-DD'));

        let importe = await this.importesService.postImporte(this.importeForm.value);
        if (importe.resultado) {
          for (let a = 0; a < this.aportes_temp.length; a++) {
            delete this.aportes_temp[a].municipalidad;
            this.aportes_temp[a].mes = this.importeForm.controls['mes'].value;
            this.aportes_temp[a].id_importe = importe.data.id;
            let aporte = await this.aportesService.postAporte(this.aportes_temp[a]);
            if (aporte.resultado) {
              this.importados++;
              this.porcentaje = this.importados * 100 / this.aportes_temp.length;
            }
          }
          await this.getImportes();
        }
        this.constitucional = 0;
        this.iva_paz = 0;
        this.vehiculos = 0;
        this.petroleo = 0;
        this.total = 0;
        this.porcentaje = 0;
        this.importados = 0;
        this.aportes_temp = [];
        this.alert.alertMax('Transaccion Correcta', 'Importe completado', 'success');
        this.ngxService.stopBackground();
      }
    })
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
          this.aportes.splice(index, 1);
          this.alert.alertMax('Correcto', aporte.mensaje, 'success');
          this.aporte = null;
        }
        this.ngxService.stop();
      }
    })
  }

  async deleteImporte(i: any, index: number) {
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
        let importe = await this.importesService.deleteImporte(i.id);
        if (importe.resultado) {
          this.importes.splice(index, 1);
          this.alert.alertMax('Correcto', importe.mensaje, 'success');
          this.importe = null;
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setAporte(i: any, index: number) {
    i.index = index;
    this.aporte = i;
    this.aporteForm.controls['mes'].setValue(i.mes);
    this.aporteForm.controls['constitucional'].setValue(i.constitucional);
    this.aporteForm.controls['iva_paz'].setValue(i.iva_paz);
    this.aporteForm.controls['vehiculos'].setValue(i.vehiculos);
    this.aporteForm.controls['petroleo'].setValue(i.petroleo);
    this.aporteForm.controls['total'].setValue(i.total);
    this.aporteForm.controls['codigo_departamento'].setValue(i.codigo_departamento);
    this.aporteForm.controls['codigo_municipio'].setValue(i.codigo_municipio);
    this.aporteForm.controls['id_municipalidad'].setValue(i.id_municipalidad);
  }

  async setDepartamento(event: any) {
    for (let d = 0; d < this.departamentos.length; d++) {
      if (event.target.value == this.departamentos[d].id) {
        this.filtros.codigo_departamento = this.departamentos[d].codigo;
        this.filtros.codigo_municipio = '';
      }
    }
    let municipios = await this.municipiosService.getMunicipioByDepartamento(event.target.value);
    if (municipios) {
      this.municipios = municipios;
    }
  }

  async setMunicipio(event: any) {
    for (let m = 0; m < this.municipios.length; m++) {
      if (event.target.value == this.municipios[m].id) {
        this.filtros.codigo_municipio = this.municipios[m].codigo;
      }
    }
  }

  limpiar() {
    this.aporteForm.reset();
    this.aporte = null;
  }

}
