import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private rootService: RootService) {
  }

  route = '/reportes';

  getReporteDepartamentos(format: string): Promise<any> {
    return this.rootService.get(this.route + '/departamentos/' + format);
  }


}

