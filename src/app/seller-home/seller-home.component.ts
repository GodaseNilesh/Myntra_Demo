import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-types';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[];
  public displayColumns : string[] = ['image','name','price','color','category','action']
  public dataSource : product[] = []
  productMessage: undefined | string;
  sellerName:string='';
  companyName:string='';

  constructor(private product: ProductService) {}
  ngOnInit(): void {
    if (sessionStorage.getItem('seller')) {
      let sellerStore = sessionStorage.getItem('seller');
      console.log(sellerStore);
      let sellerData = sellerStore && JSON.parse(sellerStore);//[0]
      // console.log(sellerData);
      this.companyName=sellerData.companyname;
      console.log(this.companyName);
    }
    // this.list();
    this.listByCompany(this.companyName);
  }
  deleteProduct(id: number) {
    console.warn('text id', id);
    this.product.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product is deleted';
        this.list();
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }
  list() {
    this.product.productList().subscribe((result) => {
      console.warn(result);
      this.productList = result;
      this.dataSource=result;
    });
  }

  listByCompany(companyName:string){
    this.product.productListByCompanyName(companyName).subscribe((result)=>{
      console.log(result);
      this.productList = result;
      this.dataSource=result;
    })
  }
}
