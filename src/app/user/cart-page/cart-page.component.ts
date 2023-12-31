import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { cart, priceSummary, product } from '../../data-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export default class CartPageComponent {
  cartData: cart[] | undefined;
  productData: product[] | undefined;
  userOrder: cart[] | undefined;
  disabled: boolean = false;
  removeCart = false;
  errorMsg='';
  quantity: string | undefined;
  showProduct: cart | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };

  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.reload();
  }

  checkout() {
    this.cartData?.forEach(item=>{
      if(item.selected){
        this.router.navigate(['user/checkout']);
      }else{
        this.errorMsg='plz select atleast one product';
        setTimeout(() => {
          this.errorMsg='';
        }, 1000);
      }
    })
  }

  selectedProduct(cart: any,quantity:string) {
    cart.quantity=quantity;
    this.product.selectedOrder(cart).subscribe((result)=>{
      console.log(result);
      this.reload();
    })
  }


  reload() {
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;

      let price = 0;
      let discount=0;
      let charge=0;
      result.forEach((item: any) => {
        if (item.quantity && item.selected) {
          price = price + +item.price * +item.quantity;
          discount=discount+ +item.discount* +item.quantity;
          charge=100;
        }
      });
      this.priceSummary.price = price;
      this.priceSummary.discount = discount;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = charge;
      this.priceSummary.total =
        price + price / 10 + this.priceSummary.delivery - discount;
    });
    console.log(this.priceSummary);
  }
  
  removeToCart(productId: number | any) {
    if (!sessionStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);
    } else {
      let user = sessionStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
      console.warn(this.cartData);
      this.cartData &&
        this.product.removeToCart(productId).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
          }
        });
      this.removeCart = false;
    }
    this.reload();
  }
}
