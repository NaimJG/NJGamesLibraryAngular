import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Videojuego } from "../../models/videojuego.model";
import { Router } from "@angular/router";
import {VideojuegoService} from "../../services/videojuego.service";
@Component({
  selector: 'app-videojuego',
  templateUrl: './videojuego.component.html',
  styleUrls: ['./videojuego.component.css']
})
export class VideojuegoComponent implements OnInit {

  videojuegos: Videojuego[] = [];
  condicion: boolean = false;
  inRanking: boolean = true;
  inFavoritos: boolean = false;

  @Input() videojuego: Videojuego = {
    id: 0,
    nombre: '',
    anio_lanzamiento: '',
    descripcion: '',
    genero: '',
    empresa: '',
    consola: '',
    imagen: '',
    usuarioList: [],
    video: '',
  }

  constructor(
    public videojuegoService: VideojuegoService,
    public router: Router) {
  }

  @Output() showVideogame = new EventEmitter<number>();

  @Output() deleteFav = new EventEmitter<number>();
  onShowDetail() {
    this.showVideogame.emit(this.videojuego.id)
  }
  onDeleteFav(){
    this.deleteFav.emit(this.videojuego.id)
  }

  ngOnInit(){
    this.videojuegoService.getAllVideogames().subscribe( (data) => this.videojuegos = data )

    if (this.router.url == "/generos" || this.router.url == "/consolas"){
      this.condicion = true;
    }
    if ( this.router.url == "/favoritos" || this.router.url == "/ranking") {
      this.inFavoritos = !this.inFavoritos;
    }
    if ( this.router.url != "/ranking" ){
      this.inRanking = !this.inRanking
    }
  }

  getRankingPosition(videojuegos: Videojuego[]): number {
    // Ordenar la lista por la cantidad de usuarios
    const videojueosRankingList = videojuegos.sort((videojuego1, videojuego2) => videojuego2.usuarioList.length - videojuego1.usuarioList.length);

    // Encontrar la posición del videojuego actual en la lista
    const index = videojueosRankingList.findIndex( (videojuego) => videojuego.id === this.videojuego.id);

    // Devolver la posición + 1 para que empiece en 1 en lugar de 0
    return index + 1;
  }

}
