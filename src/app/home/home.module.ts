import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { DepartamentosComponent } from './catalogos/departamentos/departamentos.component';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MunicipiosComponent } from './catalogos/municipios/municipios.component';
import { EstadosCivilesComponent } from './catalogos/estados-civiles/estados-civiles.component';
import { PuestosComponent } from './catalogos/puestos/puestos.component';
import { RegionesComponent } from './catalogos/regiones/regiones.component';
import { UsuariosComponent } from './seguridad/usuarios/usuarios.component';
import { RolesComponent } from './seguridad/roles/roles.component';
import { GenerosComponent } from './catalogos/generos/generos.component';
import { GarantiasComponent } from './catalogos/garantias/garantias.component';
import { MunicipalidadesComponent } from './municipalidades/municipalidades.component';
import { RegionalesComponent } from './catalogos/regionales/regionales.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { ProfesionesComponent } from './catalogos/profesiones/profesiones.component';
import { BancosComponent } from './catalogos/bancos/bancos.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { PermisosComponent } from './seguridad/permisos/permisos.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AportesComponent } from './aportes/aportes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProduccionComponent } from './produccion/produccion.component';
import { BitacorasComponent } from './seguridad/bitacoras/bitacoras.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { RepresentantesComponent } from './representantes/representantes.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ClasesPrestamosComponent } from './catalogos/clases-prestamos/clases-prestamos.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { TiposPrestamosComponent } from './catalogos/tipos-prestamos/tipos-prestamos.component';
import { CobrosComponent } from './cobros/cobros.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'bienvenido', component: BienvenidoComponent },

      { path: 'municipalidades', component: MunicipalidadesComponent },
      { path: 'funcionarios', component: FuncionariosComponent },
      { path: 'representantes', component: RepresentantesComponent },
      { path: 'prestamos', component: PrestamosComponent},
      { path: 'aportes', component: AportesComponent},
      { path: 'dashboard', component: DashboardComponent},
      { path: 'bitacoras', component: BitacorasComponent},
      { path: 'produccion', component: ProduccionComponent},
      { path: 'reportes', component: ReportesComponent},
      { path: 'cobros', component: CobrosComponent},
      { path: 'configuraciones', component: ConfiguracionesComponent},

      // Catalogos
      { path: 'departamentos', component: DepartamentosComponent },
      { path: 'municipios', component: MunicipiosComponent },
      { path: 'estados-civiles', component: EstadosCivilesComponent },
      { path: 'puestos', component: PuestosComponent},
      { path: 'regiones', component: RegionesComponent},
      { path: 'generos', component: GenerosComponent},
      { path: 'garantias', component: GarantiasComponent},
      { path: 'tipos-prestamos', component: TiposPrestamosComponent},
      { path: 'clases-prestamos', component: ClasesPrestamosComponent},
      { path: 'profesiones', component: ProfesionesComponent},
      { path: 'bancos', component: BancosComponent},

      // Seguridad
      { path: 'regionales', component: RegionalesComponent},
      { path: 'usuarios', component: UsuariosComponent},
      { path: 'roles', component: RolesComponent},
      { path: 'permisos', component: PermisosComponent},

      { path: '**', pathMatch: 'full', redirectTo: 'bienvenido' }
    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    DepartamentosComponent,
    MunicipiosComponent,
    EstadosCivilesComponent,
    PuestosComponent,
    RegionesComponent,
    UsuariosComponent,
    RolesComponent,
    GenerosComponent,
    GarantiasComponent,
    MunicipalidadesComponent,
    RegionalesComponent,
    FuncionariosComponent,
    ProfesionesComponent,
    BancosComponent,
    BienvenidoComponent,
    PermisosComponent,
    PrestamosComponent,
    AportesComponent,
    DashboardComponent,
    ProduccionComponent,
    BitacorasComponent,
    RepresentantesComponent,
    ReportesComponent,
    TiposPrestamosComponent,
    ConfiguracionesComponent,
    ClasesPrestamosComponent,
    CobrosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    NgxJsonViewerModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class HomeModule { }
