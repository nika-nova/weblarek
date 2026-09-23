import { IBuyer, TPayment, BuyerValidationErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
    private payment: TPayment | null = null;
    private address: string = "";
    private phone: string = "";
    private email: string = "";

    private touched = {
        payment: false,
        address: false,
        phone: false,
        email: false,
    };

    constructor(private events: IEvents) {}

    public update(data: Partial<IBuyer>): void {

      if (data.payment !== undefined) {
        this.payment = data.payment;
        this.touched.payment = true;
      }
      if (data.address !== undefined) {
        this.address = data.address;
        this.touched.address = true;
      }
      if (data.phone !== undefined) {
        this.phone = data.phone;
        this.touched.phone = true;
      }
      if (data.email !== undefined) {
        this.email = data.email;
        this.touched.email = true;
      }

      this.events.emit('buyer:changed', this.get());
    }

    public get(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    public clear(): void {
        this.payment = null;
        this.address = "";
        this.phone = "";
        this.email = "";
        this.touched = {
            payment: false,
            address: false,
            phone: false,
            email: false,
        };

        this.events.emit('buyer:changed');
    }

    public validate(): BuyerValidationErrors {
        const errors: BuyerValidationErrors = {};

        if (!this.payment) {
            errors.payment = "Не выбран вид оплаты";
        }

        if (!this.address || this.address.trim() === "") {
            errors.address = "Укажите адрес доставки";
        }

        if (!this.phone || this.phone.trim() === "") {
            errors.phone = "Укажите номер телефона";
        }

        if (!this.email || this.email.trim() === "") {
            errors.email = "Укажите email";
        }

        return errors;
    }

    public getDisplayErrors(): BuyerValidationErrors {
        const errors: BuyerValidationErrors = {};

        if (this.touched.payment && !this.payment) {
            errors.payment = "Не выбран вид оплаты";
        }
        if (this.touched.address && (!this.address || this.address.trim() === "")) {
            errors.address = "Укажите адрес доставки";
        }
        if (this.touched.phone && (!this.phone || this.phone.trim() === "")) {
            errors.phone = "Укажите номер телефона";
        }
        if (this.touched.email && (!this.email || this.email.trim() === "")) {
            errors.email = "Укажите email";
        }

        return errors;
    }
}