import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, order, product } from '../data-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
// cartData: undefined | cart[]
totalPrice:number | undefined;
cartData:cart[]=[] ;
orderMsg:string | undefined;

companyData:product[]=[];
companyname:undefined | string;

  constructor(private product:ProductService, private router:Router){

  }

  ngOnInit(): void {
    //fetching data from cart and stored in cartdata
    this.product.currentCart().subscribe((result)=>{
      // this.cartData=result;
      let price=0;
      this.cartData=result;
      console.log("cartdata",this.cartData);

      result.forEach((item)=>{
        if(item.quantity){
        price=price+(+item.price*+item.quantity);
        }
      });
      this.totalPrice=price+(price/10)+100-(price/10);
      console.log(this.totalPrice);
      console.log(this.cartData);
    })
  }

  orderNow(data:{email:string,address:string,contact:string}){
     let user=sessionStorage.getItem('user');
     let userId=user && JSON.parse(user).id;
     if(this.totalPrice){
      let orderData:order={
        ...data,
        totalPrice:this.totalPrice,
        userId,
        id:undefined
      }
      this.cartData?.forEach((item)=>{
        setTimeout(() => {
         item.id && this.product.deleteCartItems(item.id);
        }, 800);
      })
      this.product.orderNow(orderData)
      .subscribe((result)=>{
        if(result){
          this.orderMsg="Your order has been placed.";
          setTimeout(() => {
            this.router.navigate(['/my-orders']);
            this.orderMsg=undefined;
          }, 2000);
        }
      })
     }



     //data updated after selling
     //access first object of an array
    for(let name of this.cartData){
    //  let name = this.cartData[0];
     this.companyname=name.companyname; 

     //fetch data from api with the help of company name
     this.product.productListByCompanyName(this.companyname).subscribe((result)=>{
       if(result){
         this.companyData=result;
         let item=this.companyData[0];
         console.log("item",item.quantity);
      
       if(name.quantity && item.quantity ){
           item.quantity=item.quantity-name.quantity;
       }
       console.log(item.quantity);
       this.product.updateProduct(item).subscribe((result)=>{
         console.log("product is updated");
       })
       // console.log("company data",this.companyData);
       }
     })
  }
}
}
