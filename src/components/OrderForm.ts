import { IActions, IOrderForm } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export default class Order extends Form<IOrderForm> {
    protected _cardPaymentButton: HTMLButtonElement;
    protected _cashPaymentButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
        super(container, events);

        this._cardPaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this._cardPaymentButton.classList.add('button_alt-active');

        if (actions?.onClick) {
            this.addButtonClickHandler(actions.onClick);
        }
    }

    private addButtonClickHandler(onClick?: (event: MouseEvent) => void) {
        if (onClick) {
            this._cardPaymentButton.addEventListener('click', onClick);
            this._cashPaymentButton.addEventListener('click', onClick);
        }
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    toggleButton(toggleOn: HTMLElement) {
        this._cardPaymentButton.classList.toggle('button_alt-active', toggleOn === this._cardPaymentButton);
        this._cashPaymentButton.classList.toggle('button_alt-active', toggleOn === this._cashPaymentButton);
    }
}