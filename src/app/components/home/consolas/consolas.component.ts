import { Component, OnInit } from '@angular/core';
import { Videojuego } from "../../../models/videojuego.model";
import { DetallesService } from "../../../services/detalles.service";
import { VideojuegoService } from "../../../services/videojuego.service";
import { UsuariosService } from "../../../services/usuarios.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-consolas',
  templateUrl: './consolas.component.html',
  styleUrls: ['./consolas.component.css']
})
export class ConsolasComponent implements OnInit{

  btnFav: boolean;
  videogameChosen: Videojuego;

  showVideogameDetail: boolean;

  constructor(
    public videojuegoService: VideojuegoService,
    public detalleService: DetallesService,
    public usuarioService: UsuariosService,
    public router: Router
  ) {
    this.showVideogameDetail = detalleService.getShowVideogameDetail
    this.videogameChosen = detalleService.getVideogameChosen
    this.btnFav = detalleService.getBtnFav
  }

  cambiarValor() {
    this.detalleService.setShowVideogameDetail = this.showVideogameDetail;
  }

  ngOnInit(){
    this.showVideogameDetail = false;
  }

  agregarFav(id: number){
    if (sessionStorage.getItem('sesion') == 'true') {
      this.btnFav = true;
      this.detalleService.setBtnFav = true;
      this.videojuegoService.getVideogamesById(id).subscribe((videojuego: Videojuego) => {
        console.log(videojuego)
        console.log(sessionStorage.getItem('nombre'))
        this.usuarioService.agregarFavorito(sessionStorage.getItem('nombre'), videojuego).subscribe()
        console.log('Videojuego guardado')
      })
    } else {
      Swal.fire({
        title: 'Debes iniciar sesión para poder utilizar esta función',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Cancelar'
      }).then( (result) => {
        if ( result.isConfirmed ) {
          this.router.navigate(["/login"])
        }
      })
    }
  }

  quitarFav(id: number){
    Swal.fire({
      title: '¿Seguro que desea eliminar este juego de sus favoritos?',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.videojuegoService.getVideogamesById(id).subscribe( (videojuego: Videojuego) => {
          this.usuarioService.quitarFavorito(localStorage.getItem('nombre'), videojuego.id).subscribe()
          Swal.fire({
            title: 'Juego eliminado de tu lista',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then( () => {
            if (Swal.DismissReason.timer) {
              this.btnFav = false;
              this.detalleService.setBtnFav = false;
            }
          })
        })
      }
    })
  }

}
