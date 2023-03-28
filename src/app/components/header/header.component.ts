import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { VideojuegoService } from "../../services/videojuego.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{
  show = false;
  showBarraBusqueda = false;
  sesionIniciada = false;
  ruta1 = "/home"
  ruta2= "/generos"
  ruta3= "/consolas"
  ruta4= "/ranking"
  ruta5= "/favoritos"
  ruta6= "/cuenta"
  constructor(
    private router: Router,
    private videojuegoService: VideojuegoService
  ) {
  }
  ngOnInit() {
    console.log(this.router.url)
    if ( this.router.url == this.ruta1 || this.router.url == this.ruta2 || this.router.url == this.ruta3 || this.router.url == this.ruta4 || this.router.url == this.ruta5 || this.router.url == this.ruta6) {
      this.show = !this.show
    }
    if ( this.router.url == this.ruta1 ) {
      this.showBarraBusqueda = !this.showBarraBusqueda
    }

    if ( sessionStorage.getItem('sesion') == 'true' ){
      this.sesionIniciada = !this.sesionIniciada;
    }
  }

  onKeyUp(value){
    this.videojuegoService.filtrarVideojuegos(value.target.value)
  }
  cerrarSesion(){
    Swal.fire({
      title: 'Quieres Cerrar Sesion?',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Sesión Cerrada',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        }).then( () => {
          if (Swal.DismissReason.timer){
            sessionStorage.clear();
            this.router.navigate(["/"])
          }
        })

      }
    })
  }

}
