import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ICartView {
  products: HTMLElement[];
  total: string;
  placeOrderDisabled: boolean;
}

export class CartView extends Component<ICartView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected placeOrderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.placeOrderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.placeOrderButton.addEventListener("click", () => {
      this.events.emit('cart:makeOrder');
    });
  }

  set products(value: HTMLElement[]) {
    this.listElement.innerHTML = '';
    value.forEach((item) => {
      this.listElement.appendChild(item);
    });

    this.placeOrderDisabled = value.length === 0;
  }

  set total(value: string) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set placeOrderDisabled(value: boolean) {
    this.placeOrderButton.disabled = value;
  }
}