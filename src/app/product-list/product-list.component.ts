import { Component, ViewChild } from '@angular/core';
import { product } from '../data-types';
import { ProductService } from '../services/product.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  productList: undefined | product[];
  public dataSource : product[] = []
  productMessage: undefined | string;
  productCategory:string='';
  actions:boolean=false;
  uniqueObjArray:product[]=[];

  constructor(private product:ProductService){
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }


  ngOnInit(): void {
    if(sessionStorage.getItem('user')){
      console.log("user logged in");
    let sellerStore=sessionStorage.getItem('user');
    if(sellerStore && sellerStore.length){
      this.actions=true;
      this.productCategory=this.product.productCategory;
      this.product.productListByCategory(this.productCategory) //productlistbycategory=ProductListByCompanyName
      .subscribe((result) => {
        console.warn(result);
        this.productList = result;
        this.dataSource=result;
      });
    }
  }else{
    console.log("seller logged in");
    this.actions=false;
    this.productCategory=this.product.productCategory;
      this.product.productListAllCompany()
      .subscribe((result) => {
        console.warn(result);
        this.productList = result;
        this.dataSource=result;

        this.uniqueObjArray=[
          ...new Map(result.map((item)=>[item["category"],item])).values(),
        ];
        console.log(this.uniqueObjArray);
      });
  }   
  }
}
