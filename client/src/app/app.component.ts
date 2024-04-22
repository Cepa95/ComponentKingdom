import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Webshop';
  scrollPercent = 0;

  constructor(
    private basketService: BasketService,
    private accountService: AccountService,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollPercent = 0;
      }
    });
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) this.basketService.getBasket(basketId);
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.ngZone.runOutsideAngular(() => {
      const winScroll = window.scrollY || 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      this.ngZone.run(() => {
        this.scrollPercent = (winScroll / height) * 100;
      });
    });
  }
}
