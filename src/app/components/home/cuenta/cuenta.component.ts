import { Component, OnInit } from '@angular/core';
import { Usuario } from "../../../models/usuarios.model";
import Swal from "sweetalert2";
import { UsuariosService } from "../../../services/usuarios.service";
import { Router } from "@angular/router";
import {catchError, throwError} from "rxjs";

@Component({
  selector: 'app-perfil',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  editando: boolean = false;
  usuario: Usuario = {
    nombre: sessionStorage.getItem('nombre'),
    password: sessionStorage.getItem('password'),
    email: sessionStorage.getItem('email')
  }

  usuarioActualizado: Usuario;

  constructor(
    private usuarioService: UsuariosService,
    private router: Router

  ) {
  }

  ngOnInit(){

  }

  onEdit(){
    this.editando = !this.editando;
  }
  onSave(value: any){
    console.log(value)
    this.usuarioService.update(sessionStorage.getItem('nombre'), value).pipe(catchError((error) => {
      if (error.status === 400){
        Swal.fire({
          title: 'Algunas credenciales corresponden a un usuario ya existente',
          icon: 'error',
          showConfirmButton: false,
          timer: 2000
        })
      }
      return throwError(error);
    })).subscribe((response: Usuario) => {
      console.log(response)
      sessionStorage.setItem('nombre', response.nombre)
      sessionStorage.setItem('email', response.email)
      sessionStorage.setItem('password', response.password);
      Swal.fire({
        title: 'Datos actualizados correctamente',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
      }).then( () => {
        if (Swal.DismissReason.timer) {
        this.editando = !this.editando;
        }
      })
    })
  }

  onCancel(){
    this.editando = !this.editando;
    this.usuario = {
      nombre: sessionStorage.getItem('nombre'),
      password: sessionStorage.getItem('password'),
      email: sessionStorage.getItem('email')
    }
  }

  onDelete(){
    Swal.fire({
      title: '¿Seguro que desea eliminar su cuenta?',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(sessionStorage.getItem('nombre')).subscribe( (result) => console.log(result)
        )
        Swal.fire({
          title: 'Usuario Eliminado',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        }).then( () => {
          if (Swal.DismissReason.timer) {
            sessionStorage.clear();
            this.router.navigate(["/"])
          }
        })
      }
    })
  }

}
