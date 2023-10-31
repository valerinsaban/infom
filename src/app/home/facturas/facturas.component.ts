import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FacturasService } from 'src/app/services/documentos/facturas.service';
import { HomeComponent } from '../home.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { MegaPrintService } from 'src/app/services/megaprint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent {

  facturaForm: FormGroup;

  facturas: any = [];
  facturas_detalles: any = [];

  factura: any;

  usuario: string = '974250';
  apikey: string = 'qiDMo9LlPJRyiDzWOOtw5pB';

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private megaprintService: MegaPrintService,
    private facturasService: FacturasService
  ) {
    this.facturaForm = new FormGroup({
      numero: new FormControl(null),
      fecha: new FormControl(null),
      nit: new FormControl(null),
      nombre: new FormControl(null),
      autorizacion: new FormControl(null),
      serie_fel: new FormControl(null),
      numero_fel: new FormControl(null),
      monto: new FormControl(null),
      estado: new FormControl(null),
    });
  }

  async ngOnInit() {
    await this.getFacturas();
    await this.getToken();
  }

  get configuracion() {
    return HomeComponent.configuracion;
  }

  async getFacturas() {
    this.ngxService.start();
    let facturas = await this.facturasService.getFacturas();
    if (facturas) {
      this.facturas = facturas;
    }
    this.ngxService.stop();
  }

  setFactura(f: any, u: number) {

  }

  async postFactura() {

  }

  async putFactura() {

  }

  async deleteFactura(f: any, u: number) {

  }

  async getToken() {
    try {
      let data = await this.megaprintService.solicitarToken();
      data.subscribe(statusCode => {
        console.log(JSON.parse(JSON.stringify(statusCode)));
      });   
    } catch (error) {
      console.log(error);
      
    }
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

}
