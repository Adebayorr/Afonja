// Seed / fallback catalog.
// This is the data shape the Cloudflare Worker (see /worker) also returns
// from KV. The app always tries the live API first and falls back to this
// file if the API is unreachable, so the site still works offline/in dev.

import chickenWings from "../assets/products/chicken-wings.webp";
import chickenLaps from "../assets/products/chicken-laps.webp";
import chickenGizzard from "../assets/products/chicken-gizzard.webp";
import chickenNeck from "../assets/products/chicken-neck.webp";
import turkeyWings from "../assets/products/turkey-wings.webp";
import turkeyLaps from "../assets/products/turkey-laps.webp";
import turkeyFingers from "../assets/products/turkey-fingers.webp";
import chickenMixed from "../assets/products/chicken-mixed-cuts.webp";
import turkeyCuts from "../assets/products/turkey-cuts.webp";
import titus from "../assets/products/titus.webp";
import mullet from "../assets/products/mullet.webp";
import hake from "../assets/products/hake.webp";
import shawa from "../assets/products/shawa-herring.webp";
import kote from "../assets/products/kote.webp";
import satin from "../assets/products/satin.webp";
import express from "../assets/products/express.webp";
import cowMeat from "../assets/products/cow-meat.webp";
import goatMeat from "../assets/products/goat-meat.webp";
import ponmo500 from "../assets/products/ponmo-500.webp";
import ponmo1000 from "../assets/products/ponmo-1000.webp";

// Standard weight ladder used by every weight-sold product (in kg).
export const WEIGHT_STEPS = [0.5, 1];

// Builds the {id, label, price} options for a weight-sold product from a
// per-kg naira rate. Rounded to the nearest 50 naira, which is how the
// business will likely want to price in-store too.
function weightOptions(pricePerKg) {
  function formatWeight(kg) {
    return kg === 0.5 ? "½kg" : `${kg}kg`;
  } 
  return WEIGHT_STEPS.map((kg) => ({
    id: `${kg}kg`,
    label: formatWeight(kg),
    price: Math.round((pricePerKg * kg) / 50) * 50,
  }));
}

export const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "poultry", label: "Poultry" },
  { id: "fish", label: "Fish" },
  { id: "beef-goat", label: "Beef & Goat" },
  { id: "ponmo", label: "Ponmo" },
];

// NOTE: prices below are placeholders (₦) — update real prices from the
// /admin inventory page once the site is live.
// NOTE: order below is intentional, not alphabetical/category order —
// each product's photo has either a green or a light-gray backdrop, and
// the list is arranged so those backdrops alternate as the cards render
// (this also holds true within each category filter, not just "All").
export const PRODUCTS = [
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    category: "poultry",
    image: chickenWings,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(3500),
    inStock: true,
  },
  {
    id: "chicken-neck",
    name: "Chicken Neck",
    category: "poultry",
    image: chickenNeck,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(1800),
    inStock: true,
  },
  {
    id: "chicken-laps",
    name: "Chicken Laps",
    category: "poultry",
    image: chickenLaps,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(3200),
    inStock: true,
  },
  {
    id: "turkey-laps",
    name: "Turkey Laps",
    category: "poultry",
    image: turkeyLaps,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(4800),
    inStock: true,
  },
  {
    id: "chicken-gizzard",
    name: "Chicken Gizzard",
    category: "poultry",
    image: chickenGizzard,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(4000),
    inStock: true,
  },
  {
    id: "turkey-fingers",
    name: "Turkey Fingers",
    category: "poultry",
    image: turkeyFingers,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(4200),
    inStock: true,
  },
  {
    id: "turkey-wings",
    name: "Turkey Wings",
    category: "poultry",
    image: turkeyWings,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(4500),
    inStock: true,
  },
  {
    id: "chicken-mixed-cuts",
    name: "Chicken (Mixed Cuts)",
    category: "poultry",
    image: chickenMixed,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(3500),
    inStock: true,
  },
  {
    id: "turkey-cuts",
    name: "Turkey Cuts",
    category: "poultry",
    image: turkeyCuts,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(4500),
    inStock: true,
  },
  {
    id: "mullet",
    name: "Mullet Fish",
    category: "fish",
    image: mullet,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(2800),
    inStock: true,
  },
  {
    id: "titus",
    name: "Titus Fish",
    category: "fish",
    image: titus,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(3000),
    inStock: true,
  },
  {
    id: "shawa",
    name: "Shawa (Herring)",
    category: "fish",
    image: shawa,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(2500),
    inStock: true,
  },
  {
    id: "hake",
    name: "Hake Fish",
    category: "fish",
    image: hake,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(3200),
    inStock: true,
  },
  {
    id: "kote",
    name: "Kote Fish",
    category: "fish",
    image: kote,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(2700),
    inStock: true,
  },
  {
    id: "satin",
    name: "Satin Fish",
    category: "fish",
    image: satin,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(3000),
    inStock: true,
  },
  {
    id: "express",
    name: "Express Fish",
    category: "fish",
    image: express,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(2900),
    inStock: true,
  },
  {
    id: "goat-meat",
    name: "Goat Meat",
    category: "beef-goat",
    image: goatMeat,
    tone: "green",
    soldBy: "weight",
    options: weightOptions(5500),
    inStock: true,
  },
  {
    id: "cow-meat",
    name: "Cow Meat",
    category: "beef-goat",
    image: cowMeat,
    tone: "gray",
    soldBy: "weight",
    options: weightOptions(4500),
    inStock: true,
  },
  {
    id: "ponmo",
    name: "Ponmo",
    category: "ponmo",
    image: ponmo500,
    tone: "green",
    soldBy: "unit",
    options: [
      { id: "500", label: "₦500", price: 500, image: ponmo500 },
      { id: "1000", label: "₦1000", price: 1000, image: ponmo1000 },
    ],
    inStock: true,
  },
];
