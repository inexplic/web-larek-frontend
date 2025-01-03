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
import { FormModel } from './components/Model/FormModel';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';
import { BasketModel } from './components/Model/BasketModel';
import { HeaderBasket } from './components/View/HeaderBasket';
import { Page } from './components/View/Page';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
const pageWrapper = document.querySelector('.page__wrapper') as HTMLElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel(events);
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);
const headerBasket = new HeaderBasket(basketButton, events);
const page = new Page(pageWrapper);
const success = new Success(successTemplate, events);

function updateBasketItems() {
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new Card(
      cardBasketTemplate,
      events,
      { onClick: () => events.emit('basket:basketItemRemove', item) },
      true
    );
    i += 1;
    return basketItem.render(item, i);
  });
}

// рендер товаров
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    page.addElement(card.render(item));
  });
});

// Открываем модалку товара 
events.on('modalCard:open', (item: IProductItem) => {
  const basketItems = basketModel.basketProducts;
  const cardPreview = new CardPreview(cardPreviewTemplate, events);
  modal.content = cardPreview.render(item, undefined, basketItems); 
  modal.render();
});

// Добавление товара в корзину
events.on('card:addBasket', () => {
  basketModel.addItemToBasket(dataModel.selectedCard);
  modal.close();
});

// Обработка изменения корзины
events.on('basket:changed', () => {
  headerBasket.updateQuantity(basketModel.getQuantity());
  basket.renderTotal(basketModel.getProductsSum());
  updateBasketItems();
});

// Открытие модалки корзины 
events.on('basket:open', () => {
  modal.content = basket.render();
  modal.render();
});

// Выбор товара, по которой был клик
events.on('card:select', (item: IProductItem) => { dataModel.setPreview(item) });

// Удаление товара из корзины 
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteItemFromBasket(item);
});

// Открытие модалки с оплатой и адресом
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
});

events.on('order:paymentSelection', ({ paymentMethod }: { paymentMethod: string }) => {
  formModel.setPayment({ paymentMethod }); // Модель обновляет данные
});

// Добавляем change event в поле адреса доставки 
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

// Валидация адресса и способа оплаты
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors;
  let errorMessage = '';

  if (address) {
    errorMessage = address;
  } 
  else if (payment) {
    errorMessage = payment;
  }

  order.valid = !address && !payment;
  order.updateErrorMessage(errorMessage);

  if (!payment) {
    const paymentMethod = formModel.getPayment(); // Получаем из модели
    order.paymentSelection(paymentMethod); // Обновляем кнопки
  }
})

// Открытие модалки с формой телефона и почты 
events.on('contacts:open', () => {
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
  let errorMessage = '';

  if (email) {
    errorMessage = email;
  } 
  else if (phone) {
    errorMessage = phone;
  }

  contacts.valid = !email && !phone;
  contacts.updateErrorMessage(errorMessage);
})



// Открытие модалки при успешном заказе
events.on('success:open', () => {
  const orderData = formModel.getOrderData();

  const total = basketModel.getProductsSum();
  const items = basketModel.basketProducts.map((item: IProductItem) => item.id);

  const order = {
    ...orderData,
    total,
    items,
  };
  console.log(order);

  // Отправка данных на сервер
  apiModel.postOrder(order)
    .then((data) => {
      modal.content = success.render(total);
      basketModel.clearBasket();
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

// Блокируем прокрутку страницы при открытой модалки
events.on('modal:open', () => {
  page.lockPage();
});

// Снятие блокировки прокрутки
events.on('modal:close', () => {
  page.unlockPage();
});

// Получение данных с сервера
apiModel.getProductItems()
  .then(function (data: IProductItem[]) {
    dataModel.productCards = data;
  })
  .catch(error => console.log(error))