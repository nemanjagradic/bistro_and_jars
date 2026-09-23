"use client";

import {
  categoryLabel,
  formatItemLabel,
  formatMenuPrice,
  getItemsByCategory,
  getMenuCategories,
  itemDescription,
  itemName,
} from "../lib/menu";
import type { MenuCategory as MenuCategoryData } from "../lib/menu";
import { ScrollReveal, useScrollReveal } from "./scroll-reveal";
import { useLanguage } from "./language-provider";

function MenuCategoryBlock({
  category,
  locale,
}: {
  category: MenuCategoryData;
  locale: "sr" | "en";
}) {
  const ref = useScrollReveal<HTMLElement>();
  const items = getItemsByCategory(category.categorySr);

  return (
    <section ref={ref} className="menu-category scroll-reveal">
      <h2 className="menu-category-title">{categoryLabel(category, locale)}</h2>
      <hr className="menu-divider" />
      <ul>
        {items.map((item) => {
          const description = itemDescription(item, locale);

          return (
            <li key={item.id} className="menu-item-row">
              <div className="min-w-0">
                <p className="text-base leading-snug text-ivory">
                  {formatItemLabel(itemName(item, locale), item.quantity)}
                </p>
                {description ? (
                  <p className="menu-item-desc">{description}</p>
                ) : null}
              </div>
              <p className="menu-item-price">{formatMenuPrice(item.price)}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function MenuSection() {
  const { copy, locale } = useLanguage();
  const categories = getMenuCategories();

  return (
    <section aria-labelledby="menu-heading">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="text-center">
          <h1
            id="menu-heading"
            className="font-heading text-3xl font-medium leading-tight text-ivory sm:text-4xl md:text-[2.75rem] md:leading-tight"
          >
            {copy.menuTeaserHeading}
          </h1>
        </ScrollReveal>

        <div className="menu-columns">
          {categories.map((category) => (
            <MenuCategoryBlock
              key={category.categorySr}
              category={category}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
