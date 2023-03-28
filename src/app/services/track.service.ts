// Este servicio se encarga de manejar la funcionalidad de los carruseles en los componentes que lo requieren

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  contenedor: any;
  btnleft: any;
  btnrgt: any;

  trackFunction(){
    this.contenedor = document.querySelectorAll(".slick-list")
    this.btnleft = document.querySelectorAll(".buttonlft")
    this.btnrgt = document.querySelectorAll(".buttonrgt")

    this.contenedor.forEach( (item: HTMLElement, i: number) => {
      let contenedorDimensiones = item.getBoundingClientRect();
      let contenedorWidth = contenedorDimensiones.width;
      let cardWidth = contenedorWidth / 3;

      this.btnleft[i].addEventListener("click", () => {
        let posicionActual = item.scrollLeft;
        let targetActual = posicionActual - cardWidth;
        item.scrollTo({left: targetActual, behavior: 'smooth'})
      })

      this.btnrgt[i].addEventListener("click", () => {
        let posicionActual = item.scrollLeft;
        let targetActual = posicionActual + cardWidth;
        item.scrollTo({left: targetActual, behavior: 'smooth'})
      })

    })

  }
  constructor() { }
}
