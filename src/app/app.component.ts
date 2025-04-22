import { Component } from '@angular/core';
import { AppLayoutComponent } from "../components/app-layout/app-layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
