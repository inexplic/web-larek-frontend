import { ApiListResponse, Api } from '../base/api'
import { IOrderLot, IOrderResult, IProductItem } from '../../types';

export interface IApiModel {
  cdn: string;
  items: IProductItem[];
  getProductItems: () => Promise<IProductItem[]>;
  postOrder: (order: IOrderLot) => Promise<IOrderResult>;
}

export class ApiModel extends Api {
  cdn: string;
  items: IProductItem[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // получаем массив карточек с сервера.
  getProductItems(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // отправляем запрос на сервер по сделанному/отправленному заказу.
  postOrder(order: IOrderLot): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}