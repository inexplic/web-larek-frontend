import { IEvents } from "../base/events";
import { BaseForm } from "./BaseForm";

export class Contacts extends BaseForm {
  private inputAll: HTMLInputElement[];

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.inputAll = Array.from(this.form.querySelectorAll('.form__input'));

    this.inputAll.forEach(item => {
      item.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;
        const value = target.value;
        this.events.emit('contacts:changeInput', { field, value });
      });
    });
  }

  // Обработчик события submit
  protected onSubmit(): void {
    this.events.emit('success:open');
  }
}