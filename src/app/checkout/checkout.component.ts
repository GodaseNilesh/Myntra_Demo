import { Component, numberAttribute } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, order, product } from '../data-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  // cartData: undefined | cart[]
  totalPrice: number | undefined;
  quantity: string | any;
  cartData: cart[] = [];
  orderMsg: string | undefined;
  productId: number | undefined;

  companyData: product[] = [];
  companyname: undefined | string;
  userData: any;

  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    //fetching data from cart and stored in cartdata
    this.product.currentCart().subscribe((result: any) => {
      console.log(result);
      result.forEach((item: any) => {
        if (item.selected) {
          this.cartData.push(item);
          console.log(this.cartData);
        }
      });
      let price = 0;
      result.forEach((item: cart) => {
        if (item.quantity && item.selected) {
          this.quantity = item.quantity;
          console.log('quantity', this.quantity);
          this.productId = item.productId;
          price = price + +item.price * +item.quantity;
        }
      });
      this.totalPrice = price + price / 10 + 100 - price / 10;
    });

    this.getUserInfo();
  }

  orderNow(data: { email: string; address: string; contact: string }) {
    let user = sessionStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    if (this.totalPrice) {
      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        quantity: this.quantity,
        userId: userId,
        id: undefined,
        products: this.cartData,
      };

      console.log('orderdata', orderData);
      this.cartData?.forEach((item) => {
        setTimeout(() => {
          item.id && this.product.deleteCartItems(item.id);
        }, 800);
      });
      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = 'Your order has been placed.';
          setTimeout(() => {
            this.router.navigate(['/my-orders']);
            this.orderMsg = undefined;
          }, 2000);
        }
      });
    }

    //data updated after selling
    //access first object of an array
    for (let name of this.cartData) {
      //  let name = this.cartData[0];
      this.companyname = name.companyname;

      //fetch data from api with the help of company name for update product quantity after sold product
      this.product
        .productListByCompanyName(this.companyname)
        .subscribe((result) => {
          if (result) {
            this.companyData = result;
            let item = this.companyData[0];
            console.log('item', item.quantity);

            if (name.quantity && item.quantity) {
              item.quantity = item.quantity - name.quantity;
            }
            console.log(item.quantity);
            this.product.updateProduct(item).subscribe((result) => {
              console.log('product is updated');
            });
          }
        });
    }
  }
  getUserInfo() {
    if (sessionStorage.getItem('user')) {
      let userStore = sessionStorage.getItem('user');
      console.log(userStore);
      this.userData = userStore && JSON.parse(userStore);
    }
  }
}
