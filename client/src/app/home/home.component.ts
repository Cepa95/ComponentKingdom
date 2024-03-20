import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  isImage: boolean | undefined;

  constructor(private router: Router) { }
  ngOnInit(): void {
    this.isImage = true;
  }

  setImage(value: boolean) {
    this.isImage = value;
  }

  onTypeSelected(typeId: number) {
    this.router.navigate(['/shop/type', typeId]);
  }
}
