import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {

  constructor(private rootService: RootService) { }

  route = '/generos';

  getGeneros(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getGenero(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postGenero(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putGenero(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteGenero(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
