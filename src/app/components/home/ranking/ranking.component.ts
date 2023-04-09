import { Component, OnInit } from '@angular/core';
import { Videojuego } from "../../../models/videojuego.model";
import { Router } from "@angular/router";
import { VideojuegoService } from "../../../services/videojuego.service";
import { UsuariosService } from "../../../services/usuarios.service";
import Swal from "sweetalert2";
import { Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent  implements OnInit{
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  btnFav = false;
  showVideogameDetail = false;
  videojuegos: Videojuego[] = [];
  videojuegosRanking: Videojuego[] = [];

  rankingOption: String = "Todos";
  rankingGenero: String = "Todos";

  rankingConsolas: String = "Todos";

  videojuegos$: Observable<any>;
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

      this.videojuegosRanking = this.videojuegos.filter( (videojuego) => videojuego.usuarioList.length != 0 );

      // Ordenando de mayor a menor de acuerdo al length de la lista de usuarios
      this.videojuegosRanking.sort((videojuego1, videojuego2) => videojuego2.usuarioList.length - videojuego1.usuarioList.length);

      this.videojuegoService.setVideogamesList(this.videojuegosRanking);

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

  // ------------------ Filtros ---------------------
  public updateVideojuegosTop$(): void {
    switch (this.rankingOption) {
      case "Todos":
        this.videojuegos$ = this.videojuegoService.videojuegosFiltrados$;
        break;
      case "Top 3":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegos(3);
        break;
      case "Top 5":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegos(5);
        break;
      case "Top 10":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegos(10);
        break;
    }
  }

  public updateVideojuegosGenero$(): void {
    switch (this.rankingGenero) {
      case "Todos":
        this.videojuegos$ = this.videojuegoService.videojuegosFiltrados$;
        break;
      case "Accion":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosGenero("Accion");
        break;
      case "Aventura":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosGenero("Aventura");
        break;
      case "Plataformas":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosGenero("Plataformas");
        break;
      case "Estrategia":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosGenero("Estrategia");
        break;
      case "Shooter":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosGenero("Shooter");
        break;
      case "Deportes":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosGenero("Deportes");
        break;
    }
  }

  public updateVideojuegosConsolas$(): void {
    switch (this.rankingConsolas) {
      case "Todos":
        this.videojuegos$ = this.videojuegoService.videojuegosFiltrados$;
        break;
      case "Nintendo Switch":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosConsola("Nintendo Switch");
        break;
      case "PlayStation 5":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosConsola("PlayStation 5");
        break;
      case "XBOX One":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosConsola("XBOX One");
        break;
      case "Microsoft":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosConsola("Microsoft");
        break;
      case "Mac OS":
        this.videojuegos$ = this.videojuegoService.getTopVideojuegosConsola("Mac OS");
        break;
    }
  }

  getSafeVideoUrl(video): string {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video) as string;
  }

}
