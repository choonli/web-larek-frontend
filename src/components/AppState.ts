import { FormErrors, IAppState, IContactForm, IOrder, IOrderForm, IProduct } from "../types";
import Product from "./Product";
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
    catalog: IProduct[];
}

export default class AppState extends Model<IAppState> {
    basket: Product[] = [];
    catalog: Product[];
    loading: boolean;
    order: IOrder = {
        payment: 'online',
        adress: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    }
    preview: string | null;
    formErrors: FormErrors = {};

    refreshBasket() {
        this.emitChanges('counter:change', this.basket);
        this.emitChanges('counter:change', this.basket);
    }

    clearBasket() {
        this.basket = [];
        this.refreshBasket();
    }

    clearOrder() {
        this.order = {
            payment: 'online',
            adress: '',
            email: '',
            phone: '',
            total: 0,
            items: []
        }
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:change', {catalog: this.catalog})
    }

    setPreview(item: Product) {
        this.preview = item.id;
        this.emitChanges('preview:change');
    }

    setContactForm(field: keyof IContactForm, value: string) {
        this.order[field] = value;
        if (this.validateContactForm()) {
            this.events.emit('contact:ready', this.order);
        }
    }

    setOrderForm(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateOrderForm()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateContactForm() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
    
    validateOrderForm() {
        const errors: typeof this.formErrors = {};
        if (!this.order.adress) {
            errors.adress = 'Необходимо указать адрес доставки';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    handleBasketAction(action: string, item: Product): void {
    switch (action) {
        case 'add':
            if (!this.basket.includes(item)) {
            this.basket.push(item);
            }
            break;
        case 'remove':
            this.basket = this.basket.filter(el => el !== item);
            break;
        default:
            break;
        }

        this.refreshBasket();
    }
}