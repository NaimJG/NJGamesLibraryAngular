import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Usuario } from "../../../models/usuarios.model";
import { UsuariosService } from "../../../services/usuarios.service";
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
import {catchError, throwError} from "rxjs";

@Component({
  selector: 'app-loggin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  usuario: Usuario;
  errorNombre: string = "";
  errorPassword: string = "";
  formularioReactivo: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    public usuarioService: UsuariosService
  ){
    this.formularioReactivo = formBuilder.group({
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(6)])]
    })
  }

  OnSubmit(){
    if (!this.formularioReactivo.invalid){
      this.usuario = {
        nombre: this.formularioReactivo.value.nombre,
        password: this.formularioReactivo.value.password
      }
      console.log(this.usuario)
      this.usuarioService.login(this.usuario).pipe(catchError((error) => {
        if (error.status === 404){
          // Accion a realizar en caso de credenciales incorrectas
          this.errorNombre = "La clave o el usuario son incorrectos"
          this.errorPassword = "La clave o el usuario son incorrectos"
        }
        return throwError(error);
      })
      ).subscribe((response) => {
        console.log(response)
        sessionStorage.setItem('sesion', 'true')
        sessionStorage.setItem('nombre', response.nombre)
        sessionStorage.setItem('email', response.email)
        sessionStorage.setItem('password', response.password)
        Swal.fire({
          title: 'Inicio de Sesion Exitoso!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1350
        }).then( () => {
          if (Swal.DismissReason.timer) {
            this.router.navigate(['/home'])
          }
        }
        )
      });
    }
  }

}
