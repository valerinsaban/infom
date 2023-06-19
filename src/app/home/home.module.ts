import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'departamentos', component: DepartamentosComponent },
    ]
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    DepartamentosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
