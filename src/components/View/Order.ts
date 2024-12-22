import { IEvents } from "../base/events";
import { BaseForm } from "./BaseForm";

export class Order extends BaseForm {
  private buttonAll: HTMLButtonElement[];

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.buttonAll = Array.from(this.form.querySelectorAll('.button_alt'));

    this.buttonAll.forEach(item => {
      item.addEventListener('click', () => {
        const paymentMethod = item.name || '';
        this.events.emit('order:paymentSelection', { paymentMethod });
      });
    });

    this.form.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit('order:changeAddress', { field, value });
    });
  }

  // Устанавливаем обводку вокруг выбранного метода оплаты
  paymentSelection(paymentMethod: string) {
    this.buttonAll.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    });
  }
  
  // Обработчик события submit
  protected onSubmit(): void {
    this.events.emit('contacts:open');
  }
}