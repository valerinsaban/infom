import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  url: any = null;
  reporte: any = '';
  formato: any = 'PDF';
  reportes: any = [];

  constructor(
    private sanitizer: DomSanitizer
  ) {
    this.getReportes();
  }

  getReportes() {
    this.reportes = [
      { id: 1, nombre: "Maqueta", url: `reportes/${this.formato}/maqueta` },
      { id: 2, nombre: "Departamentos", url: `reportes/${this.formato}/departamentos` }
    ];
  }

  setReporte($event: any) {
    this.reporte = $event.target.value;
  }

  generar() {
    this.getReportes();
    for (let r = 0; r < this.reportes.length; r++) {
      if(this.reporte == this.reportes[r].id) {
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.api}/${this.reportes[r].url}`);
        return;
      }
    }
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(``);
  }

}
