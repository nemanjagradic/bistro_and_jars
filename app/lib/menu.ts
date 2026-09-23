import type { Locale } from "./chrome-copy";
import groupsManifest from "./menu-home-groups.json";
import itemsManifest from "./menu.json";

export type MenuItem = {
  id: string;
  categorySr: string;
  categoryEn: string;
  nameSr: string;
  nameEn: string;
  descriptionSr: string | null;
  descriptionEn: string | null;
  quantity: string | null;
  price: number;
};

export type MenuHomeGroup = {
  order: number;
  sr: string;
  en: string;
};

export type MenuCategory = {
  categorySr: string;
  categoryEn: string;
};

const items = itemsManifest as MenuItem[];
const homeGroups = groupsManifest as MenuHomeGroup[];

export function getHomeGroups(): MenuHomeGroup[] {
  return [...homeGroups].sort((a, b) => a.order - b.order);
}

export function getMenuItems(): MenuItem[] {
  return items;
}

export function getMenuCategories(): MenuCategory[] {
  const categories: MenuCategory[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.categorySr)) continue;
    seen.add(item.categorySr);
    categories.push({
      categorySr: item.categorySr,
      categoryEn: item.categoryEn,
    });
  }

  return categories;
}

export function getItemsByCategory(categorySr: string): MenuItem[] {
  return items.filter((item) => item.categorySr === categorySr);
}

export function formatMenuPrice(price: number): string {
  return `${price} RSD`;
}

export function formatItemLabel(
  name: string,
  quantity: string | null,
): string {
  return quantity ? `${name} (${quantity})` : name;
}

export function categoryLabel(category: MenuCategory, locale: Locale): string {
  return locale === "en" ? category.categoryEn : category.categorySr;
}

export function homeGroupLabel(group: MenuHomeGroup, locale: Locale): string {
  return locale === "en" ? group.en : group.sr;
}

export function itemName(item: MenuItem, locale: Locale): string {
  return locale === "en" ? item.nameEn : item.nameSr;
}

export function itemDescription(
  item: MenuItem,
  locale: Locale,
): string | null {
  return locale === "en" ? item.descriptionEn : item.descriptionSr;
}
