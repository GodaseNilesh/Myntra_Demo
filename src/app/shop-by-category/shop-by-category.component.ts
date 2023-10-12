import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from '../data-types';

@Component({
  selector: 'app-shop-by-category',
  templateUrl: './shop-by-category.component.html',
  styleUrls: ['./shop-by-category.component.css']
})
export class ShopByCategoryComponent {
productData : undefined|  product[]=[];
companyNames :string[]=[];
companyImage:string[]=[];
optionType:undefined | string;
uniqueObjArray:product[]=[];

  constructor(private product:ProductService,private router:Router, private activeRoute:ActivatedRoute){

  }

  ngOnInit(): void {
    //fetching product data by category
    let category = this.activeRoute.snapshot.paramMap.get('category');
    console.log(category);
    category && this.product.searchByCategory(category).subscribe((result)=>{
      this.productData=result;
      console.log(this.productData);

       this.uniqueObjArray = [
        ...new Map(this.productData.map((item) => [item["companyname"], item])).values(),
    ];
     
    console.log("uniqueObjArray", this.uniqueObjArray);
    })
  }

  serachByCompany(data:string){
    this.product.productListByCategory(data).subscribe((result)=>{
      if(result){
        console.log(result);
        this.router.navigate(['product-list'])
      }
    })
  }
}
