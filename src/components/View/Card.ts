import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
  render(data: IProductItem): HTMLElement;
}

export class Card implements ICard {
  protected _cardElement: HTMLElement;
  protected _categoryElement: HTMLElement;
  protected _titleElement: HTMLElement;
  protected _imageElement: HTMLImageElement;
  protected _priceElement: HTMLElement;
  protected _colors = <Record<string, string>>{
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other",
  }
  
  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this._categoryElement = this._cardElement.querySelector('.card__category');
    this._titleElement = this._cardElement.querySelector('.card__title');
    this._imageElement = this._cardElement.querySelector('.card__image');
    this._priceElement = this._cardElement.querySelector('.card__price');
    
    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

  protected setText(element: HTMLElement, value: unknown): string {
    if (element) {
      return element.textContent = String(value);
    }
  }

  set cardCategory(value: string) {
    this.setText(this._categoryElement, value);
    this._categoryElement.className = `card__category card__category_${this._colors[value]}`
  }

  protected setPrice(value: number | null): string {
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }

  render(data: IProductItem): HTMLElement {
    this._categoryElement.textContent = data.category;
    this.cardCategory = data.category;
    this._titleElement.textContent = data.title;
    this._imageElement.src = data.image;
    this._imageElement.alt = this._titleElement.textContent;
    this._priceElement.textContent = this.setPrice(data.price);
    return this._cardElement;
  }
}