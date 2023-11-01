import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FacturasService } from 'src/app/services/documentos/facturas.service';
import { HomeComponent } from '../home.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { MegaPrintService } from 'src/app/services/megaprint.service';
import Swal from 'sweetalert2';
import { FacturasDetallesService } from 'src/app/services/documentos/facturas_detalles.service';
import { AppComponent } from 'src/app/app.component';
import { HttpErrorResponse } from '@angular/common/http';

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
    private facturasService: FacturasService,
    private facturas_detallesService: FacturasDetallesService
  ) {
    this.facturaForm = new FormGroup({
      numero: new FormControl(null),
      fecha: new FormControl(null, [Validators.required]),
      nit: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      autorizacion: new FormControl(null),
      serie_fel: new FormControl(null),
      numero_fel: new FormControl(null),
      monto: new FormControl(null),
      estado: new FormControl(null),
    });
  }

  async ngOnInit() {
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');
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

  async postFactura() {
    this.ngxService.start();
    this.facturaForm.controls['estado'].setValue('Vigente');
    this.facturaForm.controls['monto'].setValue(this.getMonto());
    let factura = await this.facturasService.postFactura(this.facturaForm.value);
    if (factura.resultado) {
      for (let d = 0; d < this.facturas_detalles.length; d++) {
        this.facturas_detalles[d].id_factura = factura.data.id;
        await this.getFacturas();
        await this.facturas_detallesService.postFacturaDetalle(this.facturas_detalles[d]);
        this.limpiar();
      }
      this.alert.alertMax('Transaccion Correcta', factura.mensaje, 'success');
    }
    this.ngxService.stop();
  }

  async deleteFactura(i: any, index: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let prestamo = await this.facturasService.deleteFactura(i.id);
        if (prestamo.resultado) {
          this.facturas.splice(index, 1);
          await this.getFacturas();
          this.alert.alertMax('Correcto', prestamo.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  async anularFactura(i: any, index: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta accion no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Anular!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.ngxService.start();
        let prestamo = await this.facturasService.anularFactura(i.id, { estado: 'Anulada' });
        if (prestamo.resultado) {
          await this.getFacturas();
          this.alert.alertMax('Correcto', prestamo.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  async getToken() {
    let data = await this.megaprintService.solicitarToken();
    // let res = new HttpErrorResponse(data);
    data.subscribe((res: any) => {
      console.log(res);
      
    });
    
  }

  calc(d: any) {
    !d.cantidad ? d.cantidad = 0 : null;
    !d.precio_unitario ? d.precio_unitario = 0 : null;
    !d.descuentos ? d.descuentos = 0 : null;

    d.subtotal = (d.cantidad * d.precio_unitario) - d.descuentos;
    d.impuestos = d.subtotal / 1.12 * 0.12;
  }

  getMonto() {
    let total = 0;
    for (let i = 0; i < this.facturas_detalles.length; i++) {
      total += this.facturas_detalles[i].subtotal;
    }
    return total;
  }

  nuevoDetalle() {
    this.facturas_detalles.push({
      cantidad: 1,
      tipo: 'S',
      descripcion: '',
      precio_unitario: '',
      descuentos: '',
      impuestos: '',
      subtotal: ''
    });
  }

  removerDetalle(u: number) {
    this.facturas_detalles.splice(u, 1)
  }

  limpiar() {
    this.factura = null;
    this.facturaForm.reset();
  }

}