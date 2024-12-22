export interface IPage {
	addElement(context: HTMLElement): void;
}

export class Page implements IPage {
	protected _pageElement: HTMLElement;
	protected _galleryElement: HTMLElement;

	constructor(pageContainer: HTMLElement) {
		this._pageElement = pageContainer;
		this._galleryElement = this._pageElement.querySelector('.gallery');
	}

	addElement(context: HTMLElement): void {
		this._galleryElement.append(context);
	}

	// Блокировка прокрутки страницы
	lockPage(): void {
		this._pageElement.classList.add('page__wrapper_locked');
	}

	// Снятие блокировки прокрутки страницы
	unlockPage(): void {
		this._pageElement.classList.remove('page__wrapper_locked');
	}
}
