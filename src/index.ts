import AppState, { CatalogChangeEvent } from './components/AppState';
import Basket from './components/Basket';
import Card from './components/Card';
import { ContactForm } from './components/ContactForm';
import Order from './components/OrderForm';
import Page from './components/Page';
import Product from './components/Product';
import ShopApi from './components/ShopApi';
import { EventEmitter } from './components/base/events';
import Modal from './components/common/Modal';
import Success from './components/Success';
import './scss/styles.scss';
import { IContactForm, IOrder, IOrderForm } from './types';
import { API_URL, CDN_URL, PaymentTypes } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new ShopApi(CDN_URL, API_URL);
const events = new EventEmitter();

events.onAll(({eventName, data}) => {
    console.log(eventName, data);
})

// templates
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const modal2 = document.querySelector('.modal')

// app state
const appState = new AppState({}, events);

// containers
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events, {
    onClick: (ev: Event) => events.emit('payment:toggle', ev.target)
  });
const contactForm = new ContactForm(cloneTemplate(contactsTemplate), events);

// изменились элементы каталога
events.on<CatalogChangeEvent>('items:change', () => {
    page.gallery = appState.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        })
    })
})

// получение товаров с сервера
function getItems() {
    api.getItemList()
        .then((catalog) => {
        appState.setCatalog(catalog);
    })
    .catch((err) => {
        console.error(err)
    })
}

getItems();

// блокируем прокрутку страницы если открыта модалка
function blockModal() {
    page.locked = true;
}

// ... и разблокируем
function unblockModal() {
    page.locked = false;
}

//открытие/закрытие модалки
events.on('modal:open', blockModal);
events.on('modal:close', unblockModal);


// изменение предварительного просмотра
// const handlePreviewChanged = (item: Product) => {
//     const card = new Card(cloneTemplate(previewTemplate), {
//       onClick: () => {
//         events.emit('product:toggle', item);
//         card.buttonText = (appState.basket.indexOf(item) < 0) ? 'В корзину' : 'Удалить из корзины'
//       }
//     });
//     modal.render({
//       content: card.render({
//         title: item.title,
//         description: item.description,
//         image: item.image,
//         price: item.price,
//         category: item.category,
//         buttonTitle: (appState.basket.indexOf(item) < 0) ? 'В корзину' : 'Удалить из корзины'
//       })
//     })
// };

const handlePreviewChanged = (item: Product) => {
    const card = new Card(cloneTemplate(previewTemplate), {
      onClick: () => {
        events.emit('product:toggle', item);
        card.buttonText = (appState.basket.indexOf(item) < 0) ? 'В корзину' : 'Удалить из корзины'
      }
    });

    const buttonText = (appState.basket.indexOf(item) < 0) ? 'В корзину' : 'Удалить из корзины';

    card.buttonText = buttonText;

    modal.render({
      content: card.render({
        title: item.title,
        description: item.description,
        image: item.image,
        price: item.price,
        category: item.category,
        buttonTitle: buttonText
      })
    })
};

// Подписываемся на событие открытия карточки товара
events.on('card:select', handlePreviewChanged);

events.on('basket:open', () => {
    modal.render({
        content: basket.render({})
    })
});

//Обновление 
events.on('product:toggle', (item: Product) => {
    if (appState.basket.indexOf(item) < 0) {
        events.emit('product:add', item);
    }
    else {
        events.emit('product:delete', item);
    }
});
  
events.on('product:add', (item: Product) => {
    appState.handleBasketAction('add', item);
});
  
events.on('product:delete', (item: Product) => {
    appState.handleBasketAction('remove', item)
});

events.on('basket:changed', (items: Product[]) => {
    basket.items = items.map((item, index) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('product:delete', item);
        }
    });
    return card.render({
        index: (index + 1).toString(),
        title: item.title,
        price: item.price,
    });
    });
  
    const total = items.reduce((total, item) => total + item.price, 0);
    basket.total = total;
    appState.order.total = total;
    basket.toggleButton(total === 0);
});

events.on('counter:changed', (item: string[]) => {
    page.counter = appState.basket.length;
});

// изменилась контактная форма
events.on('contact:open', () => {
    modal.render({
        content: contactForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
})

// изменилась контактная форма
events.on('order:open', () => {
    modal.render({
        content: order.render({
            address: '',
            payment: '',
            valid: false,
            errors: []
        })
    });
})

// изменилось состояние валидации формы
events.on('orderErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
})

events.on('formErrors:change', (errors: Partial<IContactForm>) => {
    const { phone, email } = errors;
    order.valid = !email && !phone;
    contactForm.errors = Object.values({ phone, email }).filter(i => !!i).join('; ')
})

// изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appState.setOrderForm(data.field, data.value)
})
  
events.on(/^contacts\..*:change/, (data: { field: keyof IContactForm, value: string }) => {
    appState.setContactForm(data.field, data.value)
})

// подписка на событие изменения предварительного просмотра
events.on('preview:changed', handlePreviewChanged);

// событие заполненности формы
events.on('order:ready', () => {
    order.valid = true;
})
  
events.on('contact:ready', () => {
    contactForm.valid = true;
})

events.on('contacts:submit', handleOrderSubmit);

function handleOrderSubmit() {
    api.orderItems(appState.order)
    .then((result) => {
        appState.clearBasket();
        appState.clearOrder();
        const success = new Success(cloneTemplate(successTemplate), {
          onClick: () => {
            modal.close();
          }
        });
        success.description = result.total.toString();
  
        modal.render({
          content: success.render({})
        });
      })
    .catch(err => {
        console.error(err);
    });
}

events.on('payment:toggle', (target: HTMLElement) => {
    if (!target.classList.contains('button_alt-active')) {
      order.toggleButton(target);
      appState.order.payment = PaymentTypes[target.getAttribute('name')];
      console.log(appState.order)
    }
});

events.on('order:open', () => {
    modal.render({
      content: order.render({
        payment: '',
        address: '',
        valid: false,
        errors: []
      })
    });
    appState.order.items = appState.basket.map(item => item.id);
});
  
events.on('order:submit', () => {
    events.emit('contact:open')
});
