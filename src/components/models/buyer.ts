import { IBuyer, TPayment, ValidationErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string | null = null;
  private phone: string | null = null;
  private email: string | null = null;

  constructor(private events: IEvents) {}

  public update(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }

    const current = this.get(); // может быть null
    if (current) {
      this.events.emit('buyer-updated', current);
    }
  }

  public get(): IBuyer | null {
    if (!this.payment || !this.address || !this.phone || !this.email) {
      return null;
    }

    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  public clear(): void {
    const currentData = this.get();
    this.payment = null;
    this.address = null;
    this.phone = null;
    this.email = null;

    if (currentData) {
      this.events.emit('buyer-cleared', currentData);
    }
  }

  public validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите номер телефона';
    }

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    return errors;
  }
}