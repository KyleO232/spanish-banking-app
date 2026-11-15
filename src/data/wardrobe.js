// Everything Monedita can wear. Each item lives in one slot (she wears at most one
// per slot). Prices are in coins; the artwork for each id is in WardrobeArt.jsx.

export const SLOTS = ['hat', 'eyewear', 'outfit'];

export const SLOT_LABELS = {
  hat: { es: 'Sombreros', en: 'Hats' },
  eyewear: { es: 'Gafas', en: 'Eyewear' },
  outfit: { es: 'Atuendos', en: 'Outfits' },
};

export const ITEMS = [
  // hats
  { id: 'hat-cap', slot: 'hat', es: 'La gorra', en: 'Baseball cap', price: 80 },
  { id: 'hat-beanie', slot: 'hat', es: 'El gorro', en: 'Winter hat', price: 100 },
  { id: 'hat-visor', slot: 'hat', es: 'La visera de contador', en: "Accountant's visor", price: 150 },
  { id: 'hat-grad', slot: 'hat', es: 'El birrete', en: 'Graduation cap', price: 200 },
  { id: 'hat-cowboy', slot: 'hat', es: 'El sombrero vaquero', en: 'Cowboy hat', price: 250 },
  { id: 'hat-top', slot: 'hat', es: 'El sombrero de copa', en: 'Top hat', price: 350 },
  { id: 'hat-crown', slot: 'hat', es: 'La corona', en: 'Crown', price: 600 },

  // eyewear
  { id: 'eye-round', slot: 'eyewear', es: 'Las gafas redondas', en: 'Round glasses', price: 80 },
  { id: 'eye-heart', slot: 'eyewear', es: 'Las gafas de corazón', en: 'Heart glasses', price: 120 },
  { id: 'eye-sun', slot: 'eyewear', es: 'Las gafas de sol', en: 'Sunglasses', price: 180 },
  { id: 'eye-monocle', slot: 'eyewear', es: 'El monóculo', en: 'Monocle', price: 250 },

  // outfits
  { id: 'out-tie', slot: 'outfit', es: 'La corbata', en: 'Necktie', price: 70 },
  { id: 'out-bow', slot: 'outfit', es: 'El corbatín', en: 'Bow tie', price: 90 },
  { id: 'out-scarf', slot: 'outfit', es: 'La bufanda', en: 'Scarf', price: 130 },
  { id: 'out-medal', slot: 'outfit', es: 'La medalla', en: 'Medal', price: 220 },
  { id: 'out-vest', slot: 'outfit', es: 'El chaleco', en: 'Vest', price: 300 },
  { id: 'out-cape', slot: 'outfit', es: 'La capa', en: 'Cape', price: 400 },
];

const BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

export function getItem(id) {
  return BY_ID.get(id) ?? null;
}

export function itemsForSlot(slot) {
  return ITEMS.filter((item) => item.slot === slot);
}
