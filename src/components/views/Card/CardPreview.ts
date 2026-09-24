import { ensureElement } from "../../../utils/utils";
import { ICard, IProduct, ICardActions } from "../../../types/index";
import { CardParent } from "./CardParent";
import { categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

interface ICardPreview extends ICard {
  category: string;
  image: IProduct['image'];
  description: string;
  buttonText?: string;
  buttonDisabled?: boolean;
}

export class CardPreview extends CardParent<ICardPreview> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.actionButton.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
  
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}