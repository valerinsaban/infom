import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppComponent } from 'src/app/app.component';
import { PrestamosService } from 'src/app/services/prestamos.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  @ViewChild("chart") chart: any;
  @ViewChild("chart") chart2: any;
  @ViewChild("chart") chart3: any;

  counts: any = {
    pendientes: null,
    aprobados: null,
    acreditados: null,
    cancelados: null,
    anulados: null,
  }

  fecha_inicio: any = moment().startOf('year').format('YYYY-MM-DD')
  fecha_fin: any = moment().endOf('year').format('YYYY-MM-DD')

  constructor(
    private ngxService: NgxUiLoaderService,
    private prestamosService: PrestamosService
  ) {

  }


  async ngOnInit() {
    await this.getCountPrestamos();
    this.ngxService.stop();
    this.chart = {
      series: [
        {
          name: "basic",
          data: [0, 0, 0, 2, 0, 0, 0, 0, 0]
        }
      ],
      chart: {
        type: "line",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "2020",
          "2021",
          "2022",
          "2023",
          "2024",
          "2025",
          "2026",
          "2027",
          "2028"
        ]
      }
    };
    this.chart2 = {
      series: [
        {
          name: "basic",
          data: [0, 0, 0, 2, 0, 0, 0, 0, 0]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "2020",
          "2021",
          "2022",
          "2023",
          "2024",
          "2025",
          "2026",
          "2027",
          "2028"
        ]
      }
    };
    this.chart3 = {
      series: [
        {
          name: "Prestamos",
          type: "column",
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 2.5, 1.5, 1]
        },
        {
          name: "Montos",
          type: "column",
          data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 3, 3.1, 2]
        },
        {
          name: "Intereses",
          type: "line",
          data: [20, 29, 37, 36, 44, 45, 50, 58, 29, 37, 30]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 1, 4]
      },
      title: {
        text: "XYZ - Analisis de Prestamos (2013 - 2023)",
        align: "left",
        offsetX: 110
      },
      xaxis: {
        categories: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#008FFB"
          },
          labels: {
            style: {
              color: "#008FFB"
            }
          },
          title: {
            text: "No. Prestamos",
            style: {
              color: "#008FFB"
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: "Income",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#00E396"
          },
          labels: {
            style: {
              color: "#00E396"
            }
          },
          title: {
            text: "Montos de prestamos",
            style: {
              color: "#00E396"
            }
          }
        },
        {
          seriesName: "Revenue",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#FEB019"
          },
          labels: {
            style: {
              color: "#FEB019"
            }
          },
          title: {
            text: "Intereses",
            style: {
              color: "#FEB019"
            }
          }
        }
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40
      }
    };
    this.ngxService.stop();
  }


  async getCountPrestamos() {
    this.counts = {};
    this.counts.pendientes = await this.prestamosService.getCountPrestamosEstado('Pendiente', this.fecha_inicio, this.fecha_fin);
    this.counts.aprobados = await this.prestamosService.getCountPrestamosEstado('Aprobado', this.fecha_inicio, this.fecha_fin);
    this.counts.acreditados = await this.prestamosService.getCountPrestamosEstado('Acreditado', this.fecha_inicio, this.fecha_fin);
    this.counts.cancelados = await this.prestamosService.getCountPrestamosEstado('Cancelado', this.fecha_inicio, this.fecha_fin);
    this.counts.anulados = await this.prestamosService.getCountPrestamosEstado('Anulado', this.fecha_inicio, this.fecha_fin);
  }

}
