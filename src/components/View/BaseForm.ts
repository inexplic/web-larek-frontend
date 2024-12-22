import { IEvents } from '../base/events';

export abstract class BaseForm {
	protected form: HTMLFormElement;
	protected buttonSubmit: HTMLButtonElement;
	private formErrors: HTMLElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.form = template.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.buttonSubmit = this.form.querySelector('.order__button');
		this.formErrors = this.form.querySelector('.form__errors');

		this.form.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.onSubmit();
		});
	}

	// Устанавливаем доступность кнопки отправки
	set valid(value: boolean) {
		this.buttonSubmit.disabled = !value;
	}

	protected abstract onSubmit(): void;

	public updateErrorMessage(message: string): void {
		if (this.formErrors) {
		  this.formErrors.textContent = message;
		}
	  }

	render(): HTMLFormElement {
		return this.form;
	}
}
