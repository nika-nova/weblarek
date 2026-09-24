import './scss/styles.scss';

import { IApi, IBuyer, IProduct, IOrder, BuyerValidationErrors, TPayment } from './types/index';
import { cloneTemplate, ensureElement } from "./utils/utils";

import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { API_URL, CDN_URL } from './utils/constants';
import { ApiService } from './components/services/apiService';
import { Api } from './components/base/Api';
import { IEvents, EventEmitter } from './components/base/Events';

import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { CatalogView } from './components/views/CatalogView';
import { SuccessView } from './components/views/SuccessView';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { CardPreview } from './components/views/Card/CardPreview';
import { CardCart } from './components/views/Card/CardCart';
import { CartView } from './components/views/CartView';
import { FormPayment } from './components/views/Form/FormPayment';
import { FormContacts } from './components/views/Form/FormContacts';

// =====================================================
// 1. Создание экземпляров
// =====================================================

const events: IEvents = new EventEmitter();
const apiClient: IApi = new Api(API_URL);
const apiService = new ApiService(apiClient);

// Модели
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Постоянные представления (привязаны к элементам в разметке)
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const modal = new Modal(ensureElement<HTMLElement>(".modal"), events);
const catalog = new CatalogView(ensureElement<HTMLElement>(".gallery"));

// Представления, которые рендерятся в модалку (клонируются из шаблонов)
const cardPreview = new CardPreview(
    cloneTemplate<HTMLElement>(
        ensureElement<HTMLTemplateElement>("#card-preview"),
    ),
    {
        onClick: () => {
            events.emit("preview:click");
        },
    },
);

const cartView = new CartView(
    cloneTemplate<HTMLElement>(ensureElement<HTMLTemplateElement>("#basket")),
    events,
);

const formPayment = new FormPayment(
    cloneTemplate<HTMLFormElement>(
        ensureElement<HTMLTemplateElement>("#order"),
    ),
    events,
);

const formContacts = new FormContacts(
    cloneTemplate<HTMLFormElement>(
        ensureElement<HTMLTemplateElement>("#contacts"),
    ),
    events,
);

const successModal = new SuccessView(
    cloneTemplate<HTMLElement>(ensureElement<HTMLTemplateElement>("#success")),
    events,
);

// Шаблоны для карточек (создаются динамически)
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardCartTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

// =====================================================
// 2. Вспомогательные функции
// =====================================================

function transformProduct(product: IProduct): IProduct {
  return {
    ...product,
    image: CDN_URL + product.image.replace('.svg', '.png'),
  };
}

function getErrorsText(errors: Array<string | undefined>): string {
  return errors.filter(Boolean).join('\n');
}

// =====================================================
// 3. Функции рендера
// =====================================================

function renderBuyerData(data: IBuyer, errors: BuyerValidationErrors): void {
  const displayErrors = buyerModel.getDisplayErrors();

  formPayment.render({
    payment: data.payment,
    address: data.address,
    valid: !errors.payment && !errors.address,
    error: getErrorsText([displayErrors.payment, displayErrors.address]),
  });
  formContacts.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    error: getErrorsText([displayErrors.email, displayErrors.phone]),
  });
}

function renderCatalog(products: IProduct[]): void {
  const cards = products.map((product) => {
    const card = new CardCatalog(
      cloneTemplate<HTMLElement>(cardCatalogTemplate),
      { onClick: () => events.emit('catalog:cardClick', { id: product.id }) }
    );
    return card.render({
      title: product.title,
      price: product.price,
      image: {
        src: product.image,
        alt: product.title,
      },
      category: product.category,
    });
  });
  catalog.render({ catalog: cards });
}

function renderCardPreview(product: IProduct): void {
  cardPreview.render({
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    description: product.description,
  });
  const inCart = cartModel.hasItem(product.id);
  const isAvailable = product.price !== null;
  cardPreview.render({
    buttonText: !isAvailable ? 'Недоступно' : inCart ? 'Удалить из корзины' : 'Купить',
    buttonDisabled: !isAvailable,
  });
  modal.render({ content: cardPreview.render() });
  modal.open();
}

function renderCart(): void {
  const products = cartModel.getItems();
  const cartItems = products.map((product, index) => {
    const cartItem = new CardCart(
      cloneTemplate<HTMLElement>(cardCartTemplate),
      { onDelete: () => events.emit('cart:itemDeleteClick', { item: product }) }
    );
    return cartItem.render({
      index: index + 1,
      title: product.title,
      price: product.price,
    });
  });
  
  const content = cartView.render({
    products: cartItems,
    total: cartModel.getTotalPrice().toString(),
    placeOrderDisabled: products.length === 0,
  });

  modal.render({ content });
  modal.open();
}

function renderOrderSuccess(total: number): void {
  modal.render({ content: successModal.render({ total: String(total) }) });
}

// =====================================================
// 4. Отправка заказа
// =====================================================

async function submitOrder(customerData: IBuyer): Promise<void> {
  const cartData = cartModel.getItems();
  const order: IOrder = {
    payment: customerData.payment as TPayment,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
    total: cartModel.getTotalPrice(),
    items: cartData.map((p) => p.id),
  };
  try {
    const response = await apiService.createOrder(order);
    cartModel.clear();
    buyerModel.clear();
    renderOrderSuccess(response.total);
  } catch (error) {
    console.error('Не удалось оформить заказ:', error);
  }
}

// =====================================================
// 5. Презентер
// =====================================================

// Каталог
events.on('catalog:updated', () => {
  renderCatalog(productsModel.getProducts());
});

events.on('catalog:cardClick', ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (product) {
    productsModel.setSelectedProduct(product);
  }
});

events.on('catalog:selected', () => {
  const product = productsModel.getSelectedProduct();
  if (product) renderCardPreview(product);
});

// Корзина
events.on('cart:open', () => renderCart());

events.on('cart:itemDeleteClick', ({ item }: { item: IProduct }) => {
  cartModel.removeItem(item);
});

events.on('cart:changed', () => {
  header.counter = cartModel.getCount();
  renderCart();
});

// Превью карточки → добавление/удаление из корзины
events.on('preview:click', () => {
  const product = productsModel.getSelectedProduct();
  if (!product || product.price === null) return;
  if (cartModel.hasItem(product.id)) {
    cartModel.removeItem(product);
  } else {
    cartModel.addItem(product);
  }
  modal.close();
});

// Оформление заказа
events.on('cart:makeOrder', () => {
  modal.render({ content: formPayment.render() });
  modal.open();
});

events.on('payment:change', (data: Partial<IBuyer>) => {
  buyerModel.update(data);
});

events.on('order:change', (data: Partial<IBuyer>) => {
  buyerModel.update(data);
});

events.on('buyer:changed', () => {
  renderBuyerData(buyerModel.get(), buyerModel.validate());
});

events.on('order:submit', () => {
  modal.render({ content: formContacts.render() });
  modal.open();
});

events.on('contacts:change', (data: Partial<IBuyer>) => {
  buyerModel.update(data);
});

events.on('contacts:submit', () => {
  submitOrder(buyerModel.get());
});

events.on('modal:close', () => modal.close());

// =====================================================
// 6. Первичный рендер + загрузка данных
// =====================================================

header.counter = cartModel.getCount();
renderBuyerData(buyerModel.get(), buyerModel.validate());

apiService.getProducts()
  .then((data) => data.items.map(transformProduct))
  .then((products) => productsModel.setProducts(products))
  .catch((error) => console.error('Не удалось загрузить товары:', error));