// Everything Monedita can wear. Each item lives in one slot (she wears at most one
// per slot). Prices are in coins; the artwork for each id is in WardrobeArt.jsx.
//
// A costume is a complete head-to-toe look, so while one is worn it replaces the hat,
// eyewear and outfit (they come back when the costume comes off).

export const SLOTS = ['hat', 'eyewear', 'outfit', 'costume'];

export const SLOT_LABELS = {
  hat: { es: 'Sombreros', en: 'Hats' },
  eyewear: { es: 'Gafas', en: 'Eyewear' },
  outfit: { es: 'Atuendos', en: 'Outfits' },
  costume: { es: 'Disfraces', en: 'Costumes' },
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

  // costumes: full-body looks (winter, Halloween, jobs and a few fantasy ones). They are all
  // original, generic characters (no look-alikes of films, games or comics).
  { id: 'cos-skier', slot: 'costume', es: 'El esquiador', en: 'Skier', price: 450 },
  { id: 'cos-snowman', slot: 'costume', es: 'El muñeco de nieve', en: 'Snowman', price: 450 },
  { id: 'cos-elf', slot: 'costume', es: 'El elfo', en: 'Elf', price: 500 },
  { id: 'cos-santa', slot: 'costume', es: 'Santa Claus', en: 'Santa', price: 700 },
  { id: 'cos-ghost', slot: 'costume', es: 'El fantasma', en: 'Ghost', price: 400 },
  { id: 'cos-pumpkin', slot: 'costume', es: 'La calabaza', en: "Jack-o'-lantern", price: 450 },
  { id: 'cos-mummy', slot: 'costume', es: 'La momia', en: 'Mummy', price: 500 },
  { id: 'cos-skeleton', slot: 'costume', es: 'El esqueleto', en: 'Skeleton', price: 500 },
  { id: 'cos-witch', slot: 'costume', es: 'La bruja', en: 'Witch', price: 600 },
  { id: 'cos-vampire', slot: 'costume', es: 'El vampiro', en: 'Vampire', price: 650 },
  { id: 'cos-monster', slot: 'costume', es: 'El monstruito verde', en: 'Little green monster', price: 700 },
  { id: 'cos-nurse', slot: 'costume', es: 'La enfermera', en: 'Nurse', price: 550 },
  { id: 'cos-doctor', slot: 'costume', es: 'El doctor', en: 'Doctor', price: 600 },
  { id: 'cos-firefighter', slot: 'costume', es: 'El bombero', en: 'Firefighter', price: 650 },
  { id: 'cos-builder', slot: 'costume', es: 'El constructor', en: 'Builder', price: 700 },
  { id: 'cos-pirate', slot: 'costume', es: 'El pirata', en: 'Pirate', price: 600 },
  { id: 'cos-tycoon', slot: 'costume', es: 'El magnate', en: 'Top-hat tycoon', price: 800 },
  { id: 'cos-astronaut', slot: 'costume', es: 'El astronauta', en: 'Astronaut', price: 800 },
  { id: 'cos-mage', slot: 'costume', es: 'El mago', en: 'Wizard', price: 900 },
  { id: 'cos-hero', slot: 'costume', es: 'El superhéroe', en: 'Superhero', price: 1000 },
];

// Costumes that cover her own face and/or arms and feet draw replacements instead.
export const COSTUME_HIDES = {
  'cos-ghost': { face: true, limbs: true },
  'cos-pumpkin': { face: true, limbs: true },
  'cos-mummy': { face: true, limbs: true },
  'cos-skeleton': { face: true, limbs: true },
  'cos-monster': { face: true, limbs: true },
  'cos-snowman': { face: true, limbs: true },
};

const BY_ID = new Map(ITEMS.map((item) => [item.id, item]));

// Costumes that were redrawn as original characters keep working for people who already
// own them: the old id points at the new one.
const ID_ALIASES = {
  'cos-wizard': 'cos-mage',
  'cos-plumber': 'cos-builder',
  'cos-spider': 'cos-hero',
};

export function canonicalId(id) {
  return ID_ALIASES[id] ?? id;
}

export function getItem(id) {
  return BY_ID.get(canonicalId(id)) ?? null;
}

export function itemsForSlot(slot) {
  return ITEMS.filter((item) => item.slot === slot);
}

// What is actually drawn for a set of worn items: a costume replaces everything else.
export function resolveLook(worn = {}) {
  if (worn.costume && getItem(worn.costume)?.slot === 'costume') return { costume: worn.costume };
  const { costume, ...rest } = worn; // eslint-disable-line no-unused-vars
  return rest;
}

// The shop's try-on: trying a costume shows only it; trying anything else takes the
// current costume off so you can see the piece itself.
export function previewLook(equipped = {}, preview = {}) {
  if (preview.costume) return { costume: preview.costume };
  if (Object.keys(preview).length === 0) return equipped;
  const { costume, ...rest } = equipped; // eslint-disable-line no-unused-vars
  return { ...rest, ...preview };
}
