// Este es el modelo que indica la estructura principal de mi objeto Videojuego

export interface Videojuego {
  id: number;
  nombre: string;
  anio_lanzamiento: string;
  descripcion: string;
  genero: string;
  empresa: string;
  consola: string;
  imagen: string;
  usuarioList: any;

}
