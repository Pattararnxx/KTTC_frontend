import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NavbarComponent} from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
