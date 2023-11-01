import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
console.log("seller module load");

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SellerRoutingModule
  ]
})
export class SellerModule { }
