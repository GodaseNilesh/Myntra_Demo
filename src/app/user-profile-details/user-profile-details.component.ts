import { Component } from '@angular/core';
import { SignUp, profile } from '../data-types';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrls: ['./user-profile-details.component.css']
})
export class UserProfileDetailsComponent {

  name:string='Nilesh Mohan Godase';
  userData:any| undefined; 
  userOption:string='viewProfile';
  clicked:boolean=false;

  constructor(private router:Router,private user:UserService){

  }

  ngOnInit(): void {
    this.reload();
  }
  reload(){
    if (sessionStorage.getItem('user')) {
      let sellerStore = sessionStorage.getItem('user');
      console.log(sellerStore);
      let sellerData = sellerStore && JSON.parse(sellerStore);
      console.log(sellerData.name);
      this.userData=sellerData;
      console.log(this.userData);
    }
  }

  openProfileUpdate(){
    this.userOption='updateProfile';
    this.clicked=true;
  }
  openViewProfile(){
    this.userOption='viewProfile';
    this.clicked=true;
  }
  openMyOrders(){
    this.router.navigate(['my-orders']);
  }
  openCartPage(){
    this.router.navigate(['cart-page'])
  }
  updateProfileDetails(data:profile){
    data.id=this.userData.id;
    data.password=this.userData.password;
    this.user.updateUserProfile(data).subscribe((result:any)=>{
      if(result.length){
        console.log("data updated");
      }else{
        console.log("not data updated");
      }
    })
    this.reload();
    this.userOption='viewProfile';
    window.location.reload();
  }
}
