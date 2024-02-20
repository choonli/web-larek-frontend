import { Form } from './common/Form';
import { IContactForm } from '../types';
import { IEvents } from '../components/base/events';

export class ContactForm extends Form<IContactForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
    }

    get phone(): string {
      return (this.container.elements.namedItem('phone') as HTMLInputElement).value;
    }

    set phone(value: string) {
      (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    get email(): string {
      return (this.container.elements.namedItem('email') as HTMLInputElement).value;
    }

    set email(value: string) {
      (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}