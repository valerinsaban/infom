import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private rootService: RootService) {
  }

  route = '/usuarios';

  getUsuarios(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getUsuario(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getUsuariosByUsuario(usuario: string): Promise<any> {
    return this.rootService.get(this.route + '/usuario/' + usuario);
  }

  getDocs(folder: number): Promise<any> {
    return this.rootService.get(this.route + '/file/docs/' + folder);
  }

  postUsuario(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putUsuario(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  putClave(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/clave/' + id, data);
  }

  deleteUsuario(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

  deleteDocs(id: number, name: string): Promise<any> {
    return this.rootService.delete(this.route + '/file/docs/' + id + '/' + name);
  }

  /* postImage(folder: number, file: any): Promise<any> {
    const formData = new FormData();
    formData.append('folder', folder.toString());
    formData.append('file', file);
    return this.rootService.postFile(this.route + '/file/image', formData);
  }

  postDocument(folder: number, file: any, nombre: string = ''): Promise<any> {
    const formData = new FormData();
    formData.append('folder', folder.toString());
    formData.append('file', file);
    formData.append('nombre', nombre);
    return this.rootService.postFile(this.route + '/file/docs', formData);
  } */

}
