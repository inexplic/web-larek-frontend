import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";
import { cloneTemplate } from "../../utils/utils";

export interface ICard {
  render(data: IProductItem): HTMLElement;
}

export class Card implements ICard {
  protected _cardElement: HTMLElement;
  protected _categoryElement: HTMLElement;
  protected _titleElement: HTMLElement;
  protected _imageElement: HTMLImageElement;
  protected _priceElement: HTMLElement;
  protected _buttonDelete?: HTMLButtonElement; // Только для корзины
  protected _isBasketItem: boolean; // Флаг для различения карточки и элемента корзины
  protected _colors = <Record<string, string>>{
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other",
  }

  constructor(
    template: HTMLTemplateElement,
    protected events: IEvents,
    actions?: IActions,
    isBasketItem: boolean = false
  ) {
    this._isBasketItem = isBasketItem;

    this._cardElement = cloneTemplate(template);
    this._categoryElement = this._cardElement.querySelector('.card__category');
    this._titleElement = this._cardElement.querySelector('.card__title');
    this._imageElement = this._cardElement.querySelector('.card__image');
    this._priceElement = this._cardElement.querySelector('.card__price');

    if (this._isBasketItem) {
      this._buttonDelete = this._cardElement.querySelector('.basket__item-delete');
      if (actions?.onClick) {
        this._buttonDelete.addEventListener('click', actions.onClick);
      }
    } else if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

  protected setText(element: HTMLElement, value: unknown): string {
    if (element) {
      return (element.textContent = String(value));
    }
  }

  protected setPrice(value: number | null): string {
    if (value === null) {
      return 'Бесценно';
    }
    return String(value) + ' синапсов';
  }

  set cardCategory(value: string) {
    if (!this._isBasketItem) {
      this.setText(this._categoryElement, value);
      this._categoryElement.className = `card__category card__category_${this._colors[value]}`
    }
  }

  render(data: IProductItem, index?: number): HTMLElement {
    this.cardCategory = data.category;
    this._titleElement.textContent = data.title;
    this._priceElement.textContent = this.setPrice(data.price);

    if (this._isBasketItem && index !== undefined) {
      const indexElement = this._cardElement.querySelector('.basket__item-index');
      if (indexElement) {
        indexElement.textContent = String(index);
      }
    } else {
      this._categoryElement.textContent = data.category;
      this._imageElement.src = data.image;
      this._imageElement.alt = this._titleElement.textContent;
    }

    return this._cardElement;
  }
}