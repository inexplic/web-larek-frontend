import './scss/styles.scss';
import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();

interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

class ItemsModel {
    private api: Api;

    constructor(baseUrl: string) {
        this.api = new Api(baseUrl);
    }

    async getProducts(): Promise<IProductItem[]> {
        const response = await this.api.get('/product/');
        console.log(response);
        const items = (response as any).items as IProductItem[];

        return items.map(item => ({
            ...item,
            image: `${CDN_URL}/${item.image}`
        }));
    }
}

class ItemsView {
    private galleryElement: HTMLElement;
    private events: EventEmitter;

    constructor(gallerySelector: string, events: EventEmitter) {
        const element = document.querySelector(gallerySelector);
        if (!element) throw new Error(`Element ${gallerySelector} not found`);
        this.galleryElement = element as HTMLElement;
        this.events = events;

        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.galleryElement.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const card = target.closest('.card') as HTMLElement;
            if (card && card.dataset.id) {
                this.events.emit('card:click', { id: card.dataset.id });
            }
        });
    }

    render(products: { id: string, title: string, category: string, price: number, image: string }[]): void {
        this.galleryElement.innerHTML = '';
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        if (!template) throw new Error('Card template not found');

        products.forEach(product => {
            const productElement = template.content.cloneNode(true) as HTMLElement;
            const card = productElement.querySelector('.card') as HTMLElement;
            const title = productElement.querySelector('.card__title') as HTMLElement;
            const category = productElement.querySelector('.card__category') as HTMLElement;
            const price = productElement.querySelector('.card__price') as HTMLElement;
            const image = productElement.querySelector('.card__image') as HTMLImageElement;

            title.textContent = product.title;
            category.textContent = product.category;
            price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
            image.src = product.image;

            card.dataset.id = product.id;
            this.galleryElement.appendChild(productElement);
        });
    }
}

class ModalController {
    private modalElement: HTMLElement;
    private events: EventEmitter;

    constructor(modalSelector: string, events: EventEmitter) {
        const element = document.querySelector(modalSelector);
        if (!element) throw new Error(`Modal ${modalSelector} not found`);
        this.modalElement = element as HTMLElement;
        this.events = events;

        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.modalElement.querySelector('.modal__close')?.addEventListener('click', () => {
            this.closeModal();
        });

        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.closeModal();
            }
        });

        this.events.on('modal:open', (data: IProductItem) => {
            this.openModal(data);
        });

        const addToBasketButton = this.modalElement.querySelector('.button__add_to_basket');
        if (addToBasketButton) {
            addToBasketButton.addEventListener('click', () => {
                // Получаем данные товара из модального окна
                const title = this.modalElement.querySelector('.card__title') as HTMLElement;
                const category = this.modalElement.querySelector('.card__category') as HTMLElement;
                const price = this.modalElement.querySelector('.card__price') as HTMLElement;
                const image = this.modalElement.querySelector('.card__image') as HTMLImageElement;
                const description = this.modalElement.querySelector('.card__text') as HTMLElement;

                // Создаем объект товара
                const product: IProductItem = {
                    id: this.modalElement.dataset.id!,
                    title: title.textContent!,
                    category: category.textContent!,
                    price: parseInt(price.textContent || '0'),
                    image: image.src,
                    description: description.textContent!,
                };

                // Вызываем метод addToBasket у presenter
                this.events.emit('product:addToCart', product);
            });
        }
    }

    openModal(product: IProductItem) {
        const title = this.modalElement.querySelector('.card__title') as HTMLElement;
        const category = this.modalElement.querySelector('.card__category') as HTMLElement;
        const price = this.modalElement.querySelector('.card__price') as HTMLElement;
        const image = this.modalElement.querySelector('.card__image') as HTMLImageElement;
        const description = this.modalElement.querySelector('.card__text') as HTMLElement;

        title.textContent = product.title;
        category.textContent = product.category;
        price.textContent = product.price ? `${product.price} синапсов` : 'Бесплатно';
        image.src = product.image;
        description.textContent = product.description;

        this.modalElement.dataset.id = product.id;
        this.modalElement.classList.add('modal_active');
    }

    closeModal() {
        this.modalElement.classList.remove('modal_active');
    }
}

class ItemsPresenter {
    private productService: ItemsModel;
    private productView: ItemsView;
    private events: EventEmitter;
    private basket: IProductItem[] = [];  // Для хранения товаров в корзине

    constructor(productService: ItemsModel, productView: ItemsView, events: EventEmitter) {
        this.productService = productService;
        this.productView = productView;
        this.events = events;

        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.events.on('card:click', async ({ id }: { id: string }) => {
            const products = await this.productService.getProducts();
            const product = products.find((item) => item.id === id);
            if (product) {
                this.events.emit('modal:open', product);
            }
        });

        this.events.on('product:addToCart', (product: IProductItem) => {
            this.addToBasket(product);
        });
    }

    async initialize() {
        try {
            const products = await this.productService.getProducts();
            this.productView.render(products);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    private addToBasket(product: IProductItem) {
        // Проверка, если товар уже в корзине
        if (!this.basket.some(item => item.id === product.id)) {
            this.basket.push(product);  // Добавляем товар в корзину
            this.updateBasketView();
            console.log(`Товар с id ${product.id} добавлен в корзину!`)
        } else {
            console.log(`Товар с id ${product.id} уже в корзине.`);
        }
    }

    private updateBasketView() {
        // Обновление отображения корзины
        const basketElement = document.querySelector('.header__basket-counter') as HTMLElement;
        if (basketElement) {
            basketElement.textContent = this.basket.length.toString();  // Показываем количество товаров в корзине
        }
        // Здесь также можно обновить модальное окно корзины, если оно есть
    }
}

const productService = new ItemsModel(API_URL);
const productView = new ItemsView('.gallery', events);
const itemsPresenter = new ItemsPresenter(productService, productView, events);
const modalController = new ModalController('#product_modal', events);

itemsPresenter.initialize();