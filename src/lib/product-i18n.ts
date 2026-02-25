export type ProductLike = {
  slug: string;
  name: string;
  description: string;
};

const arProductTranslations: Record<string, {name: string; description: string}> = {
  'minimal-leather-wallet': {
    name: '\u0645\u062d\u0641\u0638\u0629 \u062c\u0644\u062f\u064a\u0629 \u0646\u062d\u064a\u0641\u0629',
    description: '\u0645\u062d\u0641\u0638\u0629 \u062c\u0644\u062f \u0637\u0628\u064a\u0639\u064a \u0646\u062d\u064a\u0641\u0629 \u0645\u0639 \u062d\u0645\u0627\u064a\u0629 RFID.'
  },
  'urban-backpack': {
    name: '\u062d\u0642\u064a\u0628\u0629 \u0638\u0647\u0631 \u062d\u0636\u0631\u064a\u0629',
    description: '\u062d\u0642\u064a\u0628\u0629 \u064a\u0648\u0645\u064a\u0629 \u0645\u0642\u0627\u0648\u0645\u0629 \u0644\u0644\u0645\u0627\u0621 \u0645\u0639 \u0645\u0633\u0627\u062d\u0629 \u0645\u062e\u0635\u0635\u0629 \u0644\u0644\u0627\u0628\u062a\u0648\u0628.'
  },
  'ceramic-coffee-mug': {
    name: '\u0643\u0648\u0628 \u0642\u0647\u0648\u0629 \u062e\u0632\u0641\u064a',
    description: '\u0643\u0648\u0628 \u062e\u0632\u0641\u064a \u0645\u0637\u0644\u064a \u064a\u062f\u0648\u064a\u0627 \u0628\u0633\u0639\u0629 350 \u0645\u0644 \u0644\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u064a\u0648\u0645\u064a.'
  },
  'noise-isolating-headphones': {
    name: '\u0633\u0645\u0627\u0639\u0627\u062a \u0639\u0632\u0644 \u0636\u0648\u0636\u0627\u0621',
    description: '\u0633\u0645\u0627\u0639\u0627\u062a \u0631\u0623\u0633 \u0645\u0631\u064a\u062d\u0629 \u0628\u0635\u0648\u062a \u063a\u0646\u064a \u0648\u0639\u0632\u0644 \u062c\u064a\u062f \u0644\u0644\u0636\u0648\u0636\u0627\u0621.'
  }
};

export function localizeProduct<T extends ProductLike>(product: T, locale: string): T {
  if (locale !== 'ar') {
    return product;
  }

  const translated = arProductTranslations[product.slug];
  if (!translated) {
    return product;
  }

  return {
    ...product,
    name: translated.name,
    description: translated.description
  };
}
