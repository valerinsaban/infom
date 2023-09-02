import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ImportesService {

  constructor(private rootService: RootService) {
  }

  route = '/importes';

  getImportes(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getImporte(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postImporte(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putImporte(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteImporte(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

