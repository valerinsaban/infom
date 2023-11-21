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
import * as convert from 'xml-js';

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
      uuid: new FormControl(null),
      monto: new FormControl(null),
      subtotal: new FormControl(null),
      impuestos: new FormControl(null),
      estado: new FormControl(null),
      descripcion: new FormControl(null),
      id_amortizacion: new FormControl(null)
    });
  }

  async ngOnInit() {
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');
    await this.getFacturas();
  }

  get configuracion() {
    return HomeComponent.configuracion;
  }

  get fecha_inicio() {
    return sessionStorage.getItem('fecha_inicio');
  }

  get fecha_fin() {
    return sessionStorage.getItem('fecha_fin');
  }

  async getFacturas() {
    this.ngxService.start();
    let facturas = await this.facturasService.getFacturas(this.fecha_inicio, this.fecha_fin);
    if (facturas) {
      this.facturas = facturas;
    }
    this.ngxService.stop();
  }

  async postFactura() {
    this.ngxService.start();

    let data = await this.megaprintService.solicitarToken();
    if (data.resultado) {
      let token = data.res.token._text;

      let info = {
        factura: this.facturaForm.value,
        detalles: this.facturas_detalles
      }

      data = await this.megaprintService.certificar(token, info);
      if (data.resultado) {
        
        let datos: any = convert.xml2json(data.res.xml_dte._text, { compact: true, spaces: 4 });
        datos = JSON.parse(datos);
        // console.log(datos.dte:GTDocumento.dte:SAT.dte:DTE.dte:Certificacion.dte:NumeroAutorizacion._attributes);
                
        this.facturaForm.controls['uuid'].setValue(data.res.uuid._text);
        // this.facturaForm.controls['autorizacion'].setValue(data.res.uuid._text);
        // this.facturaForm.controls['serie_fel'].setValue(data.res.uuid._text);
        // this.facturaForm.controls['numero_fel'].setValue(data.res.uuid._text);
        this.facturaForm.controls['estado'].setValue('Vigente');
        this.facturaForm.controls['monto'].setValue(this.getMonto());
        this.facturaForm.controls['subtotal'].setValue(this.getSubtotal());
        this.facturaForm.controls['impuestos'].setValue(this.getImpuestos());
        let factura = await this.facturasService.postFactura(this.facturaForm.value);
        if (factura.resultado) {
          for (let d = 0; d < this.facturas_detalles.length; d++) {
            this.facturas_detalles[d].id_factura = factura.data.id;
            await this.getFacturas();
            await this.facturas_detallesService.postFacturaDetalle(this.facturas_detalles[d]);
            this.limpiar();
          }
          this.alert.alertMax('Operacion Correcta', factura.mensaje, 'success');
        }

      }
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

  async imprimirFactura(uuid: any) {
    this.ngxService.start();

    let data = await this.megaprintService.solicitarToken();
    if (data.resultado) {
      let token = data.res.token._text;

      data = await this.megaprintService.imprimir(token, uuid);
      if (data.resultado) {
        let blob = this.b64toBlob(data.res.pdf._text);
        let blobUrl: any = URL.createObjectURL(blob);
        window.open(blobUrl);
      }
      this.ngxService.stop();
    }
  }

  calc(d: any) {
    d.precio = d.cantidad * d.precio_unitario;
    d.subtotal = d.precio - d.descuentos;
    d.impuestos = d.subtotal / 1.12 * 0.12;
    d.impuestos = Math.round((d.impuestos + Number.EPSILON) * 100) / 100;
    d.monto_gravable = d.subtotal - d.impuestos;
    d.monto_gravable = Math.round((d.monto_gravable + Number.EPSILON) * 100) / 100;
  }

  getMonto() {
    let total = 0;
    for (let i = 0; i < this.facturas_detalles.length; i++) {
      total += this.facturas_detalles[i].subtotal;
    }
    return total;
  }

  getImpuestos() {
    let total = 0;
    for (let i = 0; i < this.facturas_detalles.length; i++) {
      total += this.facturas_detalles[i].impuestos;
    }
    return total;
  }

  getSubtotal() {
    let total = 0;
    for (let i = 0; i < this.facturas_detalles.length; i++) {
      total += this.facturas_detalles[i].monto_gravable;
    }
    return total;
  }

  nuevoDetalle() {
    this.facturas_detalles.push({
      cantidad: 1,
      tipo: 'S',
      descripcion: '',
      precio_unitario: '',
      descuentos: 0,
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

  b64toBlob(b64Data: any, sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    return blob;
  }

}
