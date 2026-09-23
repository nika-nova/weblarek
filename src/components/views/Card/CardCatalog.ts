import { IProduct, ICard, ICardActions } from "../../../types/index";
import { CardParent } from "./CardParent";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";

type CategoryKey = keyof typeof categoryMap;

interface ICardCatalog extends ICard {
  image: IProduct['image'];
  category: IProduct['image'];
}

export class CardCatalog extends CardParent<ICardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
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
    this.setImage(this.imageElement, value, this.title);
  }
}