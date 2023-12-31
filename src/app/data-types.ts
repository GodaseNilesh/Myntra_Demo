
export interface SignUp{
    companyname:string,
    name:string,
    email:string,
    password:string,
    id:string
}
export interface login{
    companyname:string,
    email:string,
    password:string,
    id:string

}
export interface product{
    // forEach(arg0: (product: product) => void): unknown
    companyname:string,
    name:string,
    price:number,
    discount:number,
    category:string,
    color:string,
    discription:string,
    image:string
    id:number
    quantity: undefined | number,
    productId: undefined | number,
}
export interface cart{
    companyname:string,
    name:string,
    price:number,
    category:string,
    color:string,
    discription:string,
    image:string
    id:number | undefined,
    quantity: undefined | number,
    userId:number,
    productId:number,
    selected : boolean
}

export interface priceSummary{
    price : number,
    discount : number,
    tax : number,
    delivery : number,
    total : number
}
export interface order{
    quantity : string | number
    email:string,
    address:string,
    contact:string,
    totalPrice:number,
    userId:number,
    id:number | undefined,
    // productId :number | undefined,
    products : cart[] | undefined
}
export interface carousel{
    image:string
}

export interface profile{
    id:number | undefined,
    userid: number | undefined,
    name:string,
    email:string,
    password:string,
    DOB:Date,
    gender:string
    contact:string,
    city:string,
    locality:string,
    address1:string,
    address2:string,
    address3:string
}
export interface address{
    city:string,
    address:string
}