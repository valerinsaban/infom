import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor() {
    AppComponent.loadScript("assets/vendor/global/global.min.js")

    AppComponent.loadScript("assets/vendor/chart.js/Chart.bundle.min.js")
    AppComponent.loadScript("assets/vendor/apexchart/apexchart.js")
    AppComponent.loadScript("assets/js/dashboard/dashboard-1.js")
  }

}
