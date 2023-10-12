import { Component } from '@angular/core';
import { product } from '../data-types';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  productList: undefined | product[];
  public displayColumns : string[] = ['image','name','price','color','quantity','companyname','action']// category is removed
  public dataSource : product[] = []
  productMessage: undefined | string;
  productCategory:string='';
  actions:string='seller';

  constructor(private product:ProductService){
  }

  ngOnInit(): void {
    this.actions='seller';
    if(sessionStorage.getItem('user')){
    let sellerStore=sessionStorage.getItem('user');
    if(sellerStore && sellerStore.length){
      this.actions='user';
      this.productCategory=this.product.productCategory;
      this.product.productListByCategory(this.productCategory) //productlistbycategory=ProductListByCompanyName
      .subscribe((result) => {
        console.warn(result);
        this.productList = result;
        this.dataSource=result;
      });
    }
  // }else if(sessionStorage.getItem('seller')){
  //   this.actions='seller';
  //   this.productCategory=this.product.productCategory;
  //   console.log(this.productCategory);
  //     this.product.productListByCompanyName(this.productCategory) //productlistbycategory=ProductListByCompanyName
  //     .subscribe((result) => {
  //       console.warn(result);
  //       this.productList = result;
  //       this.dataSource=result;
  //     });
  }else{
    this.productCategory=this.product.productCategory;
      this.product.productListAllCompany()
      .subscribe((result) => {
        console.warn(result);
        this.productList = result;
        this.dataSource=result;
        // console.log(this.dataSource);
      });
  }   
  }
}
