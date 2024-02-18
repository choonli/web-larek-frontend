 export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    quantity: number
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
    address: string;
}

export interface IContactForm {
    phone: string;
    email: string;
}

export interface IOrder extends IOrderForm, IContactForm {
    total: number;
    items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
    total: number;
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

export interface IOrderResult {
    id: string;
    total: number;
}