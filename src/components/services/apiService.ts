import { IApi } from '../../types/index';
import { IProductsResponse, IOrder, IOrderResponse } from '../../types/index';

export class ApiService {
  constructor(private api: IApi) {}

  async getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  async createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}
