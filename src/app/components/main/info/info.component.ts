import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  cuerpoForm = {
    nombre: '',
    email: '',
    mensaje: ''
  }

  constructor(public router: Router) {
  }

  sendEmail(e: Event) {
    emailjs.sendForm('service_8z75ppj', 'contact_form', e.target as HTMLFormElement, 'qc1HBdtGA2OQjcykJ')
      .then((result: EmailJSResponseStatus) => {
        console.log(result.text);
        Swal.fire({
          title: '¡Gracias por comunicarte con nosotros!',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 2000
        }).then( () => {
          if (Swal.DismissReason.timer){
            this.router.navigate(['/'])
          }
        })
      }, (error) => {
        console.log(error.text);
      });
  }

}
