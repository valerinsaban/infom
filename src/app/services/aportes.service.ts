import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AportesService {

  constructor(private rootService: RootService) {
  }

  route = '/aportes';

  getAportes(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getAporte(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postAporte(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putAporte(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteAporte(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

