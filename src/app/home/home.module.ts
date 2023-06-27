import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MunicipiosComponent } from './municipios/municipios.component';
import { EscolaridadesComponent } from './escolaridades/escolaridades.component';
import { EstadoCivilComponent } from './estado-civil/estado-civil.component';
import { OficinaRegionalComponent } from './oficina-regional/oficina-regional.component';
import { PuestosComponent } from './puestos/puestos.component';
import { TesorerosMunicipalesComponent } from './tesoreros-municipales/tesoreros-municipales.component';
import { RegionesComponent } from './regiones/regiones.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'departamentos', component: DepartamentosComponent },
      /* { path: 'municipios', component: MunicipiosComponent }, */
      { path: 'escolaridades', component: EscolaridadesComponent },
      { path: 'estados-civiles', component: EstadoCivilComponent },
      { path: 'oficinas-regionales', component: OficinaRegionalComponent},
      { path: 'puestos', component: PuestosComponent},
      { path: 'tesoreros-municipales', component: TesorerosMunicipalesComponent},
      { path: 'regiones', component: RegionesComponent}
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
    RegionesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
