export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string, 
        data: object, 
        method?: ApiPostMethods): Promise<T>;
}

export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface ValidationErrors {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

export interface IOrder {
  products: IProduct[];
  buyer: {
    payment: TPayment;
    address: string;
    phone: string;
    email: string;
  };
}

export interface IOrderResponse {
  id: string;
  total: number;
}
