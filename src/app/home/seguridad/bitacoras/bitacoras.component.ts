import { Component } from '@angular/core';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from 'src/app/app.component';
import { AlertService } from 'src/app/services/alert.service';
import { BitacorasService } from 'src/app/services/bitacoras.service';

@Component({
  selector: 'app-bitacoras',
  templateUrl: './bitacoras.component.html',
  styleUrls: ['./bitacoras.component.css']
})
export class BitacorasComponent {

  bitacoras: any = [];
  bitacora: any;

  constructor(
    private alert: AlertService,
    private ngxService: NgxUiLoaderService,
    private bitacorasService: BitacorasService
  ) {

  }

  async ngOnInit() {
    await this.getBitacoras();
    AppComponent.loadScript('https://cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    AppComponent.loadScript('https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js');
    AppComponent.loadScript('assets/js/range.js');
  }

  async getBitacoras() {
    this.ngxService.start();
    this.bitacoras = [];
    let bitacoras = await this.bitacorasService.getBitacorasFecha(this.fecha_inicio, this.fecha_fin);
    if (bitacoras) {
      this.bitacoras = bitacoras.reverse();
    }
    this.ngxService.stop();
  }

  async setBitacora(i: any) {
    this.bitacora = i;
  }

  get fecha_inicio() {
    return sessionStorage.getItem('fecha_inicio');
  }

  get fecha_fin() {
    return sessionStorage.getItem('fecha_fin');
  }

  get code() {
    return JSON.parse(this.bitacora.body);
  }

  set code(v) {
    try {
      this.bitacora.body = JSON.parse(v);
    } catch (e) {
      console.log('error occored while you were typing the JSON');
    }
  }
  
  formNow(fecha: string) {
    return moment(fecha).fromNow()
  }

}
