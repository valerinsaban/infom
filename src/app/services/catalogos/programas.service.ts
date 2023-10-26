import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {

  constructor(private rootService: RootService) { }

  route = '/programas';

  getProgramas(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getPrograma(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postPrograma(data: any): Promise<any> {
    let programa = await this.rootService.post(this.route, data);
    if (programa.resultado) {
      await this.rootService.bitacora('programa', 'agregar', `creó la programa "${programa.data.nombre}"`, programa.data);
    }
    return programa;
  }

  async putPrograma(id: number, data: any): Promise<any> {
    let programa = await this.rootService.put(this.route + '/' + id, data);
    if (programa.resultado) {
      await this.rootService.bitacora('programa', 'editar', `editó la programa "${programa.data.nombre}"`, programa.data);
    }
    return programa;
  }

  async deletePrograma(id: number): Promise<any> {
    let programa = await this.rootService.delete(this.route + '/' + id);
    if (programa.resultado) {
      await this.rootService.bitacora('programa', 'eliminar', `eliminó la programa "${programa.data.nombre}"`, programa.data);
    }
    return programa;
  }
}
