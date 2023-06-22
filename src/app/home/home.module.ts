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

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'departamentos', component: DepartamentosComponent },
      /* { path: 'municipios', component: MunicipiosComponent }, */
      { path: 'escolaridades', component: EscolaridadesComponent },
      { path: 'estados-civiles', component: EstadoCivilComponent },
      { path: 'oficinas-regionales', component: OficinaRegionalComponent}
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
    OficinaRegionalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
