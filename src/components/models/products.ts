import { IProduct } from "../../types/index"
import { IEvents } from "../base/Events"

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {}

  public setProducts(products: IProduct[]): void {
    this.products = [...products];
    this.events.emit("products-updated", products);
  }
  public getProducts(): IProduct[] {
    return [...this.products];
  }
  public getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }
  public setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('product-selected', product);
  }

  public getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}