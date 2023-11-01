import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignUp, login } from '../data-types';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(data: SignUp) {
    let result = this.http
      .post('http://localhost:3000/seller', data, { observe: 'response' })
      .subscribe((result) => {
        this.isSellerLoggedIn.next(true);
        sessionStorage.setItem('seller', JSON.stringify(result.body));
        this.router.navigate(['seller/seller-home']);
      });
  }
  reloadSeller() {
    if (sessionStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller/seller-home']);
    }
  }
  userLogin(data: login) {
    // console.warn(data);
    this.http
      .get(
        `http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe((result: any) => {
        console.warn(result);
        if (result && result.body && result.body.length) {
          console.warn('user loged in');
          sessionStorage.setItem('seller', JSON.stringify(result.body[0]));
          this.router.navigate(['seller/seller-home']);
        } else {
          console.warn('login failed');
          this.isLoginError.emit(true);
        }
      });
  }
}
