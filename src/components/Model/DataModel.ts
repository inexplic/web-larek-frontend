import { IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface IDataModel {
  productCards: IProductItem[];
  selectedCard: IProductItem;
  setPreview(item: IProductItem): void;
}

export class DataModel implements IDataModel {
  protected _productCards: IProductItem[];
  selectedCard: IProductItem;

  constructor(protected events: IEvents) {
    this._productCards = []
  }

  set productCards(data: IProductItem[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  get productCards() {
    return this._productCards;
  }

  setPreview(item: IProductItem) {
    this.selectedCard = item;
    this.events.emit('modalCard:open', item)
  }
}