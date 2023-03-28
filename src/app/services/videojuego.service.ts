// Este servicio se encarga de manejar la conexión a la base de datos para manejar los datos de cada Videojuego

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Videojuego } from "../models/videojuego.model";
import {BehaviorSubject, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VideojuegoService {

  public videojuegos: Videojuego[] = [];

  private videojuegosFiltradosSubject = new BehaviorSubject(this.videojuegos);

  private apiUrl = "http://localhost:8080/videojuegos/all";

  constructor(
    private http: HttpClient
  ) {
  }

  getAllVideogames() {
    return this.http.get<Videojuego[]>(this.apiUrl)
  }

  getVideogamesById(id) {
    return this.http.get<Videojuego>(`${this.apiUrl}/${id}`)
  }

  setVideogamesList(data) {
    this.videojuegos = data
  }

  get videojuegosFiltrados$(){
    return this.videojuegosFiltradosSubject.asObservable()
  }

  filtrarVideojuegos(value: string) {
    const videojuegosFiltrados = this.videojuegos.filter(videojuego => {
      return videojuego.nombre.toLowerCase().includes(value.toLowerCase());
    });
    this.videojuegosFiltradosSubject.next(videojuegosFiltrados);
  }

  actualizarComponente(index: number) {
      this.videojuegos.splice(index, 1);
      this.videojuegosFiltradosSubject.next(this.videojuegos);
  }

  // ------------- Filtros del ranking -------------

  public getTopVideojuegos(numero: number): Observable<Videojuego[]> {
    return this.getAllVideogames().pipe(
      map(videojuegos => {
        return videojuegos.sort((videojuego1, videojuego2) => videojuego2.usuarioList.length - videojuego1.usuarioList.length).slice(0, numero);
      })
    );
  }

  public getTopVideojuegosGenero(genero: string): Observable<Videojuego[]>{
    return this.getAllVideogames().pipe(
      map(videojuegos => {
      return videojuegos.filter( videojuego => videojuego.genero == genero).sort( (videojuego1, videojuego2) => videojuego2.usuarioList.length - videojuego1.usuarioList.length)
      })
    )
  }

  public getTopVideojuegosConsola(consola: string): Observable<Videojuego[]>{
    return this.getAllVideogames().pipe(
      map(videojuegos => {
        return videojuegos.filter( videojuego => videojuego.consola == consola).sort( (videojuego1, videojuego2) => videojuego2.usuarioList.length - videojuego1.usuarioList.length)
      })
    )
  }

}
