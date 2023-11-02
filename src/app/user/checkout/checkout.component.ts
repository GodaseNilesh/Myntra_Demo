import { Component, numberAttribute } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { cart, order, product, profile } from '../../data-types';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
declare var Razorpay: any;


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  // cartData: undefined | cart[]
  totalPrice: number =0;
  quantity: string | any;
  cartData: cart[] = [];
  orderMsg: string | undefined;
  productId: number | undefined;

  companyData: product[] = [];
  companyname: undefined | string;
  userData: any;
  userInfo:any;
  

  constructor(private product: ProductService, private router: Router, private user:UserService) {}

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
      let discount=0;
      result.forEach((item: any) => {
        if (item.quantity && item.selected) {
          console.log(item);
          this.quantity = item.quantity;
          console.log('quantity', this.quantity);
          this.productId = item.productId;
          price = price + +item.price * +item.quantity;
          discount=discount+ +item.discount* +item.quantity;
        }
      });
      this.totalPrice = price + price / 10 + 100 - discount;
    });

    this.getUserInfo();
  }

  payNow(data: any){
    const options:any = {
      description:'Pay with RazorPay',
      currency:'INR',
      amount: this.totalPrice*100,
      name:data.name,
      key:'rzp_test_9TtROtl0eC1mcM',
      image:'https://yt3.googleusercontent.com/07PIDLZbBZRwRnaNnJBElu1waRQlLDL9k00q8UzYLufRTqDJhIbQzkjP1VR5axyxdz6PEld_Mwk=s900-c-k-c0x00ffffff-no-rj',
      prefill: {
        name:data.name,
        email:data.email,
        phone:data.mobile
      },
      theme:{
        color:'#6466e3'
      },
      modal: {
        condismiss: () => {
          console.log('dismissed');
        }
      }
    }

    options.handler = (response: any, error: any) => {
      if(response){
        this.orderNow(data)
      }
      console.log(response);
    };
    Razorpay.open(options);
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
            this.router.navigate(['user/my-orders']);
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

  getData(data:any){
    console.log(data);
    this.userInfo=data;

  }
  getUserInfo() {
    if (sessionStorage.getItem('user')) {
      let userStore = sessionStorage.getItem('user');
      this.userData = userStore && JSON.parse(userStore);
      
      this.user.getLoggedUserProfile(this.userData.id).subscribe((result:any)=>{
        this.userData=result[0];
      })
    }
  }
}
