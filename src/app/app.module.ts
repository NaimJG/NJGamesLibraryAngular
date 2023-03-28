import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { InfoComponent } from './components/main/info/info.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/main/login/login.component';
import { RegisterComponent } from './components/main/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { GenerosComponent } from './components/home/generos/generos.component';
import { SidebarComponent } from './components/home/sidebar/sidebar.component';
import { ConsolasComponent } from './components/home/consolas/consolas.component';
import { RankingComponent } from './components/home/ranking/ranking.component';
import { FavoritosComponent } from './components/home/favoritos/favoritos.component';
import { VideojuegoComponent } from './components/videojuego/videojuego.component';
import { AccionComponent } from './components/home/generos/accion/accion.component';
import { PlataformasComponent } from './components/home/generos/plataformas/plataformas.component';
import { AventuraComponent } from './components/home/generos/aventura/aventura.component';
import { ShooterComponent } from './components/home/generos/shooter/shooter.component';
import { EstrategiaComponent } from './components/home/generos/estrategia/estrategia.component';
import { DeportesComponent } from './components/home/generos/deportes/deportes.component';
import { BtnUpComponent } from './components/home/btn-up/btn-up.component';
import { NintendoComponent } from './components/home/consolas/nintendo/nintendo.component';
import { XboxComponent } from './components/home/consolas/xbox/xbox.component';
import { PlaystationComponent } from './components/home/consolas/playstation/playstation.component';
import { MacosComponent } from './components/home/consolas/macos/macos.component';
import { MicrosoftComponent } from './components/home/consolas/microsoft/microsoft.component';
import { CuentaComponent } from './components/home/cuenta/cuenta.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    InfoComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    GenerosComponent,
    SidebarComponent,
    ConsolasComponent,
    RankingComponent,
    FavoritosComponent,
    VideojuegoComponent,
    AccionComponent,
    PlataformasComponent,
    AventuraComponent,
    ShooterComponent,
    EstrategiaComponent,
    DeportesComponent,
    BtnUpComponent,
    NintendoComponent,
    XboxComponent,
    PlaystationComponent,
    MacosComponent,
    MicrosoftComponent,
    CuentaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
