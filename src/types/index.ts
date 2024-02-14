export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IBasket {
    title: string;
    itemsList: ICard[];
    price: number;
    total: string
}

export interface IOrderForm {
    adress: string;
    phone: string;
    email: string;
    payment: 'online' | 'upon receipt';
}

export interface IOrder extends IOrderForm {
    total: string;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: string;
}
