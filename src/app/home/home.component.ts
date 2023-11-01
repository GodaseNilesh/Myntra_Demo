import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { carousel, product } from '../data-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
totalQuantity : undefined | number;
popularProducts:undefined | product[];
trendyProducts: undefined | product[];
mostSelledProducts: product[]=[];
carouselImages: any | any[];
uniqueObjArray:product[]=[];
getAllProducts:product[]=[];
getFilteredProducts:product[]=[];


    constructor(private product:ProductService, private router:Router){

    }

    ngOnInit(): void {
      this.product.popularProducts().subscribe((data)=>{
        this.popularProducts=data;
      });
      this.product.trendyProducts().subscribe((data)=>{
        this.trendyProducts=data;
      });
      this.product.carouselImages().subscribe((data)=>{
        this.carouselImages=data;
        // console.log(this.carouselImages)
      });

      this.getAllCategory();
      this.product.soldProduct().subscribe((data:any)=>{
        // this.mostSelledProducts=data;
        let id:any;
        if(data){
          for(let items of data){
            id=items.productId;
            // console.log(id);
            this.product.getProduct(id).subscribe((result)=>{
            this.mostSelledProducts.push(result);
        })
        }
        }
      })
    }

    showProductList(value:string){
      console.log(value);
      this.product.productListByCategory(value);
      this.router.navigate(['/shop-by-category']);
    }

    SearchByCategory(data:string){
      this.product.searchByCategory(data).subscribe(result=>{
        console.log("data by category",result);
        this.totalQuantity=result.length;
        console.log("length",this.totalQuantity);
      })
    }

    getAllCategory(){
      this.product.productListAllCompany().subscribe((result)=>{
        this.getAllProducts=result;

        this.getFilteredProducts=this.getAllProducts.filter((item)=>{
          return item.price>10000;
        })
        console.log(this.getFilteredProducts);

        this.uniqueObjArray=[
          ...new Map(result.map((item)=>[item["category"],item])).values(),
        ];
        console.log("uniqueObjArray", this.uniqueObjArray);
      })
    }

}
