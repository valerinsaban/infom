import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  constructor(private rootService: RootService) {
  }

  route = '/departamentos';

  getDepartamentos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getDepartamento(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postDepartamento(data: any): Promise<any> {
    let departamento = await this.rootService.post(this.route, data);
    if (departamento.resultado) {
      await this.rootService.bitacora('departamento', 'agregar', `creó el departamento "${departamento.data.nombre}"`, departamento.data);
    }
    return departamento;
  }

  async putDepartamento(id: number, data: any): Promise<any> {
    let departamento = await this.rootService.put(this.route + '/' + id, data);
    if (departamento.resultado) {
      await this.rootService.bitacora('departamento', 'editar', `editó el departamento "${departamento.data.nombre}"`, departamento.data);
    }
    return departamento;
  }

  async deleteDepartamento(id: number): Promise<any> {
    let departamento = await this.rootService.delete(this.route + '/' + id);
    if (departamento.resultado) {
      await this.rootService.bitacora('departamento', 'eliminar', `eliminó el departamento "${departamento.data.nombre}"`, departamento.data);
    }
    return departamento;
  }

}
