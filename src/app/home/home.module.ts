import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { TiposPrestamosComponent } from './catalogos/tipos-prestamos/tipos-prestamos.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'bienvenido', component: BienvenidoComponent },

      { path: 'municipalidades', component: MunicipalidadesComponent },
      { path: 'funcionarios', component: FuncionariosComponent },
      { path: 'prestamos', component: PrestamosComponent},

      // Catalogos
      { path: 'departamentos', component: DepartamentosComponent },
      { path: 'municipios', component: MunicipiosComponent },
      { path: 'estados-civiles', component: EstadosCivilesComponent },
      { path: 'puestos', component: PuestosComponent},
      { path: 'regiones', component: RegionesComponent},
      { path: 'generos', component: GenerosComponent},
      { path: 'garantias', component: GarantiasComponent},
      { path: 'profesiones', component: ProfesionesComponent},
      { path: 'bancos', component: BancosComponent},
      { path: 'tipos-prestamos', component: TiposPrestamosComponent},

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
    TiposPrestamosComponent,
    PrestamosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule
  ]
})
export class HomeModule { }
