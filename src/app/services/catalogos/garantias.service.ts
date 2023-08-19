import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class GarantiasService {

  constructor(private rootService: RootService) { }

  route = '/garantias';

  getGarantias(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getGarantia(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postGarantia(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putGarantia(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteGarantia(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }
}