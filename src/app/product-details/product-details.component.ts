import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-types';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  productData: undefined | product;
  productQuantity: number = 1;
  totalQuantity: undefined | number;
  productCategory:string | undefined;
  removeCart = false;
  cartData :product | undefined;
  allRelatedProducts : product[]=[];

  constructor(
    private activeRoute: ActivatedRoute,
    private router:Router,
    private product: ProductService
  ) {}

  ngOnInit(): void {
    this.reload();
  }
  
  reload(){
    //get product id from url and fetch product data from json
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    console.log(productId);

    productId && this.product.getProduct(productId).subscribe((result) => {
        this.productData = result;

        //fetching all other products of same category
        this.productCategory=this.productData.category;
        this.product.searchByCategory(this.productCategory).subscribe((result)=>{
          this.allRelatedProducts=result;
            // console.log(result);
        })


        this.totalQuantity=this.productData.quantity;
        // console.log(this.totalQuantity);

        let cartData = sessionStorage.getItem('localCart');
        if (productId && cartData) {
          let items = JSON.parse(cartData);
          items = items.filter(
            (item: product) => productId == item.id.toString()
          );
          if (items.length) {
            this.removeCart = true;
          } else {
            this.removeCart = false;
          }
        }
        let user = sessionStorage.getItem('user');
        if (user) {
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId);
          this.product.cartData.subscribe((result) => {
            let item = result.filter(
              (item: product) =>
                productId?.toString() === item.productId?.toString()
            );
            if (item.length) {
              this.cartData=item[0];
              this.removeCart = true;
            }
          });
        }
      });
  }

  handleQuantity(val: string) {
    if(this.totalQuantity){
    if (this.productQuantity < this.totalQuantity && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }
  }
  AddToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!sessionStorage.getItem('user')) {
        // console.log(this.productData);
        this.product.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        // console.warn("user logged in")
        let user = sessionStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        // console.warn(userId);
        let cartData: cart = {
          ...this.productData,
          userId,
          productId: this.productData.id,
          selected: false
        };
        
        delete cartData.id;
        // console.log(cartData);
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  removeToCart(productId: number) {
    if (!sessionStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);
    } else {
      let user = sessionStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
      console.warn(this.cartData);
      this.cartData && this.product.removeToCart(this.cartData.id)
      .subscribe((result)=>{
        if(result){
          this.product.getCartList(userId);
        }
      })
      this.removeCart = false;
    }
  }
}
