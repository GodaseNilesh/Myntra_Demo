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
  public displayColumns : string[] = ['image','name','price','color','category','action']
  public dataSource : product[] = []
  productMessage: undefined | string;
  productCategory:string='';

  constructor(private product:ProductService){
  }

  ngOnInit(): void {
      this.productCategory=this.product.productCategory;
      this.product.productListByCategory(this.productCategory)
      .subscribe((result) => {
        console.warn(result);
        this.productList = result;
        this.dataSource=result;
      });
  }
}
