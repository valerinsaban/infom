import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramasGarantiasService {

  constructor(private rootService: RootService) { }

  route = '/programas_garantias';

  getProgramasGarantias(id_programa: number): Promise<any> {
    return this.rootService.get(this.route + '/programa/' + id_programa);
  }

  async postProgramaGarantia(data: any): Promise<any> {
    let programa_garantia = await this.rootService.post(this.route, data);
    if (programa_garantia.resultado) {
      await this.rootService.bitacora('programa_garantia', 'agregar', `creó la programa_garantia "${programa_garantia.data.nombre}"`, programa_garantia.data);
    }
    return programa_garantia;
  }

  async putProgramaGarantia(id: number, data: any): Promise<any> {
    let programa_garantia = await this.rootService.put(this.route + '/' + id, data);
    if (programa_garantia.resultado) {
      await this.rootService.bitacora('programa_garantia', 'editar', `editó la programa_garantia "${programa_garantia.data.nombre}"`, programa_garantia.data);
    }
    return programa_garantia;
  }

  async deleteProgramaGarantia(id: number): Promise<any> {
    let programa_garantia = await this.rootService.delete(this.route + '/' + id);
    if (programa_garantia.resultado) {
      await this.rootService.bitacora('programa_garantia', 'eliminar', `eliminó la programa_garantia "${programa_garantia.data.nombre}"`, programa_garantia.data);
    }
    return programa_garantia;
  }
}
