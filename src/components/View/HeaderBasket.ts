import { IEvents } from "../base/events";

export class HeaderBasket {
  private buttonBasket: HTMLButtonElement;
  private counterElement: HTMLElement;
  
  constructor(buttonBasket: HTMLButtonElement, protected events: IEvents) {
    this.buttonBasket = buttonBasket;
    this.counterElement = this.buttonBasket.querySelector('.header__basket-counter');

    this.buttonBasket.addEventListener('click', () => { this.events.emit('basket:open') });
  }
  
  updateQuantity(quantity: number) {
    this.counterElement.textContent = String(quantity);
  }
}