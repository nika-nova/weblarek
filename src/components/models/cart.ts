import { IProduct } from "../../types/index"
import { IEvents } from "../base/Events"

export class Cart {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  public getItems(): IProduct[] {
    return [...this.items];
  }

  public addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit('cart-item-added', item);
    this.events.emit('cart-updated', { items: this.items, total: this.getTotalPrice(), count: this.getCount() });
  }

  public removeItem(item: IProduct): void {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index === -1) return;

    const removed = this.items.splice(index, 1)[0];
    this.events.emit('cart-item-removed', removed);
    this.events.emit('cart-updated', { items: this.items, total: this.getTotalPrice(), count: this.getCount() });
  }

  public clear(): void {
    const clearedItems = [...this.items];
    this.items = [];
    this.events.emit('cart-cleared', clearedItems);
    this.events.emit('cart-updated', { items: [], total: 0, count: 0 });
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