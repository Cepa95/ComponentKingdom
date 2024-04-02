import { Component, ElementRef, HostListener, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { BasketItem } from '../../shared/models/basket';
import { AccountService } from '../../account/account.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements AfterViewInit {
  navbarOpen = false;
  @ViewChild('navbar') navbar: ElementRef | undefined;

  constructor(public basketService: BasketService, public accountService: AccountService, private jwtHelper: JwtHelperService, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event) => {
      if (!this.navbar?.nativeElement.contains(event.target)) {
        this.closeNavbar();
      }
    });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  closeNavbar() {
    if (this.navbarOpen) {
      this.navbarOpen = false;
    }
  }

  getCount(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roles = decodedToken.role as Array<string>;
      return roles && roles.includes('Admin');
    }
    return false;
  }
}