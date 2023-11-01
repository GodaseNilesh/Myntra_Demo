import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { product } from '../../data-types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  menuType: String = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: undefined | product[];
  cartItems=0;

  constructor(private route: Router, private product: ProductService) {}
  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (sessionStorage.getItem('seller') && val.url.includes('seller')) {
          // console.log(val.url);
          let sellerStore = sessionStorage.getItem('seller');
          // console.log(sellerStore);
          let sellerData = sellerStore && JSON.parse(sellerStore);
          this.sellerName = sellerData.name;
          this.menuType = 'seller';

        } else if (sessionStorage.getItem('user')) {
          let userStore = sessionStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType = 'user';
          this.product.getCartList(userData.id);
        } else 
        {
          this.menuType = 'default';
        }
      }
    });
    
    let cartData=sessionStorage.getItem('localCart');
    if(cartData){
      this.cartItems=JSON.parse(cartData).length;
    }
    this.product.cartData.subscribe((items)=>{
      this.cartItems=items.length;
    })
  }
  logout() {
    sessionStorage.removeItem('seller');
    this.route.navigate(['admin/']);
  }
  userLogOut(){
    sessionStorage.removeItem('user');
    this.route.navigate(['user/user-auth'])
    this.product.cartData.emit([]);
  }
  

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProducts(element.value).subscribe((result) => {
        if (result.length > 5) result.length = 5;
        this.searchResult = result;
      });
    }
  }
  hideSearch() {
    this.searchResult = undefined;
  }
  submitSearch(val: string) {
    this.route.navigate([`/search/${val}`]);
  }
  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id]);
  }
}
