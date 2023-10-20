import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class PartidosPoliticosService {

  constructor(private rootService: RootService) {
  }

  route = '/partidos_politicos';

  getPartidosPoliticos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getPartidoPolitico(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postPartidoPolitico(data: any): Promise<any> {
    let partido_politico = await this.rootService.post(this.route, data);
    if (partido_politico.resultado) {
      await this.rootService.bitacora('partido_politico', 'agregar', `creó el partido_politico "${partido_politico.data.nombre}"`, partido_politico.data);
    }
    return partido_politico;
  }

  async putPartidoPolitico(id: number, data: any): Promise<any> {
    let partido_politico = await this.rootService.put(this.route + '/' + id, data);
    if (partido_politico.resultado) {
      await this.rootService.bitacora('partido_politico', 'editar', `editó el partido_politico "${partido_politico.data.nombre}"`, partido_politico.data);
    }
    return partido_politico;
  }

  async deletePartidoPolitico(id: number): Promise<any> {
    let partido_politico = await this.rootService.delete(this.route + '/' + id);
    if (partido_politico.resultado) {
      await this.rootService.bitacora('partido_politico', 'eliminar', `eliminó el partido_politico "${partido_politico.data.nombre}"`, partido_politico.data);
    }
    return partido_politico;
  }
}
