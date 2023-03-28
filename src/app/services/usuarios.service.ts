// Este servicio se encarga de manejar la conexión a la base de datos para manejar los datos de Usuario

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs"
import { Usuario } from "../models/usuarios.model";
import { Videojuego } from "../models/videojuego.model";

@Injectable({
  providedIn: "root"
})
export class UsuariosService {


  private getHttpOptions(){
    return {
      headers: new HttpHeaders(
        {
          'content-type': 'application/json'
        },
        )
    };
  }
  private apiUrl = "http://localhost:8080/usuarios";
  constructor(private http: HttpClient) {}

  login(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, usuario, this.getHttpOptions());
  }

  register(usuario: Usuario) {
    return this.http.post(`${this.apiUrl}/add`, usuario, this.getHttpOptions())
  }

  delete(nombre: String) {
    return this.http.delete(`${this.apiUrl}/delete/${nombre}`, this.getHttpOptions())
  }

  update(nombre: String, usuario: Usuario) {
    return this.http.patch(`${this.apiUrl}/update/${nombre}`, usuario, this.getHttpOptions())
  }

  agregarFavorito(nombre: String, videojuego: Videojuego){
    return this.http.post(`${this.apiUrl}/${nombre}/videojuego`, videojuego, this.getHttpOptions())
  }

  quitarFavorito(nombre: String, id: number){
    return this.http.delete(`${this.apiUrl}/${nombre}/delete/${id}`, this.getHttpOptions())
  }

}
