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
    setOrderAddress(field: string, value: string): void
    setOrderData(field: string, value: string): void
    setOrderPayMethod(field: string, value: string) : void
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
    getQuantity() {
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
    setOrderAddress(field: string, value: string) {
     // логика
    }
  
    // принимаем значение данных строк "Email" и "Телефон"
    setOrderData(field: string, value: string) {
      // логика
    }

      // принимаем значение данных строк метода оплаты
      setOrderPayMethod(field: string, value: string) {
        // логика
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
    render(): HTMLElement;
  }

  export class Basket implements IBasket {
    basket: HTMLElement;
    title: HTMLElement;
    basketList: HTMLElement;
    button: HTMLButtonElement;
    basketPrice: HTMLElement;
    headerButton: HTMLButtonElement;
    headerCounter: HTMLElement;
// логика класса
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
    setText: (value: string | unknown) => void
    setCategory:  (value: string | unknown) => void
    setPrice: (value: number | unknown) => void
  } 

  class Card implements ICard {}


  interface ICardPreview {
    text: HTMLElement;
    button: HTMLElement;
    notForSale(data:IProductItem): void;
    render(data: IProductItem): HTMLElement;
  }

  class CardPreview extends Card implements ICard {
    
  }