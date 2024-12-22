import { cloneTemplate, createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IBasket {
  renderTotal(sumAll: number): void;
  render(): HTMLElement;
}

export class Basket implements IBasket {
  private basket: HTMLElement;
  private title: HTMLElement;
  private basketList: HTMLElement;
  private orderButton: HTMLButtonElement;
  private basketPrice: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = cloneTemplate(template);
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.orderButton = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');

    this.orderButton.addEventListener('click', () => { this.events.emit('order:open') });

    this.title.textContent = 'Корзина';
    this.updateItemsList([]);
  }

  // Метод для обновления списка товаров в корзине
  private updateItemsList(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.orderButton.removeAttribute('disabled');
    } else {
      this.orderButton.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  // Метод для изменения списка товаров
  public set items(items: HTMLElement[]) {
    this.updateItemsList(items);
  }

  // Метод для обновления общей стоимости
  public renderTotal(sumAll: number) {
    this.basketPrice.textContent = `${sumAll} синапсов`;
  }

  render() {
    return this.basket;
  }
}