import { Api } from '../components/base/api'
import { IEvents} from '../components/base/events'

//types
interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
  
interface IOrderForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}

interface IOrder extends IOrderForm {
    items: string[];
}

interface IOrderResult {
    id: string;
    total: number;
}

interface IApiModel {
    items: IProductItem[];
    getListProductCard: () => Promise<IProductItem[]>;
    postOrderLot: (order: IOrder) => Promise<IOrderResult>;
  }

interface IBasketModel {
    basketProducts: IProductItem[];
    getQuantity: () => number;
    getProductsSum: () => number;
    addItemToBasket(data: IProductItem): void;
    deleteItemFromBasket(item: IProductItem): void;
}

export interface IFormModel {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
    setOrderAddress(value: string): void
    setOrderData(field: 'email' | 'phone', value: string): void
    setOrderPayMethod(value: string) : void
    getOrderData(): { email: string, phone: string, address: string, payment: string, total: number, items: string[] };
  }



// !!!!!  MODEL !!!!
// API предварительный класс
class ApiModel extends Api {
    items: IProductItem[];
  
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
    }
  
    // получаем массив карточек с сервера
    getProductItems(): Promise<IProductItem[]> {
     //логика получения
    }
  
    // получаем ответ от сервера по сделанному заказу
    postOrderLot(order: IOrder): Promise<IOrderResult> {
      //логика получения
    }
}


// BASKET - предварительный класс
class BasketModel implements IBasketModel {
    protected _basketProducts: IProductItem[]; // список карточек товара в корзине
  
    constructor() {
      this._basketProducts = [];
    }
  
    set basketProducts(data: IProductItem[]) {
      this._basketProducts = data;
    }
  
    get basketProducts() {
      return this._basketProducts;
    }
  
    // количество товара в корзине
    getQuantity(): number {
        return 0
        // логика
    }
  
    // сумма всех товаров в корзине
    getProductsSum() {
     // логика
     return 0
    }
  
    // добавить карточку товара в корзину
    addItemToBasket(data: IProductItem) {
      
    }
  
    // удалить карточку товара из корзины
    deleteItemFromBasket(item: IProductItem) {
     
    }

    // Проверка наличия товара в корзине
    hasItemInBasket(productId: string): boolean {
      return this._basketProducts.some(item => item.id === productId);
    }

    // Получение списка всех товаров в корзине
    getItems(): IProductItem[] {
      return [...this._basketProducts];
    }
}


  class FormModel implements IFormModel {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];

  
    constructor(protected events: IEvents) {
      this.payment = '';
      this.email = '';
      this.phone = '';
      this.address = '';
      this.total = 0;
      this.items = [];
    }
  
    // принимаем значение строки "address"
    setOrderAddress(value: string): void {
     // логика
    }
  
    // принимаем значение данных строк "Email" и "Телефон"
    setOrderData(field: 'email' | 'phone', value: string): void {
      // логика
    }

    // принимаем значение данных строк метода оплаты
    setOrderPayMethod(value: string): void {
      // логика
    }

    // Валидация email
    private isValidEmail(email: string): boolean {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return re.test(email);
    }

    // Валидация телефона
    private isValidPhone(phone: string): boolean {
      const re = /^[\+][0-9]{1,3}[\-]?[0-9]{1,10}$/;
      return re.test(phone);
    }
    
    // Получение всех данных заказа
    getOrderData(): { email: string, phone: string, address: string, payment: string, total: number, items: string[] } {
      return {
          email: this.email,
          phone: this.phone,
          address: this.address,
          payment: this.payment,
          total: this.total,
          items: this.items,
      };
    }
}


// !!! VIEWS !!!

//BASKET предварительный тип и класс
interface IBasket {
    basket: HTMLElement;
    title: HTMLElement;
    basketList: HTMLElement;
    button: HTMLButtonElement;
    basketPrice: HTMLElement;
    headerButton: HTMLButtonElement;
    headerCounter: HTMLElement;
    renderBasketCounter(value: number): void;
    renderProductsSum(sumAll: number): void;
    render(products: IProductItem[]): void;
  }

export class Basket implements IBasket {
  private basketList: HTMLElement;
  private totalPrice: HTMLElement;
  private orderButton: HTMLElement;
  
    basket: HTMLElement;
    title: HTMLElement;
    button: HTMLButtonElement;
    basketPrice: HTMLElement;
    headerButton: HTMLButtonElement;
    headerCounter: HTMLElement;
// логика класса

 // Отображение списка товаров
 render(products: IProductItem[]): void {
  this.basketList.innerHTML = ''; // очищаем список

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('basket-item');
    productElement.innerHTML = `
      <span>${product.name}</span>
      <span>Цена: $${product.price}</span>
      <span>Количество: ${product.quantity}</span>
      <button class="remove-product" data-id="${product.id}">Удалить</button>
    `;

    this.basketList.appendChild(productElement);
  });
}

// Отображение итоговой суммы
renderTotal(totalPrice: number): void {
  this.totalPrice.textContent = `Итого: $${totalPrice}`;
}

// Получение кнопки оформления заказа
getOrderButton(): HTMLElement {
  return this.orderButton;
}

// Получение кнопок удаления товара
getRemoveButtons(): NodeListOf<HTMLElement> {
  return this.basketList.querySelectorAll('.remove-product');
}
}

//Modal 
interface IModal {
    open(): void;
    close(): void;
    render(): HTMLElement
  }

  export class Modal implements IModal {
    protected modalContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;
    
    constructor(modalContainer: HTMLElement, protected events: IEvents) {
      this.modalContainer = modalContainer;
      this.closeButton = modalContainer.querySelector('.modal__close');
    }

    // открытие модального окна
    open() {
      this.modalContainer.classList.add('modal_active');
      this.events.emit('modal:open');
    }
  
    // закрытие модального окна
    close() {
      this.modalContainer.classList.remove('modal_active');
      this.events.emit('modal:close');
    }
  
  } 

  //Card 

interface ICard extends IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
    
  setText: (value: string | unknown) => void
  setCategory:  (value: string | unknown) => void
  setPrice: (value: number | unknown) => void
  } 

  class Card implements ICard{
    cardElement: HTMLElement;
    imageElement: HTMLElement;
    titleElement: HTMLElement;
    priceElement: HTMLElement;
    descriptionElement: HTMLElement;
    addToBasketButton: HTMLElement;
  
    constructor() {
      // Создаём элементы для карточки
      this.cardElement = document.createElement('div');
      this.imageElement = document.createElement('img');
      this.titleElement = document.createElement('h3');
      this.priceElement = document.createElement('p');
      this.descriptionElement = document.createElement('p');
      this.addToBasketButton = document.createElement('button');
      
      // Добавляем классы или атрибуты для стилей и функционала
      this.cardElement.classList.add('card');
      this.addToBasketButton.textContent = 'Добавить в корзину';
    }
  
    // Метод для отображения карточки товара
    render(product: IProductItem): void {
      this.setImage(product.image);
      this.setTitle(product.title);
      this.setPrice(product.price);
      this.setDescription(''); // Базовое описание пустое в Card
    }
  
    // Обновление изображения товара
    setImage(image: string): void {
      this.imageElement.src = image;
    }
  
    // Обновление названия товара
    setTitle(title: string): void {
      this.titleElement.textContent = title;
    }
  
    // Обновление цены товара
    setPrice(price: number): void {
      this.priceElement.textContent = `Цена: ${price}₽`;
    }
  
    // Обновление описания товара (пока не будет выводиться в Card)
    setDescription(description: string): void {
      this.descriptionElement.textContent = description;
      // В Card описание скрыто
      this.descriptionElement.style.display = 'none';
    }
  
    // Возвращаем кнопку добавления в корзину
    getAddToBasketButton(): HTMLElement {
      return this.addToBasketButton;
    }
  }
  
  // Класс CardPreview, наследующийся от Card, с подробным описанием товара
  class CardPreview extends Card {
    constructor() {
      super();
      // При инициализации CardPreview, описание должно быть видимым
      this.descriptionElement.style.display = 'block';
    }
  
    // Переопределение метода render для отображения подробного описания
    render(product: IProductItem): void {
      super.render(product);
      this.setDescription(product.description); // В CardPreview добавляется описание
    }
  }

  class Modal {
    modalElement: HTMLElement;
  
    constructor() {
      this.modalElement = document.createElement('div');
      this.modalElement.classList.add('modal');
      
      // Закрытие модального окна при клике на фон
      this.modalElement.addEventListener('click', (event) => {
        if (event.target === this.modalElement) {
          this.hide();
        }
      });
    }
  
    // Метод для отображения модального окна
    show(contentElement: HTMLElement): void {
      this.modalElement.appendChild(contentElement);
      document.body.appendChild(this.modalElement);
      this.modalElement.style.display = 'flex';
    }
  
    // Метод для скрытия модального окна
    hide(): void {
      this.modalElement.style.display = 'none';
      this.modalElement.innerHTML = ''; // Очищаем содержимое после скрытия
    }
  }

  // Интерфейс для данных о заказе
interface IOrderData {
  paymentMethod: string;
  address: string;
}

// Класс Order для отображения формы заказа
class Order {
  paymentMethodSelect: HTMLElement;
  addressInput: HTMLElement;
  submitButton: HTMLElement;
  orderData: IOrderData | null;

  constructor() {
    // Изначально данные заказа пустые
    this.orderData = null;

    // Создаём элементы формы
    this.paymentMethodSelect = document.createElement('select');
    const paymentOptions = ['Картой', 'Наличные', 'Электронные деньги'];
    paymentOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      this.paymentMethodSelect.appendChild(optionElement);
    });

    this.addressInput = document.createElement('input');
    this.addressInput.placeholder = 'Введите адрес доставки';

    this.submitButton = document.createElement('button');
    this.submitButton.textContent = 'Подтвердить заказ';
    
    // Слушаем событие на кнопку подтверждения
    this.submitButton.addEventListener('click', () => this.submitOrder());
    
    // Составляем форму
    this.createForm();
  }

  // Метод для создания формы
  private createForm(): void {
    const formContainer = document.createElement('div');
    formContainer.classList.add('order-form');

    formContainer.appendChild(this.paymentMethodSelect);
    formContainer.appendChild(this.addressInput);
    formContainer.appendChild(this.submitButton);

    return formContainer;
  }

  // Метод для получения данных заказа
  getOrderData(): IOrderData | null {
    return this.orderData;
  }

  // Метод для обработки подтверждения заказа
  private submitOrder(): void {
    const paymentMethod = (this.paymentMethodSelect as HTMLSelectElement).value;
    const address = (this.addressInput as HTMLInputElement).value;

    if (address.trim() === '') {
      alert('Пожалуйста, введите адрес доставки.');
      return;
    }

    this.orderData = {
      paymentMethod,
      address,
    };

    console.log('Данные заказа:', this.orderData);

    // Скрываем модальное окно
    alert('Ваш заказ подтверждён!');
  }
}