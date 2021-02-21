import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './css/thumbnails.css']
})
export class AppComponent {
  sidebarIsToggled = false;
  toggleSidebarEvent(): void {
    this.sidebarIsToggled = !this.sidebarIsToggled;
  }
}
