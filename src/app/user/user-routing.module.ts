import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthComponent } from './user-auth/user-auth.component';
import CartPageComponent from './cart-page/cart-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { UserProfileDetailsComponent } from './user-profile-details/user-profile-details.component';

const routes: Routes = [
  {
    component: UserAuthComponent,
    path: 'user-auth',
  },
  {
    component: CartPageComponent,
    path: 'cart-page',
  },
  {
    component: CheckoutComponent,
    path: 'checkout',
  },
  {
    component: MyOrdersComponent,
    path: 'my-orders',
  },

  {
    component: UserProfileDetailsComponent,
    path: 'user-profile',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
