import {Component, HostListener} from '@angular/core';
@Component({
  selector: 'app-btn-up',
  templateUrl: './btn-up.component.html',
  styleUrls: ['./btn-up.component.css']
})
export class BtnUpComponent {

  windowScrolled: boolean;
  // ---------- Botón para subir -------------
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.scrollY || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }
  scrollToTop() {
    (function smoothscroll() {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 10));
      }
    })();
  }
}
