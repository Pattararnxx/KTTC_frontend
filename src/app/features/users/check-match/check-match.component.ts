import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-check-match',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './check-match.component.html',
  styleUrl: './check-match.component.css'
})
export class CheckMatchComponent {
  categories = ['ชายเดี่ยวทั่วไป', 'หญิงเดี่ยวทั่วไป', 'ชายเดี่ยว 40 ปี', 'หญิงเดี่ยว 40 ปี'];
  groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  fg = new FormGroup({
    category: new FormControl(''),
    group: new FormControl(''),
    round: new FormControl(''),
  })
}
