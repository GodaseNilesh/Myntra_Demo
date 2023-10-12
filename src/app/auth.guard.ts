import {inject} from '@angular/core'
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot,UrlTree } from '@angular/router';
import { SellerService } from './services/seller.service';
import {Observable} from 'rxjs'

export const authGuard: CanActivateFn = (route, state) => {
   
  if(sessionStorage.getItem('seller')){
    return true
  }
  return inject(SellerService).isSellerLoggedIn;
};
