import { ensureElement } from "../../../utils/utils";
import { ICard, ICardActions } from "../../../types/index";
import { CardParent } from "./CardParent";

interface ICardCart extends ICard {
  index: number;
}

export class CardCart extends CardParent<ICardCart> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onDelete) {
      this.deleteButton.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}