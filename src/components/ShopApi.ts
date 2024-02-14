import { ICard, IOrder, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";

export default class ShopApi extends Api {
    readonly cdn: string;
    
    constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItemList(): Promise<ICard[]> {
        return this.get('/product')
        .then((data: ApiListResponse<ICard>) => 
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))) 
    }

    getItem(id: string): Promise<ICard> {
        return this.get(`/product/${id}`)
        .then((item: ICard) => ({
            ...item,
            image: this.cdn + item.image
        }))
    }

    orderItems(order: IOrder) {
        return this.post('/order', order)
        .then((data: IOrderResult) => data);
    }
}