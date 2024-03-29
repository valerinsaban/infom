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
import { GarantiasComponent } from './catalogos/garantias/garantias.component';
import { MunicipalidadesComponent } from './municipalidades/municipalidades.component';
import { RegionalesComponent } from './catalogos/regionales/regionales.component';
import { ProfesionesComponent } from './catalogos/profesiones/profesiones.component';
import { BancosComponent } from './catalogos/bancos/bancos.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { PermisosComponent } from './seguridad/permisos/permisos.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AportesComponent } from './aportes/aportes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BitacorasComponent } from './seguridad/bitacoras/bitacoras.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { RepresentantesComponent } from './representantes/representantes.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ProgramasComponent } from './catalogos/programas/programas.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { TiposPrestamosComponent } from './catalogos/tipos-prestamos/tipos-prestamos.component';
import { CobrosComponent } from './cobros/cobros.component';
import { PartidosPoliticosComponent } from './catalogos/partidos-politicos/partidos-politicos.component';
import { DestinosComponent } from './catalogos/destinos/destinos.component';
import { ResolucionesComponent } from './catalogos/resoluciones/resoluciones.component';
import { FacturasComponent } from './facturas/facturas.component';
import { RecibosComponent } from './recibos/recibos.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { TiposServiciosComponent } from './catalogos/tipos-servicios/tipos-servicios.component';
import { NgApexchartsModule } from 'ng-apexcharts';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'bienvenido', component: BienvenidoComponent },

      { path: 'dashboard', component: DashboardComponent},
      { path: 'municipalidades', component: MunicipalidadesComponent },
      { path: 'representantes', component: RepresentantesComponent },
      { path: 'prestamos', component: PrestamosComponent},
      { path: 'servicios', component: ServiciosComponent},
      { path: 'aportes', component: AportesComponent},
      { path: 'bitacoras', component: BitacorasComponent},
      { path: 'reportes', component: ReportesComponent},
      { path: 'cobros', component: CobrosComponent},
      { path: 'facturas', component: FacturasComponent},
      { path: 'recibos', component: RecibosComponent},
      { path: 'configuraciones', component: ConfiguracionesComponent},
      { path: 'perfil', component: PerfilComponent},

      // Catalogos
      { path: 'departamentos', component: DepartamentosComponent },
      { path: 'municipios', component: MunicipiosComponent },
      { path: 'estados-civiles', component: EstadosCivilesComponent },
      { path: 'puestos', component: PuestosComponent},
      { path: 'regiones', component: RegionesComponent},
      { path: 'garantias', component: GarantiasComponent},
      { path: 'tipos-prestamos', component: TiposPrestamosComponent},
      { path: 'tipos-servicios', component: TiposServiciosComponent},
      { path: 'programas', component: ProgramasComponent},
      { path: 'profesiones', component: ProfesionesComponent},
      { path: 'bancos', component: BancosComponent},
      { path: 'partidos-politicos', component: PartidosPoliticosComponent},
      { path: 'destinos', component: DestinosComponent},
      { path: 'resoluciones', component: ResolucionesComponent},

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
    GarantiasComponent,
    MunicipalidadesComponent,
    RegionalesComponent,
    ProfesionesComponent,
    BancosComponent,
    BienvenidoComponent,
    PermisosComponent,
    PrestamosComponent,
    AportesComponent,
    DashboardComponent,
    BitacorasComponent,
    RepresentantesComponent,
    ReportesComponent,
    TiposPrestamosComponent,
    ConfiguracionesComponent,
    ProgramasComponent,
    CobrosComponent,
    PartidosPoliticosComponent,
    DestinosComponent,
    ResolucionesComponent,
    FacturasComponent,
    RecibosComponent,
    ServiciosComponent,
    PerfilComponent,
    TiposServiciosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    NgxJsonViewerModule,
    NgApexchartsModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class HomeModule { }
