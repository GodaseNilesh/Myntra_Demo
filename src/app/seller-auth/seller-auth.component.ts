import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import {Router} from '@angular/router'
import { SignUp } from '../data-types';
@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent {
  constructor(private seller: SellerService, private router:Router) {}
  showLogin=false
  authError:string=''
  // constructor(private seller:SellerService ){}
  
  ngOnInit(): void {
      this.seller.reloadSeller()
  }
  signUp(data: SignUp) {
    this.seller.userSignUp(data)
    console.warn(data)

  }
  login(data: SignUp) {
    this.authError=''
    this.seller.userLogin(data)
    this.seller.isLoginError.subscribe((isError)=>{
      if(isError){
          this.authError="Email or password is not correct"
      }
    })
    // console.warn(data)
  }
  openLogin(){
    this.showLogin=true
  }
  openSignUp(){
    this.showLogin=false
  }
}
