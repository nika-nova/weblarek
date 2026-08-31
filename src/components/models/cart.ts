import { IProduct } from "../../types/index"
import { IEvents } from "../base/Events"

export class Cart {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  private emitCartUpdate(): void {
    this.events.emit('cart-updated', {
      items: this.items,
      total: this.getTotalPrice(),
      count: this.getCount(),
    });
  }

  public getItems(): IProduct[] {
    return [...this.items];
  }

  public addItem(item: IProduct): void {
    this.items.push(item);
    this.emitCartUpdate();
  }

  public removeItem(item: IProduct): void {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index === -1) return;

    this.items.splice(index, 1);
    this.emitCartUpdate();
  }

  public clear(): void {
    this.items = [];
    this.emitCartUpdate();
  }

  public getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : 0), 0);
  }

  public getCount(): number {
    return this.items.length;
  }
  
  public hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}