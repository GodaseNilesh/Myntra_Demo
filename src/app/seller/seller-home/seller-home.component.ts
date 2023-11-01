import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { order, product } from '../../data-types';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[];
  public displayColumns : string[] = ['image','name','price','color','category','action']
  public displayColumns2 :string[]=['image','name','quantity','price','color'];
  public dataSource1 : product[] = [];
  public dataSource2 : product[] = [];
  price:number | undefined;

  soldProducts : product[]=[];
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
      // console.log("id",sellerData.id);
      // console.log("company name",this.companyName);
    }
    // this.list();
    this.listByCompany(this.companyName);
    this.soldProductList();
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
      this.dataSource1=result;
    });
  }

  //product list by company , company name fetch from seller login (session storage)
  listByCompany(companyName:string){
    this.product.productListByCompanyName(companyName).subscribe((result)=>{
      console.log(result);
      // console.log("quantity",result[0].quantity);
      this.productList = result;
      this.dataSource1=result;
    })
  }

  //fetching sold products from json (orders) for perticular seller according to company name
  soldProductList(){
    this.product.soldProduct().subscribe((result:any)=>{
      console.log("sold products",result);
      console.log("datasource",this.dataSource1);

      for(let item1 of result){
        for(let item2 of this.dataSource1){
          if(item1.productId == item2.id){
              this.product.getProduct(item2.id.toString()).subscribe((value:any)=>{
                  this.soldProducts=[value];
                  console.log("sold products--",this.soldProducts);

                  //it works only one product is matched
                  if(this.productList && this.soldProducts){
                    let items:any=this.soldProducts[0];
                    // console.log("items quantity",items.quantity);
                    // console.log("item1 quantity",item1.quantity);
                    items.quantity =item1.quantity;
                    // console.log("quantity",items.quantity);
                    // console.log(this.soldProducts);
                    this.dataSource2=this.soldProducts;
                  }
                })
          }else{
          console.log("product is not matched");
          }
      }
      }
    })
  }
}
