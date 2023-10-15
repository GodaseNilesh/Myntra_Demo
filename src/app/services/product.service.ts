import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<product[] | []>();
  productCategory:string='';
  companyName:string='';

  constructor(private http: HttpClient) {}
  addProduct(data: product) {
    this.companyName=data.companyname;
    // this.http.post('http://localhost:3000/',this.companyName);
    return this.http.post('http://localhost:3000/products', data);
  }

  productList() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  //product list by comapny name for seller after login on seller-home page
  productListByCompanyName(data:string){
    return this.http.get<product[]>(`http://localhost:3000/products?companyname=${data}`);
  }

  //product list by Company name for product details from shop by category 
  productListByCategory(data:string){
    this.productCategory=data;
    return this.http.get<product[]>(`http://localhost:3000/products?companyname=${data}`);
  }

  //serach by category for shop by category
  searchByCategory(data:string){
    return this.http.get<product[]>(`http://localhost:3000/products?category=${data}`);
  }

  //product list of all company
  productListAllCompany(){
    return this.http.get<product[]>(`http://localhost:3000/products`);

  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }
  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  getProducts(id: string) {
    return this.http.get<product[]>(`http://localhost:3000/products/${id}`);
  }


  updateProduct(product: product) {
    return this.http.put<product>(
      `http://localhost:3000/products/${product.id}`,
      product
    );
  }
  ///////// carousel images/////////////
  carouselImages(){
    return this.http.get('http://localhost:3000/carousel-images')
  }

  popularProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=3');
  }

  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=5');
  }

  searchProducts(query: string) {
    return this.http.get<product[]>(
      `http://localhost:3000/products?q=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = sessionStorage.getItem('localCart');
    if (!localCart) {
      sessionStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      sessionStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  removeItemFromCart(productId: number) {
    let cartData = sessionStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      sessionStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }

  getCartList(userId: number) {
    return this.http
      .get<product[]>('http://localhost:3000/cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        console.log(result);
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  removeToCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }

  currentCart() {
    let userStore = sessionStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:3000/cart?userId='+userData.id)
  }

  orderNow(data:order){
    return this.http.post('http://localhost:3000/orders',data)
  }

  //showing orders list from cart
  orderList(){
    let userStore = sessionStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId='+userData.id);
  }

  deleteCartItems(cartId:number){
    return this.http.delete('http://localhost:3000/cart/' + cartId,{observe:'response'}).subscribe((result)=>{
      // if(result){
        this.cartData.emit([]);
      // }
    })
  }
  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId);
  }

  //show sold product order list from orders data (json-server)
  soldProduct(){
    return this.http.get<product>('http://localhost:3000/orders');
  }
}
