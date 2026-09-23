"use client";

import { useState } from "react";
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

function MenuItems({
  category,
  locale,
}: {
  category: MenuCategoryData;
  locale: "sr" | "en";
}) {
  const items = getItemsByCategory(category.categorySr);

  return (
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
  );
}

function MenuCategoryBlock({
  category,
  locale,
  open,
  panelId,
  onToggle,
}: {
  category: MenuCategoryData;
  locale: "sr" | "en";
  open: boolean;
  panelId: string;
  onToggle: () => void;
}) {
  const ref = useScrollReveal<HTMLElement>();
  const title = categoryLabel(category, locale);

  return (
    <section
      ref={ref}
      className="menu-category scroll-reveal"
      data-open={open ? "true" : "false"}
    >
      <h2 className="menu-category-title menu-category-title--static">
        {title}
      </h2>
      <h2 className="menu-category-title menu-category-title--toggle">
        <button
          type="button"
          className="menu-category-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{title}</span>
          <span className="menu-category-chevron" aria-hidden="true" />
        </button>
      </h2>
      <div id={panelId} className="menu-category-panel">
        <hr className="menu-divider" />
        <MenuItems category={category} locale={locale} />
      </div>
    </section>
  );
}

export function MenuSection() {
  const { copy, locale } = useLanguage();
  const categories = getMenuCategories();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  function toggleCategory(categorySr: string) {
    setOpenCategory((current) => (current === categorySr ? null : categorySr));
  }

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
          {categories.map((category, index) => (
            <MenuCategoryBlock
              key={category.categorySr}
              category={category}
              locale={locale}
              open={openCategory === category.categorySr}
              panelId={`menu-category-panel-${index}`}
              onToggle={() => toggleCategory(category.categorySr)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
