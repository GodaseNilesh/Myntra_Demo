import { Component, ViewChild } from '@angular/core';
import { product } from '../data-types';
import { ProductService } from '../services/product.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  productList: undefined | product[];
  public dataSource: product[] = [];
  productMessage: undefined | string;
  productCategory: string = ''; // it used for company name
  getCategory: string = '';
  actions: boolean = false;
  uniqueObjArray: product[] = [];
  selectedCompany: any;
  allCompany:any[]=[];
  UniqueCompany:string[]=[];

  constructor(private product: ProductService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    if (sessionStorage.getItem('user')) {
      console.log('user logged in');
      let sellerStore = sessionStorage.getItem('user');
      if (sellerStore && sellerStore.length) {
        this.actions = true;
        this.productCategory = this.product.productCategory;
        this.selectedCompany = this.product.productCategory;
        this.product
          .productListByCategory(this.productCategory) //productlistbycategory=ProductListByCompanyName
          .subscribe((result) => {
            console.warn(result);
            this.productList = result;
            this.dataSource = result;
            this.getCategory = result[0].category;
            console.log(this.getCategory);
          });
      }
    } else {
      console.log('seller logged in');
      this.actions = false;
      this.productCategory = this.product.productCategory;
      this.product.productListAllCompany().subscribe((result) => {
        console.warn(result);
        this.productList = result;
        this.dataSource = result;

        this.uniqueObjArray = [
          ...new Map(result.map((item) => [item['category'], item])).values(),
        ];
        console.log(this.uniqueObjArray);
      });
    }
    setTimeout(() => {
      this.getAllCompanyName();
    }, 100);
  }

  //get all company name of that perticular category
  getAllCompanyName() {
    console.log('category', this.getCategory);
    this.product.searchByCategory(this.getCategory).subscribe((result) => {
      this.allCompany = [
        ...new Map(result.map((item) => [item['companyname'], item])).values(),
      ];
      console.log(this.allCompany);
    });
    setTimeout(() => {
      for(let item of this.allCompany){
        this.UniqueCompany.push(item.companyname);
      }
    }, 1000);
  }

  // showing result for selected company
  selectCompany(event: any) {
    this.selectedCompany = event.value;
    this.product
      .productListByCompanyName(this.selectedCompany)
      .subscribe((result) => {
        console.log(result);
        this.dataSource = result;
      });
  }
}
