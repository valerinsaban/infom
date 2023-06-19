import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import decode from 'jwt-decode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  static usuario: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    AppComponent.loadScript('assets/js/deznav-init.js');
    AppComponent.loadScript('assets/js/custom.js');
    AppComponent.loadScript('assets/js/demo.js');

    let token: any = sessionStorage.getItem('token');
    if (token) {
      let usuario: any = decode(token);
      if (usuario) {
        HomeComponent.usuario = usuario;     
        return;   
      }
    }
    this.router.navigate(['login']);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['login'])
  }

}
