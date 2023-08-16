import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentosComponent } from './catalogos/departamentos/departamentos.component';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MunicipiosComponent } from './catalogos/municipios/municipios.component';
import { EstadoCivilComponent } from './catalogos/estado-civil/estado-civil.component';
import { PuestosComponent } from './catalogos/puestos/puestos.component';
import { TesorerosMunicipalesComponent } from './catalogos/tesoreros-municipales/tesoreros-municipales.component';
import { RegionesComponent } from './catalogos/regiones/regiones.component';
import { UsuariosComponent } from './seguridad/usuarios/usuarios.component';
import { RolesComponent } from './seguridad/roles/roles.component';
import { GenerosComponent } from './catalogos/generos/generos.component';
import { GarantiasComponent } from './catalogos/garantias/garantias.component';
import { DestinoPrestamoComponent } from './catalogos/destino-prestamo/destino-prestamo.component';
import { MunicipalidadesComponent } from './municipalidades/municipalidades.component';
import { RegionalesComponent } from './seguridad/regionales/regionales.component';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { ProfesionesComponent } from './catalogos/profesiones/profesiones.component';
import { BancosComponent } from './catalogos/bancos/bancos.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'bienvenido', component: BienvenidoComponent },

      { path: 'municipalidades', component: MunicipalidadesComponent },
      { path: 'funcionarios', component: FuncionariosComponent },

      // Catalogos
      { path: 'departamentos', component: DepartamentosComponent },
      { path: 'municipios', component: MunicipiosComponent },
      { path: 'estados-civiles', component: EstadoCivilComponent },
      { path: 'puestos', component: PuestosComponent},
      { path: 'tesoreros-municipales', component: TesorerosMunicipalesComponent},
      { path: 'regiones', component: RegionesComponent},
      { path: 'generos', component: GenerosComponent},
      { path: 'garantias', component: GarantiasComponent},
      { path: 'profesiones', component: ProfesionesComponent},
      { path: 'bancos', component: BancosComponent},
      { path: 'destino-prestamos', component: DestinoPrestamoComponent},

      // Seguridad
      { path: 'regionales', component: RegionalesComponent},
      { path: 'usuarios', component: UsuariosComponent},
      { path: 'roles', component: RolesComponent},

      { path: '**', pathMatch: 'full', redirectTo: 'bienvenido' }
    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    DepartamentosComponent,
    MunicipiosComponent,
    EstadoCivilComponent,
    PuestosComponent,
    TesorerosMunicipalesComponent,
    RegionesComponent,
    UsuariosComponent,
    RolesComponent,
    GenerosComponent,
    GarantiasComponent,
    DestinoPrestamoComponent,
    MunicipalidadesComponent,
    RegionalesComponent,
    FuncionariosComponent,
    ProfesionesComponent,
    BancosComponent,
    BienvenidoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
