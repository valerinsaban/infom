import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { RolesService } from 'src/app/services/seguridad/roles.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {

  rolForm: FormGroup;
  roles: any = [];
  rol: any;

  constructor(
    private alert: AlertService,
    private roleService: RolesService){
        this.rolForm = new FormGroup({
        nombreRol: new FormControl(null, [Validators.required])
      });
    }
}
