import {Component, OnInit} from '@angular/core';
import {DetallesService} from "../../../services/detalles.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  constructor( public detalleService: DetallesService ) {

  }

  showVideogameDetail: boolean;
  sesionIniciada = false;
  ngOnInit(){
    if (sessionStorage.getItem('sesion') == 'true'){
      this.sesionIniciada = !this.sesionIniciada;
    }
    this.showVideogameDetail = false;
  }

  cambiarValor() {
    this.detalleService.setShowVideogameDetail = this.showVideogameDetail;
  }

}
