import { Component } from '@angular/core';
import { SignUp, cart, login, product } from '../data-types';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {
showLogin:boolean=true;
authError:string='';

  constructor(private user:UserService,private product:ProductService){

  }

  ngOnInit(): void {
    this.user.userAuthReload();
  }
  signUp(data:SignUp){
    this.user.userSignUp(data);
  }
  login(data:login){
    // console.warn(data);
    this.user.userLogin(data);
    this.user.invalidUserAuth.subscribe((result)=>{
      // console.warn("apple",result)
      if(result){
        this.authError="Please enter valid details"
      }else{
        this.localCartToRemoteCart();        
      }
    })
  }

  openLogin(){
    this.showLogin=true;
  }
  openSignUp(){
    this.showLogin=false;
  }

  localCartToRemoteCart(){
    let data=sessionStorage.getItem('localCart');
    let user=sessionStorage.getItem('user');
    let userId=user && JSON.parse(user).id;
    if(data){
      let cartDataList:product[]=JSON.parse(data);
      // console.log(userId);
      cartDataList.forEach((product: product,index) => {
        let cartData:cart={
          ...product,
          productId:product.id,
          userId
        };
        delete cartData.id;
       setTimeout(() => {
        this.product.addToCart (cartData).subscribe((result)=>{
          if(result){
            console.log("item stored");
          }
      })
      if(cartDataList.length===index+1){
        sessionStorage.removeItem('localCart');
      }
       }, 500);
      });
    }
    setTimeout(() => {
      this.product.getCartList(userId);
    }, 2000);
  }
}
