const products = [
  {
    id: 1,
    title: 'Наушники SonicWave Pro',
    category: 'audio',
    price: 14990,
    discountPercent: 10,
    rating: 4.8,
    isAvailable: true,
    badge: 'hit',
    badgeText: 'Хит',
    image: 'images/naushniki.jpg',
    description: 'Беспроводные наушники с активным шумоподавлением и автономностью до 30 часов.',
    specs: {
      type: 'Накладные, беспроводные',
      connection: 'Bluetooth 5.3 / 3.5 мм',
      battery: 'До 30 часов',
      anc: 'Активное (ANC)',
      weight: '250 г'
    }
  },
  {
    id: 2,
    title: 'Смарт-часы FitPulse X',
    category: 'wearables',
    price: 9500,
    discountPercent: 0,
    rating: 4.6,
    isAvailable: true,
    badge: '',
    badgeText: '',
    image: 'images/chasiki.jpg',
    description: 'Умные часы с AMOLED-экраном, мониторингом сна, пульса и встроенным GPS.',
    specs: {
      type: 'Смарт-часы',
      connection: 'Bluetooth 5.2, GPS',
      battery: 'До 10 дней',
      anc: 'Датчики пульса и SpO2',
      weight: '42 г'
    }
  },
  {
    id: 3,
    title: 'Клавиатура KeyMaster RGB',
    category: 'accessories',
    price: 6500,
    discountPercent: 15,
    rating: 4.7,
    isAvailable: true,
    badge: 'sale',
    badgeText: 'Скидка',
    image: 'images/clava.jpg',
    description: 'Игровая механическая клавиатура с быстрыми переключателями и настраиваемой подсветкой.',
    specs: {
      type: 'Механическая клавиатура 75%',
      connection: 'USB-C / 2.4 ГГц / Bluetooth',
      battery: '4000 мАч',
      anc: 'Hot-swap переключатели',
      weight: '780 г'
    }
  },
  {
    id: 4,
    title: 'TWS-наушники AirBeat Mini',
    category: 'audio',
    price: 5490,
    discountPercent: 0,
    rating: 4.4,
    isAvailable: true,
    badge: '',
    badgeText: '',
    image: 'images/miniushi.jpg',
    description: 'Компактные внутриканальные наушники для города и тренировок с защитой IPX5.',
    specs: {
      type: 'Внутриканальные TWS',
      connection: 'Bluetooth 5.3',
      battery: 'До 24 часов с кейсом',
      anc: 'Шумоподавление при звонках',
      weight: '45 г'
    }
  },
  {
    id: 5,
    title: 'Портативная колонка PulseBoom Go',
    category: 'audio',
    price: 8200,
    discountPercent: 10,
    rating: 4.5,
    isAvailable: false,
    badge: 'sale',
    badgeText: 'Скидка',
    image: 'images/colonka.jpg',
    description: 'Мощный звук в компактном корпусе с защитой от влаги и пыли по стандарту IP67.',
    specs: {
      type: 'Портативная акустика',
      connection: 'Bluetooth 5.1 / AUX',
      battery: 'До 16 часов',
      anc: 'Пассивные излучатели',
      weight: '620 г'
    }
  },
  {
    id: 6,
    title: 'Фитнес-браслет BandLite 4',
    category: 'wearables',
    price: 3490,
    discountPercent: 0,
    rating: 4.3,
    isAvailable: true,
    badge: '',
    badgeText: '',
    image: 'images/braslet.jpg',
    description: 'Лёгкий браслет с круглосуточным трекингом активности и 100 спортивными режимами.',
    specs: {
      type: 'Фитнес-браслет',
      connection: 'Bluetooth 5.2',
      battery: 'До 14 дней',
      anc: 'Водонепроницаемость 5 ATM',
      weight: '24 г'
    }
  },
  {
    id: 7,
    title: 'Смарт-часы ChronoWatch Pro',
    category: 'wearables',
    price: 17900,
    discountPercent: 8,
    rating: 4.9,
    isAvailable: true,
    badge: 'hit',
    badgeText: 'Хит',
    image: 'images/braslet.jpg',
    description: 'Премиальный корпус из титана, сапфировое стекло и расширенная аналитика здоровья.',
    specs: {
      type: 'Смарт-часы Pro',
      connection: 'Bluetooth 5.3, Wi-Fi, GPS',
      battery: 'До 12 дней',
      anc: 'ЭКГ и датчик температуры',
      weight: '54 г'
    }
  },
  {
    id: 8,
    title: 'Беспроводная мышь GlidePro 16K',
    category: 'accessories',
    price: 4290,
    discountPercent: 0,
    rating: 4.6,
    isAvailable: true,
    badge: '',
    badgeText: '',
    image: 'images/mishka.jpg',
    description: 'Эргономичная мышь с сенсором до 16 000 DPI и тихими микропереключателями.',
    specs: {
      type: 'Беспроводная мышь',
      connection: 'USB-C / 2.4 ГГц / Bluetooth',
      battery: 'До 70 часов',
      anc: 'Сенсор 16 000 DPI',
      weight: '72 г'
    }
  },
  {
    id: 9,
    title: 'Зарядная станция PowerDock 3-in-1',
    category: 'accessories',
    price: 5900,
    discountPercent: 5,
    rating: 4.5,
    isAvailable: true,
    badge: '',
    badgeText: '',
    image: 'images/zaryadka.jpg',
    description: 'Одновременная беспроводная зарядка смартфона, смарт-часов и наушников.',
    specs: {
      type: 'Док-станция 3-в-1',
      connection: 'USB-C PD / Qi',
      battery: 'Сетевое питание',
      anc: 'Защита от перегрева',
      weight: '290 г'
    }
  }
];

const promoCodes = {
  TECHNOVA10: 10,
  START5: 5
};