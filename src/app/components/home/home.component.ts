import { Component, OnInit } from '@angular/core';
import { VideojuegoService } from "../../services/videojuego.service";
import { Videojuego } from "../../models/videojuego.model";
import { Observable } from "rxjs";
import { UsuariosService } from "../../services/usuarios.service";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  btnFav = false;
  showVideogameDetail = false;
  videojuegos$: Observable<any>;
  videojuegos: Videojuego[] = [];
  videogameChosen: Videojuego = {
    id: 0,
    nombre: '',
    descripcion: '',
    anio_lanzamiento: '',
    consola: '',
    genero: '',
    empresa: '',
    imagen: '',
    usuarioList: []
  }

  constructor(
    private router: Router,
    private videojuegoService: VideojuegoService,
    private usuarioService: UsuariosService
  ) {
  }

  ngOnInit(): void {
    this.videojuegoService.getAllVideogames().subscribe(data => {
      this.videojuegoService.setVideogamesList(data);
      this.videojuegos = this.videojuegoService.videojuegos;
      this.videojuegoService.filtrarVideojuegos('');
      this.videojuegos$ = this.videojuegoService.videojuegosFiltrados$;
    });
  }

  toggleVideogameDetail() {
    this.showVideogameDetail = !this.showVideogameDetail
  }
  onShowDetail(id: number) {
    console.log(id)
    this.videojuegoService.getVideogamesById(id).subscribe(data => {
      let listaDeUsuarios = data.usuarioList;
      console.log(listaDeUsuarios)
      let bandera = listaDeUsuarios.find(
        usuario => usuario.nombre === sessionStorage.getItem('nombre')
      )
      if ( bandera ) {
        this.btnFav = true;
      } else {
        this.btnFav = false;
      }
      this.toggleVideogameDetail();
      this.videogameChosen = data;
      let fecha = new Date(data.anio_lanzamiento)
      let mes = this.meses[fecha.getMonth()];
      let dia = fecha.getDate()+1;
      let anio = fecha.getFullYear();
      this.videogameChosen.anio_lanzamiento = `${dia} de ${mes} de ${anio}`;
    })
  }

  agregarFav(id: number){
    if (sessionStorage.getItem('sesion') == 'true') {
      this.btnFav = !this.btnFav;
      this.videojuegoService.getVideogamesById(id).subscribe( (videojuego: Videojuego) => {
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
          this.usuarioService.quitarFavorito(sessionStorage.getItem('nombre'), videojuego.id).subscribe()
          Swal.fire({
            title: 'Juego eliminado de tu lista',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then( () => {
            if (Swal.DismissReason.timer) {
              this.btnFav = !this.btnFav;
            }
          })
        })
      }
    })
  }

}
