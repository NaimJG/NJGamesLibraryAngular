import { Component, OnInit } from '@angular/core';
import { VideojuegoService } from "../../../services/videojuego.service";
import { Videojuego } from "../../../models/videojuego.model";
import { Observable } from "rxjs";
import { UsuariosService } from "../../../services/usuarios.service";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { Usuario } from "../../../models/usuarios.model";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit{
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  btnFav = false;
  showVideogameDetail = false;
  videojuegos: Videojuego[] = [];
  videojuegos$: Observable<any>;
  videojuegosFavoritos: Videojuego[] = [];
  videogameChosen: Videojuego = {
    id: 0,
    nombre: '',
    descripcion: '',
    anio_lanzamiento: '',
    consola: '',
    genero: '',
    empresa: '',
    imagen: '',
    usuarioList: [],
    video: ''
  }

  constructor(
    private router: Router,
    private videojuegoService: VideojuegoService,
    private usuarioService: UsuariosService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.videojuegoService.getAllVideogames().subscribe(data => {
      this.videojuegos = data;
      this.videojuegosFavoritos = this.videojuegos.filter( (videojuego) => videojuego.usuarioList.find( (usuario: Usuario) => usuario.nombre == sessionStorage.getItem('nombre')) )
      this.videojuegoService.setVideogamesList(this.videojuegosFavoritos);
      console.log(this.videojuegoService.videojuegos)

      this.videojuegoService.filtrarVideojuegos('');
      this.videojuegos$ = this.videojuegoService.videojuegosFiltrados$;
    });
  }

  toggleVideogameDetail() {
    this.showVideogameDetail = !this.showVideogameDetail
  }

  // ----------- BOTON VER DETALLE ---------------
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
      let video = this.getSafeVideoUrl(this.videogameChosen.video)
      this.videogameChosen.video = video;
      let fecha = new Date(data.anio_lanzamiento)
      let mes = this.meses[fecha.getMonth()];
      let dia = fecha.getDate()+1;
      let anio = fecha.getFullYear();
      this.videogameChosen.anio_lanzamiento = `${dia} de ${mes} de ${anio}`;
      // this.videogameChosen.anio_lanzamiento = new Date(data.anio_lanzamiento).toLocalDateString().replaceAll('/', ' de ')
    })
  }

  // ------------- BOTON ELIMINAR DE FAVORITOS ---------------
  onDeleteFav(id: number){
    let index = this.videojuegoService.videojuegos.findIndex( (videojuego) => videojuego.id == id)
    console.log(index)
    Swal.fire({
      title: '¿Seguro que desea eliminar este juego de sus favoritos?',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.videojuegoService.videojuegos.findIndex( (videojuego) => videojuego.id == id)
        this.videojuegoService.actualizarComponente(index);
        this.videojuegoService.getVideogamesById(id).subscribe( (videojuego: Videojuego) => {
          this.usuarioService.quitarFavorito(sessionStorage.getItem('nombre'), videojuego.id).subscribe()
          Swal.fire({
            title: 'Juego eliminado de tu lista',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
        })
      }
    })
  }

  // --------------- BOTONES DEL DETALLE -----------------
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
        let index = this.videojuegoService.videojuegos.findIndex( (videojuego) => videojuego.id == id)
        this.videojuegoService.actualizarComponente(index);
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

  getSafeVideoUrl(video): string {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video) as string;
  }

}
