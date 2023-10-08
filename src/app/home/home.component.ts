import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
popularProducts:undefined | product[];
trendyProducts: undefined | product[];

    constructor(private product:ProductService, private router:Router){

    }

    ngOnInit(): void {
      this.product.popularProducts().subscribe((data)=>{
        this.popularProducts=data;
      })
      this.product.trendyProducts().subscribe((data)=>{
        this.trendyProducts=data;
      });
    }

    showProductList(value:string){
      console.log(value);
      this.product.productListByCategory(value);
      this.router.navigate(['product-list']);
    }
}
