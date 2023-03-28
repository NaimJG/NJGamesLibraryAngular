// Este es el modelo que indica la estructura principal de mi objeto Usuario

export class Usuario {
  idUsuario?: number;
  nombre: string;
  password: string;
  email?: string;


  constructor(nombre: string, email: string, password: string) {
    this.nombre = nombre;
    this.email = email;
    this.password = password;
  }

}
