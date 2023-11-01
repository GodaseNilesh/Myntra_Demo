import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from '../data-types';

@Component({
  selector: 'app-shop-by-category',
  templateUrl: './shop-by-category.component.html',
  styleUrls: ['./shop-by-category.component.css'],
})
export class ShopByCategoryComponent {
  productData: undefined | product[] = [];
  uniqueObjArray: product[] = [];
  uniqueCompanyName: product[] = [];
  allCategory: any[] = [];
  category: string[] = [];
  selectedCategory: any = '';

  constructor(
    private product: ProductService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //fetching product data by category
    let category = this.activeRoute.snapshot.paramMap.get('category');
    this.selectedCategory = category;
    category &&
      this.product.searchByCategory(category).subscribe((result) => {
        this.productData = result;
        console.log(this.productData);

        this.uniqueObjArray = [
          ...new Map(
            this.productData.map((item) => [item['companyname'], item])
          ).values(),
        ];
      });
    this.getAllCategory();
    setTimeout(() => {
      this.uniqueCompanyName = this.uniqueObjArray;
    }, 200);
    console.log(this.uniqueCompanyName);
  }

  serachByCompany(data: string) {
    this.product.productListByCategory(data).subscribe((result) => {
      if (result) {
        console.log(result);
        this.router.navigate(['/product-list']);
      }
    });
  }

  getAllCategory() {
    //get unique category
    this.product.productListAllCompany().subscribe((result) => {
      console.log(result);
      this.allCategory = [
        ...new Map(result.map((item) => [item['category'], item])).values(),
      ];
      console.log(this.allCategory);
    });
    setTimeout(() => {
      for (let item of this.allCategory) {
        this.category.push(item.category);
      }
    }, 1000);
  }

  selectCategory(event: any) {
    this.selectedCategory = event.value;
    this.product.searchByCategory(this.selectedCategory).subscribe((result) => {
      console.log(result);
      this.uniqueCompanyName = [
        ...new Map(result.map((item) => [item['companyname'], item])).values(),
      ];
    });
  }
}
