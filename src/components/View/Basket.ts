import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  orderButton: HTMLButtonElement;
  basketItemQuantity: HTMLElement;
  renderBasketQuantity(value: number): void;
  renderTotal(sumAll: number): void;
  render(): HTMLElement;
}

export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  orderButton: HTMLButtonElement;
  basketPrice: HTMLElement;
  button: HTMLButtonElement;
  basketItemQuantity: HTMLElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.orderButton = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    this.button = document.querySelector('.header__basket');
    this.basketItemQuantity = document.querySelector('.header__basket-counter');
    
    this.orderButton.addEventListener('click', () => { this.events.emit('order:open') });
    this.button.addEventListener('click', () => { this.events.emit('basket:open') });

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.orderButton.removeAttribute('disabled');
    } else {
      this.orderButton.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  renderBasketQuantity(value: number) {
    this.basketItemQuantity.textContent = String(value);
  }
  
  renderTotal(sumAll: number) {
    this.basketPrice.textContent = String(sumAll + ' синапсов');
  }

  render() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }
}