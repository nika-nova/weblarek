import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: string | HTMLElement | HTMLFormElement;
}

export class Modal extends Component<IModal> {
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: string | HTMLElement) {
    if (typeof value === 'string') {
      this.contentElement.innerHTML = value;
      return;
    }

    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(value);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.innerHTML = '';
  }
}