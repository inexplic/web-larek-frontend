import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { DataModel } from './components/Model/DataModel';
import { Card } from './components/View/Card';
import { CardPreview } from './components/View/CardPreview';
import { IOrderForm, IProductItem } from './types';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';

import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItem';
import { FormModel } from './components/Model/FormModel';
import { Order } from './components/View/FormOrder';
import { Contacts } from './components/View/FormContacts';
import { Success } from './components/View/Success';
import { BasketModel } from './components/Model/BasketModel';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel();
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

// рендер товаров
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});



// Открываем модалку товара 
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events)
  modal.content = cardPreview.render(item);
  modal.render();
});

// Добавление товара в корзину
events.on('card:addBasket', () => {
  basketModel.addItemToBasket(dataModel.selectedCard) 
  basket.renderBasketQuantity(basketModel.getQuantity()); 
  modal.close();
});

// Открытие модалки корзины 
events.on('basket:open', () => {
  basket.renderTotal(basketModel.getProductsSum()); 
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
  modal.content = basket.render();
  modal.render();
});

// Выбор товара, по которой был клик
events.on('card:select', (item: IProductItem) => { dataModel.setPreview(item) });

// Удаление товара из корзины 
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteItemFromBasket(item);
  basket.renderBasketQuantity(basketModel.getQuantity()); 
  basket.renderTotal(basketModel.getProductsSum()); 
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
});

// Открытие модалки с оплатой и адресом
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  formModel.items = basketModel.basketProducts.map(item => item.id);
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => { formModel.payment = button.name }) 

// Добавляем change event в поле адреса доставки 
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

// Валидация адресса и способа оплаты
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

// Открытие модалки с формой телефона и почты 
events.on('contacts:open', () => {
  formModel.total = basketModel.getProductsSum();
  modal.content = contacts.render();
  modal.render();
});

// Добавляем change event в поле телефона и почты
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

// Валидация телефона и почты
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

// Открытие модалки при успешном заказе
events.on('success:open', () => {
  apiModel.postOrder(formModel.getOrderData())
    .then((data) => {
      const success = new Success(successTemplate, events);
      modal.content = success.render(basketModel.getProductsSum());
      basketModel.clearBasket();
      basket.renderBasketQuantity(basketModel.getQuantity());
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

// Блокируем прокрутку страницы при открытой модалки
events.on('modal:open', () => {
  modal.locked = true;
});

// Снятие блокировки прокрутки
events.on('modal:close', () => {
  modal.locked = false;
});

// Получение данных с сервера
apiModel.getProductItems()
  .then(function (data: IProductItem[]) {
    dataModel.productCards = data;
  })
  .catch(error => console.log(error))