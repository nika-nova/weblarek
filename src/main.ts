import './scss/styles.scss';
import { Products } from './components/models/products';
import { Cart } from './components/models/cart';
import { Buyer } from './components/models/buyer';
import { apiProducts } from './utils/data';
import { ApiService } from './components/services/apiService';
import { IApi } from './types/index';
import { Api } from './components/base/Api';
import { IEvents, EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';

async function main() {
  console.log('🚀 Запуск приложения...');

  // 1. Создание экземпляров всех созданных классов
  const events: IEvents = new EventEmitter();

  const productsModel = new Products(events);
  const cartModel = new Cart(events);
  const buyerModel = new Buyer(events);

  const apiClient: IApi = new Api(API_URL);
  const apiService = new ApiService(apiClient);

  console.log('1. Экземпляры классов созданы.');

  // ---------------------------------------------------------
  // 2. Тестирование всех методов моделей данных (на локальных данных)
  
  console.log('2. Тестирование моделей данных на локальных тестовых данных...');

  productsModel.setProducts(apiProducts.items);
  console.log('Вызван setProducts(). Товары загружены в модель.');

  const allProducts = productsModel.getProducts();
  console.log(`getProducts() вернул следующее кол-во товаров: ${allProducts.length}.`);

  const testId = '854cef69-976d-4c2a-a18c-2aa45046c390';
  const productById = productsModel.getProductById(testId);

  if (!productById) {
    console.error(`❌ Товар с ID ${testId} НЕ найден в локальном каталоге!`);
  } else {
    console.log(`✅ Товар найден: ${productById.title} (${productById.price} синапсов)`);

    productsModel.setSelectedProduct(productById);
    console.log('Вызван setSelectedProduct(). Товар помечен как выбранный.');

    const selected = productsModel.getSelectedProduct();
    if (selected) {
      console.log(`getSelectedProduct(): выбран товар ${selected.title}`);
    }

    cartModel.addItem(productById);
    console.log('Вызван cartModel.addItem(). Товар добавлен в корзину.');

    const cartItems = cartModel.getItems();
    console.log(`🛒 getItems() кол-во товаров в корзине: ${cartItems.length}.`);
    console.log('getTotalPrice():', cartModel.getTotalPrice());
  }

  const validationErrors = buyerModel.validate();
  if (Object.keys(validationErrors).length === 0) {
    console.log('Покупатель валиден (нет ошибок).');
  } else {
    console.warn('⚠️ Ошибки валидации покупателя:', validationErrors);
  }

  // ---------------------------------------------------------
  // 3. Запрос к серверу за объектом с данными каталога

  console.log('3. Запрос каталога товаров с сервера...');
  try {
    const response = await apiService.getProducts();
    console.log('Ответ сервера получен.');

    // ---------------------------------------------------------
    // 4. Сохранение массива в модели данных и вывод в консоль
    
    productsModel.setProducts(response.items);
    console.log('4. Массив товаров сохранён в модели данных через setProducts().');

    const serverProducts = productsModel.getProducts();
    console.log(`После загрузки с сервера getProducts() вернул: ${serverProducts.length} товаров.`);

    if (serverProducts.length > 0) {
      const first = serverProducts[0];
      console.log('Пример товара из серверного каталога:', {
        id: first.id,
        title: first.title,
        price: first.price,
      });
    }

  } catch (error) {
    console.error('❌ Ошибка при запросе к серверу:', error);
  }

  console.log('🎉 Тестирование завершено.');
}

main();