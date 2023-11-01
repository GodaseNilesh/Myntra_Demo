import { Component } from '@angular/core';
import { SignUp, profile } from '../../data-types';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrls: ['./user-profile-details.component.css']
})
export class UserProfileDetailsComponent {

  name:string='Nilesh Mohan Godase';
  userData:profile | any; 
  userOption:string='viewProfile';
  clicked:boolean=false;
  sellerData:any;

  constructor(private router:Router,private user:UserService){

  }

  ngOnInit(): void {
    this.reload();
  }

  reload(){
    if (sessionStorage.getItem('user')) {
      let sellerStore = sessionStorage.getItem('user');
      this.sellerData = sellerStore && JSON.parse(sellerStore);
      this.user.getUserProfile().subscribe((result:any)=>{
        for(let item of result){
        if(this.sellerData.id==item.userid){
          this.userData=item;
          console.log("data matched");
        }else{
          console.log("not matched");
        }
      }
      })
    }
  }

  openMyOrders(){
    this.router.navigate(['user/my-orders']);
  }
  openCartPage(){
    this.router.navigate(['user/cart-page'])
  }
  updateProfileDetails(data:profile){
    data.userid=this.sellerData.id;
    data.id=this.userData.id;
    this.user.updateUserProfile(data).subscribe((result)=>{
      console.log(result);
    })
    setTimeout(() => {
      this.reload();
      this.userOption='viewProfile';
    }, 100);
  }

  createProfile(data:any){
    data.userid=this.sellerData.id;
    console.log(data);
    this.user.createUserProfile(data).subscribe((result)=>{
      console.log(result);
    })
    this.reload();
    this.userOption='viewProfile';
  }

  changeAddress(data:any,data1:any){
    data1.address1=data.address1;
    data1.address2=data.address2;
    data1.address3=data.address3;
    this.user.updateUserProfile(data1).subscribe((result)=>{
      console.log(result);
    })
    setTimeout(() => {
      this.reload();
      this.userOption='viewProfile';
    }, 100);
  }
}
