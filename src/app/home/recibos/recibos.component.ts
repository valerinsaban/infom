import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecibosService } from 'src/app/services/documentos/recibos.service';
import { HomeComponent } from '../home.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from 'src/app/services/alert.service';
import { MegaPrintService } from 'src/app/services/megaprint.service';
import Swal from 'sweetalert2';
import { RecibosDetallesService } from 'src/app/services/documentos/recibos_detalles.service';
import { AppComponent } from 'src/app/app.component';
import { ReporteService } from 'src/app/services/reportes.service';
import * as moment from 'moment';
import { md5 } from 'js-md5';

declare function numeroALetrasMoneda(number: any): any;

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css']
})
export class RecibosComponent {

  reciboForm: FormGroup;

  recibos: any = [];
  recibos_detalles: any = [];

  recibo: any;

  usuario: string = '974250';
  apikey: string = 'qiDMo9LlPJRyiDzWOOtw5pB';

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private megaprintService: MegaPrintService,
    private recibosService: RecibosService,
    private recibos_detallesService: RecibosDetallesService,
    private reporteService: ReporteService
  ) {
    this.reciboForm = new FormGroup({
      numero: new FormControl(null),
      fecha: new FormControl(null, [Validators.required]),
      nit: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      monto: new FormControl(null),
      estado: new FormControl(null),
      descripcion: new FormControl(null),
      firma: new FormControl(null),
      id_factura: new FormControl(null),
    });
  }

  async ngOnInit() {
    AppComponent.loadScript('assets/js/letras-moneda.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');
    await this.getRecibos();
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

  async getRecibos() {
    this.ngxService.start();
    let recibos = await this.recibosService.getRecibos(this.fecha_inicio, this.fecha_fin);
    if (recibos) {
      this.recibos = recibos;
    }
    this.ngxService.stop();
  }

  async postRecibo() {
    this.ngxService.start();

    this.reciboForm.controls['estado'].setValue('Vigente');
    this.reciboForm.controls['monto'].setValue(this.getMonto());
    this.reciboForm.controls['firma'].setValue(this.getFirma());
    let recibo = await this.recibosService.postRecibo(this.reciboForm.value);
    if (recibo.resultado) {
      for (let d = 0; d < this.recibos_detalles.length; d++) {
        this.recibos_detalles[d].id_recibo = recibo.data.id;
        await this.getRecibos();
        await this.recibos_detallesService.postReciboDetalle(this.recibos_detalles[d]);
        this.limpiar();
      }
      this.alert.alertMax('Operacion Correcta', recibo.mensaje, 'success');
    }

    this.ngxService.stop();
  }

  async deleteRecibo(i: any, index: number) {
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
        let prestamo = await this.recibosService.deleteRecibo(i.id);
        if (prestamo.resultado) {
          this.recibos.splice(index, 1);
          await this.getRecibos();
          this.alert.alertMax('Correcto', prestamo.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  async anularRecibo(i: any, index: number) {
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
        let prestamo = await this.recibosService.anularRecibo(i.id, { estado: 'Anulada' });
        if (prestamo.resultado) {
          await this.getRecibos();
          this.alert.alertMax('Correcto', prestamo.mensaje, 'success');
          this.limpiar();
        }
        this.ngxService.stop();
      }
    })
  }

  async imprimirRecibo(r: any) {
    this.ngxService.start();

    let recibo = await this.recibosService.getRecibo(r.id);
    if (recibo) {
      this.recibo = recibo;
      this.recibo.fecha = moment(this.recibo.fecha).format('DD [de] MMMM [de] YYYY')

      let recibos_detalles = await this.recibos_detallesService.getRecibosDetallesRecibo(this.recibo.id);
      if (recibos_detalles) {
        this.recibos_detalles = recibos_detalles;
      }
    }

    let rep: any = await this.reporteService.get('recibo');
    rep = rep.replaceAll("{{no_recibo}}", recibo.id);
    rep = rep.replaceAll("{{monto}}", this.moneda(recibo.monto));
    rep = rep.replaceAll("{{usuario}}", `${this.usuario}`);
    this.catalogo(rep, 'recibo', print)

    this.ngxService.stop();
  }

  calc(d: any) {
    d.precio = d.cantidad * d.precio_unitario;
    d.subtotal = d.precio - d.descuentos;
    d.impuestos = d.subtotal / 1.12 * 0.12;
    d.impuestos = Math.round((d.impuestos + Number.EPSILON) * 100) / 100;
    d.monto_gravable = d.subtotal - d.impuestos;
  }

  getMonto() {
    let total = 0;
    for (let i = 0; i < this.recibos_detalles.length; i++) {
      total += this.recibos_detalles[i].subtotal;
    }
    return total;
  }

  getFirma() {
    // let no_recibo = this.reciboForm.controls['estado'].value;
    let fecha = this.reciboForm.controls['fecha'].value;
    let usuario = HomeComponent.usuario.nombre;
    return md5(`${fecha}${usuario}`);
  }

  nuevoDetalle() {
    this.recibos_detalles.push({
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
    this.recibos_detalles.splice(u, 1)
  }

  letrasMoneda(number: any) {
    return numeroALetrasMoneda(number);
  }

  limpiar() {
    this.recibo = null;
    this.reciboForm.reset();
  }

  print(rep: any) {
    let popupWin: any = window.open("", "_blank");
    popupWin.document.open();
    popupWin.document.write(rep);
    popupWin.document.close();
  }

  async catalogo(rep: any, slug: any, print: any) {
    let contenido: any = document.getElementById(slug);
    contenido = contenido.innerHTML.toString();

    rep = rep.replaceAll("{{generado}}", moment().format('DD/MM/YYYY HH:mm'));
    rep = rep.replaceAll("{{usuario}}", HomeComponent.usuario.nombre);
    rep = rep.replaceAll("{{contenido}}", contenido);

    if (print) {
      this.print(rep)
    }
  }

  getUsuario() {
    return HomeComponent.usuario.nombre;
  }

  moneda(total: any) {
    let currency = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return currency.format(total);
  }

}
