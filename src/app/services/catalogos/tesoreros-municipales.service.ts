import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class TesorerosMunicipalesService {

  constructor(private rootService: RootService) { }

  route = '/tesoreros-municipales';

  getTesorerosMunicipales(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getTesoreroMunicipal(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postTesoreroMunicipal(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putTesoreroMunicipal(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteTesoreroMunicipal(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
