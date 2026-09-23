import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IForm, IBuyer } from "../../../types/index";
import { IEvents } from "../../../components/base/Events";

export abstract class FormParent<T extends IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorELement: HTMLElement;
  protected formElement: HTMLFormElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.formElement = container;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorELement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();

      this.events.emit(`${(this.container as HTMLFormElement).name}:submit`);
    });

    this.formElement.addEventListener('input', (e) => {
      const target = e?.target as HTMLInputElement;

      this.events.emit(`${(this.container as HTMLFormElement).name}:change`, {
      [target.name]: target.value,
      } as Partial<IBuyer>);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set error(value: string) {
    this.errorELement.textContent = value;
  }
}