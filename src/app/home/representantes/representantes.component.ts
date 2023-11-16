import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from 'src/app/app.component';
import { AlertService } from 'src/app/services/alert.service';
import { EstadosCivilesService } from 'src/app/services/catalogos/estados-civiles.service';
import { ProfesionesService } from 'src/app/services/catalogos/profesiones.service';
import { PuestosService } from 'src/app/services/catalogos/puestos.service';
import { RepresentantesService } from 'src/app/services/representantes.service';
import { RegionalesService } from 'src/app/services/catalogos/regionales.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-representantes',
  templateUrl: './representantes.component.html',
  styleUrls: ['./representantes.component.css']
})
export class RepresentantesComponent {

  representanteForm: FormGroup;
  representantes: any = [];
  representante: any;

  file: any;

  regionales: any = [];
  puestos: any = [];
  profesiones: any = [];
  estados_civiles: any = [];

  regional: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private representantesService: RepresentantesService,
    private regionalesService: RegionalesService,
    private puestosService: PuestosService,
    private profesionesService: ProfesionesService,
    private estados_civilesService: EstadosCivilesService
  ) {
    this.representanteForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      fecha_nacimiento: new FormControl(null, [Validators.required]),
      dpi: new FormControl(null, [Validators.required]),
      resolucion: new FormControl(null, [Validators.required]),
      fecha_resolucion: new FormControl(null, [Validators.required]),
      acuerdo: new FormControl(null, [Validators.required]),
      fecha_acuerdo: new FormControl(null, [Validators.required]),
      jd_resuelve: new FormControl(null, [Validators.required]),
      fecha_jd_resuelve: new FormControl(null, [Validators.required]),
      direccion: new FormControl(null, [Validators.required]),
      autorizacion: new FormControl(null, [Validators.required]),
      acta_toma_posecion: new FormControl(null, [Validators.required]),
      fecha_acta_toma_posecion: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      imagen_carnet: new FormControl(null),
      imagen_acta_toma_posecion: new FormControl(null),
      imagen_dpi: new FormControl(null),
      imagen_firma: new FormControl(null),
      imagen_sello: new FormControl(null),
      id_regional: new FormControl(null, [Validators.required]),
      id_puesto: new FormControl(null, [Validators.required]),
      id_profesion: new FormControl(null, [Validators.required]),
      id_estado_civil: new FormControl(null, [Validators.required])
    });
    AppComponent.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js');
    AppComponent.loadScript('assets/js/mask.js');
  }

  async ngOnInit() {
    this.ngxService.start();
    await this.getRepresentantes();
    await this.getRegionales();
    await this.getProfesiones();
    await this.getPuestos();
    await this.getEstadosCiviles();
    this.ngxService.stop();
  }

  async getRepresentantes() {
    let representantes = await this.representantesService.getRepresentantes();
    if (representantes) {
      this.representantes = representantes;
    }
  }

  async getRegionales() {
    let regionales = await this.regionalesService.getRegionales();
    if (regionales) {
      this.regionales = regionales;
    }
  }

  async getPuestos() {
    let puestos = await this.puestosService.getPuestos();
    if (puestos) {
      this.puestos = puestos;
    }
  }

  async getProfesiones() {
    let profesiones = await this.profesionesService.getProfesiones();
    if (profesiones) {
      this.profesiones = profesiones;
    }
  }

  async getEstadosCiviles() {
    let estados_civiles = await this.estados_civilesService.getEstadosCiviles();
    if (estados_civiles) {
      this.estados_civiles = estados_civiles;
    }
  }

  async postRepresentante() {
    if (!HomeComponent.getPermiso('Agregar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let representante = await this.representantesService.postRepresentante(this.representanteForm.value);
    if (representante.resultado) {
      await this.getRepresentantes();
      this.alert.alertMax('Operacion Correcta', representante.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async putRepresentante() {
    if (!HomeComponent.getPermiso('Editar')) {
      this.alert.alertMax('Operacion Incorrecta', 'Permiso Denegado', 'error');
      return;
    }
    this.ngxService.start();
    let representante = await this.representantesService.putRepresentante(this.representante.id, this.representanteForm.value);
    if (representante.resultado) {
      await this.getRepresentantes();
      this.alert.alertMax('Operacion Correcta', representante.mensaje, 'success');
      this.limpiar();
    }
    this.ngxService.stop();
  }

  async deleteRepresentante(i: any, index: number) {
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
        let representante = await this.representantesService.deleteRepresentante(i.id);
        if (representante.resultado) {
          this.representantes.splice(index, 1);
          this.alert.alertMax('Correcto', representante.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  setImage(event: any, imagen: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onload = () => {
      this.representanteForm.controls[`${imagen}`].setValue(reader.result);
    };
    reader.readAsDataURL(file);
  }


  // Metodos para obtener data y id de registro seleccionado
  setRepresentante(i: any, index: number) {
    i.index = index;
    this.representante = i;
    this.representanteForm.controls['nombre'].setValue(i.nombre);
    this.representanteForm.controls['apellido'].setValue(i.apellido);
    this.representanteForm.controls['fecha_nacimiento'].setValue(moment.utc(i.fecha_nacimiento).format('YYYY-MM-DD'));
    this.representanteForm.controls['dpi'].setValue(i.dpi);
    this.representanteForm.controls['resolucion'].setValue(i.resolucion);
    this.representanteForm.controls['fecha_resolucion'].setValue(moment.utc(i.fecha_resolucion).format('YYYY-MM-DD'));
    this.representanteForm.controls['acuerdo'].setValue(i.acuerdo);
    this.representanteForm.controls['fecha_acuerdo'].setValue(moment.utc(i.fecha_acuerdo).format('YYYY-MM-DD'));
    this.representanteForm.controls['jd_resuelve'].setValue(i.jd_resuelve);
    this.representanteForm.controls['fecha_jd_resuelve'].setValue(moment.utc(i.fecha_jd_resuelve).format('YYYY-MM-DD'));
    this.representanteForm.controls['direccion'].setValue(i.direccion);
    this.representanteForm.controls['autorizacion'].setValue(i.autorizacion);
    this.representanteForm.controls['acta_toma_posecion'].setValue(i.acta_toma_posecion);
    this.representanteForm.controls['fecha_acta_toma_posecion'].setValue(moment.utc(i.fecha_acta_toma_posecion).format('YYYY-MM-DD'));
    this.representanteForm.controls['estado'].setValue(i.estado);
    this.representanteForm.controls['imagen_carnet'].setValue(i.imagen_carnet);
    this.representanteForm.controls['imagen_acta_toma_posecion'].setValue(i.imagen_acta_toma_posecion);
    this.representanteForm.controls['imagen_dpi'].setValue(i.imagen_dpi);
    this.representanteForm.controls['imagen_firma'].setValue(i.imagen_firma);
    this.representanteForm.controls['imagen_sello'].setValue(i.imagen_sello);
    this.representanteForm.controls['id_regional'].setValue(i.id_regional);
    this.representanteForm.controls['id_puesto'].setValue(i.id_puesto);
    this.representanteForm.controls['id_profesion'].setValue(i.id_profesion);
    this.representanteForm.controls['id_estado_civil'].setValue(i.id_estado_civil);
  }

  limpiar() {
    this.representanteForm.reset();
    this.representante = null;
  }

}
