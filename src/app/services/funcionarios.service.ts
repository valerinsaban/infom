import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {

  constructor(private rootService: RootService) {
  }

  route = '/funcionarios';

  getFuncionarios(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getFuncionariosMunicipalidad(id_municipalidad: number): Promise<any> {
    return this.rootService.get(this.route + '/municipalidad/' + id_municipalidad);
  }

  getFuncionarioUltimo(id_municipalidad: number, estado: string): Promise<any> {
    return this.rootService.get(this.route + '/ultimo/' + id_municipalidad + '/' + estado);
  }

  getFuncionario(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postFuncionario(data: any): Promise<any> {
    let funcionario = await this.rootService.post(this.route, data);
    if (funcionario.resultado) {
      await this.rootService.bitacora('funcionario', 'agregar', `creó el funcionario "${funcionario.data.nombre}"`, funcionario.data);
    }
    return funcionario;
  }

  async putFuncionario(id: number, data: any): Promise<any> {
    let funcionario = await this.rootService.put(this.route + '/' + id, data);
    if (funcionario.resultado) {
      await this.rootService.bitacora('funcionario', 'editar', `editó el funcionario "${funcionario.data.nombre}"`, funcionario.data);
    }
    return funcionario;
  }

  async deleteFuncionario(id: number): Promise<any> {
    let funcionario = await this.rootService.delete(this.route + '/' + id);
    if (funcionario.resultado) {
      await this.rootService.bitacora('funcionario', 'eliminar', `eliminó el funcionario "${funcionario.data.nombre}"`, funcionario.data);
    }
    return funcionario;
  }


}

