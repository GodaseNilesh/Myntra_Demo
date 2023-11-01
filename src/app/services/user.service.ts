import { EventEmitter, Injectable } from '@angular/core';
import { SignUp, login, profile } from '../data-types';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}

  getAllUserData() {
    return this.http.get<SignUp[]>('http://localhost:3000/users');
  }

  //update user data
  updateUserProfile(data: profile) {
    return this.http.put(`http://localhost:3000/profile/${data.id}`, data);
  }

  createUserProfile(data: profile) {
    return this.http.post(`http://localhost:3000/profile`,data)
  }


  getLoggedUserProfile(userid:number){
    return this.http.get(`http://localhost:3000/profile?userid=${userid}`)
  }

  getUserProfile(){
    return this.http.get(`http://localhost:3000/profile`);
  }

  userSignUp(user: SignUp) {
    return this.http.post('http://localhost:3000/users', user, {
      observe: 'response',
    });
    // .subscribe((result)=>{
    //   if(result){
    //     sessionStorage.setItem('user',JSON.stringify(result.body))
    //     this.router.navigate(['/'])
    //   }
    // })
  }

  userLogin(data: login) {
    this.http
      .get<SignUp[]>(
        `http://localhost:3000/users?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe((result) => {
        if (result && result.body?.length) {
          sessionStorage.setItem('user', JSON.stringify(result.body[0]));
          this.invalidUserAuth.emit(false);
          this.router.navigate(['/']);
        } else {
          this.invalidUserAuth.emit(true);
        }
      });
    let userData = sessionStorage.getItem('user');
    console.log(userData);
  }

  userAuthReload() {
    if (sessionStorage.getItem('user')) {
      this.router.navigate(['admin/']);
    }
  }
}
