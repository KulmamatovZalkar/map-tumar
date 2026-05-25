export type Store = {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  coordinates: [number, number]; // [lng, lat] — 2GIS format
};

export const stores: Store[] = [
  {
    id: "tumar-isanova",
    city: "Бишкек",
    name: "Салон Тумар",
    address: "ул. Исанова 80/1 (пересечение с Киевской)",
    phone: "+996 555 931 680",
    coordinates: [74.591388, 42.874914],
  },
  {
    id: "cheber",
    city: "Бишкек",
    name: "Магазин Чебер",
    address: "ул. Кулиева 1",
    phone: "+996 707 835 114",
    coordinates: [74.56946, 42.870011],
  },
  {
    id: "supara",
    city: "Бишкек",
    name: "Этнокомплекс Супара",
    address: "Этнокомплекс Супара",
    phone: "+996 704 100 337",
    coordinates: [74.649503, 42.797176],
  },
  {
    id: "dordoi",
    city: "Бишкек",
    name: "Рынок Дордой — Мурас спорт",
    address: "Проход 14, контейнер",
    phone: "+996 773 202 526",
    coordinates: [74.6406, 42.9145],
  },
  {
    id: "ethnomir",
    city: "Каракол",
    name: "Магазин Ethnomir",
    address: "ул. Жамансариева 150/1",
    phone: "+996 556 847 110",
    coordinates: [78.393527, 42.487838],
  },
  {
    id: "nomadstore",
    city: "Ош",
    name: "Магазин Nomadstore",
    address: "ул. Моминова 15",
    phone: "+996 557 129 811",
    coordinates: [72.794411, 40.526317],
  },
  {
    id: "naryn-museum",
    city: "Нарын",
    name: "Галерея при историческом музее",
    address: "ул. Ленина 41А",
    phone: "+996 702 279 837",
    coordinates: [76.000396, 41.427961],
  },
];
