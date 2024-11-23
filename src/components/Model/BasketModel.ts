import { IProductItem } from "../../types";


export interface IBasketModel {
  basketProducts: IProductItem[];
  getQuantity: () => number;
  getProductsSum: () => number;
  addItemToBasket(data: IProductItem): void;
  deleteItemFromBasket(item: IProductItem): void;
  clearBasket(): void
}

export class BasketModel implements IBasketModel {
  // список товаров, добавленных в корзину.
  protected _basketProducts: IProductItem[];

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: IProductItem[]) {
    this._basketProducts = data;
  }

  get basketProducts() {
    return this._basketProducts;
  }

  // получает количество товаров в корзине.
  getQuantity() {
    return this.basketProducts.length;
  }

  // считает и выводит сумму всех товаров в корзине.
  getProductsSum() {
    let sumAll = 0;
    this.basketProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  // добавляет товар в корзину.
  addItemToBasket(data: IProductItem) {
    const itemExists = this._basketProducts.some(item => item.id === data.id);
    if (!itemExists) {
      this._basketProducts.push(data);
    }
  }

  // удаляет товар из корзины.
  deleteItemFromBasket(item: IProductItem) {
    const index = this._basketProducts.indexOf(item);
    if (index >= 0) {
      this._basketProducts.splice(index, 1);
    }
  }

  // очищает корзину
  clearBasket() {
    this.basketProducts = []
  }
}