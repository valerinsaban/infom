import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class BitacorasService {

  constructor(private rootService: RootService) {
  }

  route = '/bitacoras';

  getBitacoras(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getBitacorasFecha(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getBitacora(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postBitacora(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putBitacora(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteBitacora(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

