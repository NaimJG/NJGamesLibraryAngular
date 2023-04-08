// Este servicio se va a encargar de manejar la info detallada de cada videojuego

import { Injectable } from '@angular/core';
import { Videojuego } from "../models/videojuego.model";

@Injectable({
  providedIn: 'root'
})
export class DetallesService {

  // Contiene la bandera con la que se comunicará cada componente y el videojuego a mostrar
  public btnFav = false;

  public showVideogameDetail = false;

  public videogameChosen: Videojuego = {
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

  get getVideogameChosen(): Videojuego {
    return this.videogameChosen;
  }

  set setVideogameChosen(value: Videojuego) {
    this.videogameChosen = value;
  }

  get getShowVideogameDetail() {
    return this.showVideogameDetail;
  }

  set setShowVideogameDetail(valor: boolean) {
    this.showVideogameDetail = valor;
  }

  get getBtnFav() {
    return this.btnFav;
  }

  set setBtnFav(valor: boolean) {
    this.btnFav = valor;
  }

  constructor() {
  }

}
