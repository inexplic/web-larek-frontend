import { IEvents } from '../base/events';
import { FormErrors } from '../../types/index'

export interface IFormModel {
  getPayment(): string;
  setPayment(paymentData: { paymentMethod: string }): void;

  getEmail(): string;
  setEmail(value: string): void;

  getPhone(): string;
  setPhone(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getFormErrors(): FormErrors;

  setOrderAddress(field: string, value: string): void;
  validateAdress(): boolean;
  setOrderData(field: string, value: string): void;
  validateContacts(): boolean;
  getOrderData(): {
    email: string;
    phone: string;
    address: string;
    payment: string;
  };
}

export class FormModel implements IFormModel {
  private payment: string;
  private email: string;
  private phone: string;
  private address: string;
  private formErrors: FormErrors = {};

  constructor(protected events: IEvents) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  getPayment() {
    return this.payment;
  }

  setPayment(paymentData: { paymentMethod: string }) {
    const { paymentMethod } = paymentData;
    this.payment = paymentMethod;
    this.validateAdress(); // Проверка ошибок, связанных с оплатой
  }

  getEmail() {
    return this.email;
  }

  setEmail(value: string) {
    this.email = value;
  }

  getPhone() {
    return this.phone;
  }

  setPhone(value: string) {
    this.phone = value;
  }

  getAddress() {
    return this.address;
  }

  setAddress(value: string) {
    this.address = value;
  }

  getFormErrors() {
    return this.formErrors;
  }

  // принимаем значение строки "address"
  setOrderAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;
    }

    if (this.validateAdress()) {
      this.getOrderData();
    }
  }

  // валидация данных строки "address"
  validateAdress() {
    const errors: typeof this.formErrors = {};

    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    }
    
    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:address', this.getFormErrors());
    return Object.keys(errors).length === 0;
  }

  // принимаем значение данных строк "Email" и "Телефон"
  setOrderData(field: string, value: string) {
    if (field === 'email') {
      this.email = value;
    } else if (field === 'phone') {
      this.phone = value;
    }

    if (this.validateContacts()) {
      this.getOrderData();
    }
  }

  // Валидация данных строк "Email" и "Телефон"
  validateContacts() {
    const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
    const errors: typeof this.formErrors = {};

    if (!this.email) {
      errors.email = 'Необходимо указать email'
    } else if (!regexpEmail.test(this.email)) {
      errors.email = 'Некорректный адрес электронной почты'
    }

    if (this.phone.startsWith('8')) {
      this.phone = '+7' + this.phone.slice(1);
    }

    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон'
    } else if (!regexpPhone.test(this.phone)) {
      errors.phone = 'Некорректный формат номера телефона'
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.getFormErrors());
    return Object.keys(errors).length === 0;
  }

  getOrderData() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    }
  }
}