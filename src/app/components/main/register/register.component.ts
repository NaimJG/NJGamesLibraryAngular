import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Usuario } from "../../../models/usuarios.model";
import Swal from 'sweetalert2';
import { UsuariosService } from "../../../services/usuarios.service";
import { catchError, throwError } from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  errorNombre: string = "";
  errorEmail: string = "";
  errorPassword: string = "";
  errorRePassword: string = "";

  formularioReactivo: FormGroup;
  regexPass: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/
  constructor(
    private router: Router,

    formBuilder: FormBuilder,
    private usuarioService: UsuariosService,
  ){
    this.formularioReactivo = formBuilder.group({
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.compose([Validators.required, Validators.pattern(this.regexPass), Validators.minLength(6)])],
      password2: ["", Validators.compose([Validators.required])]
    })
  }

  validarNombre(error: ValidationErrors | null){
    if (error) {
      if (error["required"]){
        this.errorNombre = "Este campo es obligatorio"
        console.log(this.errorNombre)
      } else if (error["minlength"] || error["maxlength"]) {
        this.errorNombre = "Debe tener entre 2 y 15 caracteres"
      }
    } else {
      this.errorNombre = "";
    }
  }

  validarEmail(error: ValidationErrors | null){
    if (error) {
      if (error["required"]){
        this.errorEmail = "Este campo es obligatorio"
        console.log(this.errorEmail)
      } else if (error["email"]) {
        this.errorEmail = "Ingrese un email válido"
      }
    } else {
      this.errorEmail = "";
    }
  }

  validarPassword(error: ValidationErrors | null){
    if (error) {
      if (error["required"]){
        this.errorPassword = "Este campo es obligatorio"
        console.log(this.errorPassword)
      } else if (error["minlength"]) {
        this.errorPassword = "La contraseña debe tener mínimo 6 caracteres"
      } else if (error["pattern"]) {
        this.errorPassword = "Debe contener al menos un núm, una letra mín. y una letra may."
      }
    } else {
      this.errorPassword = "";
    }
  }

  validarPassword2(error: ValidationErrors | null): boolean{
    let bandera = false;
    if (error) {
      if (error["required"]){
        this.errorRePassword = "Este campo es obligatorio"
        console.log(this.errorRePassword)
      }
    } else if ( this.formularioReactivo.value.password != this.formularioReactivo.value.password2 ) {
      this.errorRePassword = "Las contraseñas deben coincidir"
    } else {
      this.errorRePassword = "";
      bandera = true;
    }
    return bandera
  }
  onSubmit() {

    this.validarNombre(this.formularioReactivo.controls["nombre"].errors)

    this.validarEmail(this.formularioReactivo.controls["email"].errors)

    this.validarPassword(this.formularioReactivo.controls["password"].errors)

    this.validarPassword2(this.formularioReactivo.controls["password2"].errors)

    if (!this.formularioReactivo.invalid && this.validarPassword2(this.formularioReactivo.controls["password2"].errors)) {

      let usuario: Usuario = new Usuario(this.formularioReactivo.value.nombre, this.formularioReactivo.value.email, this.formularioReactivo.value.password)

      this.usuarioService.register(usuario).pipe(catchError((error) => {
        if (error.status === 500){
          this.errorNombre = "El nombre de usuario ya existe"
        } else {
          this.errorEmail = "El email ya tiene un usuario registrado"
        }
          return throwError(error);
        })
      ).subscribe(() => {
        Swal.fire({
          title: 'Te has registrado exitosamente!',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Iniciar Sesion',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(["/login"])
          } else if (result.isDenied || result.isDismissed) {
            this.formularioReactivo.reset()
          }
        })
      })
    }
  }
}

