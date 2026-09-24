import { IForm, IBuyer } from "../../../types/index";
import { FormParent } from "./FormParent";
import { IEvents } from "../../../components/base/Events";
import { ensureElement } from "../../../utils/utils";

interface IFormContacts extends IForm {
  email: string;
  phone: string;
}

export class FormContacts extends FormParent<IFormContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
  }

  set email(value: IFormContacts['email']) {
    this.emailInput.value = value ?? '';
  }

  set phone(value: IFormContacts['phone']) {
    this.phoneInput.value = value ?? '';
  }
}