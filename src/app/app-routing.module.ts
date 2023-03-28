import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './components/main/info/info.component';
import { MainComponent } from "./components/main/main.component";
import { LoginComponent } from "./components/main/login/login.component";
import { RegisterComponent } from "./components/main/register/register.component";
import { HomeComponent } from "./components/home/home.component";
import { GenerosComponent } from "./components/home/generos/generos.component";
import { ConsolasComponent } from "./components/home/consolas/consolas.component";
import { RankingComponent } from "./components/home/ranking/ranking.component";
import { FavoritosComponent } from "./components/home/favoritos/favoritos.component";
import { CuentaComponent } from "./components/home/cuenta/cuenta.component";

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'info', component: InfoComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent},
  { path: 'generos', component: GenerosComponent},
  { path: 'consolas', component: ConsolasComponent},
  { path: 'ranking', component: RankingComponent},
  { path: 'favoritos', component: FavoritosComponent},
  { path: 'cuenta', component: CuentaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
