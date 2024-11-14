export type ProductItem = {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

type ProductItemResponce = {
    total: number;
    item: ProductItem[];
}

type OrderPayload = {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

type OrderResponce = {
    id: string;
    total: number;
}