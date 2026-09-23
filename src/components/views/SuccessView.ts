import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
  total: string;
}

export class SuccessView extends Component<ISuccess> {
  protected totalElement: HTMLParagraphElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.totalElement = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
  }

  set total(value: string) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}