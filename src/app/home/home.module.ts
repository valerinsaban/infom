import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentosComponent } from './catalogos/departamentos/departamentos.component';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MunicipiosComponent } from './catalogos/municipios/municipios.component';
import { EscolaridadesComponent } from './catalogos/escolaridades/escolaridades.component';
import { EstadoCivilComponent } from './catalogos/estado-civil/estado-civil.component';
import { OficinaRegionalComponent } from './catalogos/oficina-regional/oficina-regional.component';
import { PuestosComponent } from './catalogos/puestos/puestos.component';
import { TesorerosMunicipalesComponent } from './catalogos/tesoreros-municipales/tesoreros-municipales.component';
import { RegionesComponent } from './catalogos/regiones/regiones.component';
import { UsuariosComponent } from './seguridad/usuarios/usuarios.component';
import { RolesComponent } from './seguridad/roles/roles.component';
import { AlcaldiasComponent } from './mantenimientos/alcaldias/alcaldias.component';
import { GenerosComponent } from './catalogos/generos/generos.component';
import { GarantiasComponent } from './catalogos/garantias/garantias.component';
import { InteresesPorMunicipalidadComponent } from './mantenimientos/intereses-por-municipalidad/intereses-por-municipalidad.component';
import { MenuComponent } from './seguridad/menu/menu.component';
import { OpcionesMenuComponent } from './seguridad/opciones-menu/opciones-menu.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'departamentos', component: DepartamentosComponent },
      { path: 'municipios', component: MunicipiosComponent },
      { path: 'escolaridades', component: EscolaridadesComponent },
      { path: 'estados-civiles', component: EstadoCivilComponent },
      { path: 'oficinas-regionales', component: OficinaRegionalComponent},
      { path: 'puestos', component: PuestosComponent},
      { path: 'tesoreros-municipales', component: TesorerosMunicipalesComponent},
      { path: 'regiones', component: RegionesComponent},
      // Seguridad
      { path: 'usuarios', component: UsuariosComponent},
      { path: 'roles', component: RolesComponent},
      { path: 'menu', component: MenuComponent},
      { path: 'opciones-menu', component: OpcionesMenuComponent}
    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    DepartamentosComponent,
    MunicipiosComponent,
    EscolaridadesComponent,
    EstadoCivilComponent,
    OficinaRegionalComponent,
    PuestosComponent,
    TesorerosMunicipalesComponent,
    RegionesComponent,
    UsuariosComponent,
    RolesComponent,
    AlcaldiasComponent,
    GenerosComponent,
    GarantiasComponent,
    InteresesPorMunicipalidadComponent,
    MenuComponent,
    OpcionesMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
