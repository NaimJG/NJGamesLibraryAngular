import { Component, Input, OnInit, Output } from '@angular/core';
import { VideojuegoService } from "../../../../services/videojuego.service";
import { Videojuego } from "../../../../models/videojuego.model";
import 'slick-carousel';
import { DetallesService } from "../../../../services/detalles.service";

@Component({
  selector: 'app-playstation',
  templateUrl: './playstation.component.html',
  styleUrls: ['./playstation.component.css']
})
export class PlaystationComponent implements OnInit{
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  videojuegos: Videojuego[] = [];

  @Output() videogameChosen: Videojuego;

  @Output() showVideogameDetail: boolean;
  constructor(
    public detalleService: DetallesService,
    private videojuegoService: VideojuegoService
  ) {
    this.showVideogameDetail = detalleService.showVideogameDetail
    this.videogameChosen = detalleService.getVideogameChosen
  }
  ngOnInit(): void {
    this.videojuegoService.getAllVideogames().subscribe(data => {
      this.videojuegos = data;
      let filteredGames = this.videojuegos.filter( data => data.consola == 'PlayStation 5')
      this.videojuegos = filteredGames
      console.log(this.videojuegos)
    })
  }

  cambiarValor() {
    this.showVideogameDetail = !this.showVideogameDetail;
    this.detalleService.setShowVideogameDetail = this.showVideogameDetail;
  }
  onShowDetail(id: number) {
    this.videojuegoService.getVideogamesById(id).subscribe(data => {
      let listaDeUsuarios = data.usuarioList;
      console.log(listaDeUsuarios)
      let bandera = listaDeUsuarios.find(
        usuario => usuario.nombre === sessionStorage.getItem('nombre')
      )
      if( bandera ){
        this.detalleService.setBtnFav = true;
      } else {
        this.detalleService.setBtnFav = false;
      }
      console.log(data)
      this.cambiarValor();
      console.log(this.showVideogameDetail)
      this.detalleService.setVideogameChosen = data;
      let fecha = new Date(data.anio_lanzamiento)
      let mes = this.meses[fecha.getMonth()];
      let dia = fecha.getDate()+1;
      let anio = fecha.getFullYear();
      this.detalleService.videogameChosen.anio_lanzamiento = `${dia} de ${mes} de ${anio}`;
    })
  }

}
