import { IProduct, IOrder, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface IShopApi {
    getItemList: () => Promise<IProduct[]>;
    getItem: (id: string) => Promise<IProduct>;
    orderItems: (order: IOrder) => Promise<IOrderResult>
}

export default class ShopApi extends Api implements IShopApi {
    readonly cdn: string;
    
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItemList(): Promise<IProduct[]> {
        return this.get('/product')
        .then((data: ApiListResponse<IProduct>) => 
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))) 
    }

    getItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`)
        .then((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image
        }))
    }

    orderItems(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order)
        .then((data: IOrderResult) => data);
    }
}