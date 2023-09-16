import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DepartamentosService } from 'src/app/services/catalogos/departamentos.service';
import { MunicipiosService } from 'src/app/services/catalogos/municipios.service';
import { MunicipalidadesService } from 'src/app/services/municipalidades.service';
import { PermisosService } from 'src/app/services/seguridad/permisos.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { BancosService } from 'src/app/services/catalogos/bancos.service';
import { AportesService } from 'src/app/services/aportes.service';
import { GarantiasService } from 'src/app/services/catalogos/garantias.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { PrestamosGarantiasService } from 'src/app/services/prestamos_garantias.service';

@Component({
  selector: 'app-municipalidades',
  templateUrl: './municipalidades.component.html',
  styleUrls: ['./municipalidades.component.css']
})
export class MunicipalidadesComponent {

  municipalidadForm: FormGroup;
  municipalidades: any = [];
  municipalidad: any;

  departamentos: any = [];
  municipios: any = [];
  bancos: any = [];

  departamento: any;
  municipio: any;
  plazo_meses: any;

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
    private bancosService: BancosService,
    private aportesService: AportesService,
    private garantiasService: GarantiasService,
    private prestamosService: PrestamosService,
    private prestamos_garantiasService: PrestamosGarantiasService
  ) {
    this.municipalidadForm = new FormGroup({
      direccion: new FormControl(null),
      correo: new FormControl(null),
      telefono: new FormControl(null),
      no_cuenta: new FormControl(null),
      id_departamento: new FormControl(null, [Validators.required]),
      id_municipio: new FormControl(null, [Validators.required]),
      id_banco: new FormControl(null, [Validators.required])
    });
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getDepartamentos();
    await this.getBancos();
    this.ngxService.stop();
  }

  async getMunicipalidades() {
    this.ngxService.start();
    this.municipalidades = [];
    if (this.filtros.codigo_departamento && this.filtros.codigo_municipio) {
      let municipalidades = await this.municipalidadesService.getMunicipalidadDepartamentoMunicipio(this.filtros.codigo_departamento, this.filtros.codigo_municipio);
      if (municipalidades) {
        this.municipalidades.push(municipalidades);
      } 
    }
    if (this.filtros.codigo_departamento && !this.filtros.codigo_municipio) {
      let municipalidades = await this.municipalidadesService.getMunicipalidadDepartamento(this.filtros.codigo_departamento);
      if (municipalidades) {
        this.municipalidades = municipalidades;
      } 
    }
    this.ngxService.stop();
  }

  async getDepartamentos() {
    let departamentos = await this.departamentosService.getDepartamentos();
    if (departamentos) {
      this.departamentos = departamentos;
    }
  }

  async getMunicipios() {
    let municipios = await this.municipiosService.getMunicipioByDepartamento(this.municipalidadForm.controls['id_departamento'].value);
    if (municipios) {
      this.municipios = municipios;
    }
  }

  async getBancos() {
    let bancos = await this.bancosService.getBancos();
    if (bancos) {
      this.bancos = bancos;
    }
  }

  async changeDepartamento() {
    await this.getMunicipios();
  }

  async postMunicipalidad() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let municipalidad = await this.municipalidadesService.postMunicipalidad(this.municipalidadForm.value);
    if (municipalidad.resultado) {
      await this.getMunicipalidades();
      this.alert.alertMax('Transaccion Correcta', municipalidad.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putMunicipalidad() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Transaccion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let municipalidad = await this.municipalidadesService.putMunicipalidad(this.municipalidad.id, this.municipalidadForm.value);
    if (municipalidad.resultado) {
      await this.getMunicipalidades();
      this.alert.alertMax('Transaccion Correcta', municipalidad.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async deleteMunicipalidad(i: any, index: number) {
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
        let municipalidad = await this.municipalidadesService.deleteMunicipalidad(i.id);
        if (municipalidad.resultado) {
          this.municipalidades.splice(index, 1);
          this.alert.alertMax('Correcto', municipalidad.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  // Metodos para obtener data y id de registro seleccionado
  setMunicipalidad(i: any, index: number) {
    i.index = index;
    this.municipalidad = i;
    this.municipalidadForm.controls['direccion'].setValue(i.direccion);
    this.municipalidadForm.controls['correo'].setValue(i.correo);
    this.municipalidadForm.controls['telefono'].setValue(i.telefono);
    this.municipalidadForm.controls['no_cuenta'].setValue(i.no_cuenta);
    this.municipalidadForm.controls['id_departamento'].setValue(i.id_departamento);
    this.municipalidadForm.controls['id_municipio'].setValue(i.id_municipio);
    this.municipalidadForm.controls['id_banco'].setValue(i.id_banco);
  }

  async getDisponibilidad() {
    let aporte = await this.aportesService.getAportesDepartamentoMunicipio(this.municipalidad.departamento.codigo, this.municipalidad.municipio.codigo)

    let garantias = await this.garantiasService.getGarantias();
    let prestamos = await this.prestamosService.getPrestamosEstadoMunicipalidad('Acreditado', this.municipalidad.id);
    
    
    for (let i = 0; i < prestamos.length; i++) {
      let prestamos_garantias = await this.prestamos_garantiasService.getPrestamoGarantiaPrestamo(prestamos[i].id);
      prestamos[i].prestamos_garantias = prestamos_garantias
    }

    console.log(aporte);
    console.log(garantias);
    console.log(prestamos);
    
    
    
    // for (let g = 0; g < this.garantias.length; g++) {
    //   this.garantias[g].prestamos = [];

    //   let prestamos = await this.prestamosService.getPrestamosEstadoMunicipalidad(this.municipalidad.id);
    //   for (let p = 0; p < prestamos.length; p++) {
    //     if (prestamos[p].estado != 'Completado' && prestamos[p].estado != 'Rechazado') {
    //       this.garantias[g].prestamos.push(prestamos[p]);   
    //     }
    //   }      
    // }
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
    this.municipalidadForm.reset();
    this.municipalidad = null;
  }

}
