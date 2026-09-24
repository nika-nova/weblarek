import { IForm, IBuyer } from "../../../types/index";
import { FormParent } from "./FormParent";
import { IEvents } from "../../../components/base/Events";
import { ensureElement } from "../../../utils/utils";

interface IFormPayment extends IForm {
  payment: IBuyer['payment'];
  address: string;
}

export class FormPayment extends FormParent<IFormPayment> {
  protected cardButton: HTMLElement;
  protected cashButton: HTMLElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.cardButton = ensureElement<HTMLElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit('payment:change', {
        payment: 'card'
      } as Partial<IBuyer>);
    });
    this.cashButton.addEventListener('click', () => {
      this.events.emit('payment:change', {
        payment: 'cash',
      } as Partial<IBuyer>);
    });
  }

  set payment(value: IFormPayment['payment']) {
    this.cardButton.classList.toggle("button_alt-active", value === 'card');
    this.cashButton.classList.toggle(
      'button_alt-active',
      value === "cash",
    );
  }

  set address(value: IFormPayment['address']) {
    this.addressInput.value = value ?? '';
  }
}