 export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IOrderForm {
    payment: string;
    adress: string;
}

export interface IContactForm {
    phone: string;
    email: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
}

export interface ICards extends IProduct {
    index?: string;
    buttonTitle?: string;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IPage {
    counter: number;
    gallery: HTMLElement[];
}

export interface IActions {
    onClick: (event: MouseEvent) => void;
}