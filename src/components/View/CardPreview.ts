import { Card } from "./Card";
import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
  text: HTMLElement;
  button: HTMLElement;
  render(data: IProductItem, index?: number): HTMLElement;
}

export class CardPreview extends Card implements ICard {
  text: HTMLElement;
  button: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    super(template, events, actions);
    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');
    this.button.addEventListener('click', () => {
      if (!this.button.hasAttribute('disabled')) {
        this.events.emit('card:addBasket');
      }
    });
  }

  private updateButtonState(data: IProductItem, basketItems: IProductItem[]) {
    const isInBasket = basketItems.some(item => item.id === data.id);

    if (data.price === null) {
      this.button.textContent = 'Не продается';
      this.button.setAttribute('disabled', 'true');
    } else if (isInBasket) {
      this.button.textContent = 'В корзине';
      this.button.setAttribute('disabled', 'true');
    } else {
      this.button.textContent = 'Купить';
      this.button.removeAttribute('disabled');
    }
  }

  render(data: IProductItem, index?: number, basketItems: IProductItem[] = []): HTMLElement {
    this._categoryElement.textContent = data.category;
    this.cardCategory = data.category;
    this._titleElement.textContent = data.title;
    this._imageElement.src = data.image;
    this._imageElement.alt = this._titleElement.textContent;
    this._priceElement.textContent = this.setPrice(data.price);
    this.text.textContent = data.description;

    // Обновляем состояние кнопки на основании данных о товаре и корзине
    this.updateButtonState(data, basketItems);

    return this._cardElement;
  }
}