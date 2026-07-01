export interface Stock {
  name: string;
  symbol: string;
  /** Legal name printed on the certificate */
  certificateName: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  logoSrc: string;
  logoClassName?: string;
  /** When set, controls arrow/color styling independent of sign */
  trendDisplay?: "up" | "down";
}

export const DEFAULT_STOCK: Stock = {
  name: "Eli Lily and Company",
  symbol: "LLY",
  certificateName: "Eli Lily and Company",
  price: 1225.85,
  priceChange: 23.26,
  priceChangePercent: 1.92,
  logoSrc: "/assets/lilly-logo.png",
};

export const EXPLORE_STOCKS: Stock[] = [
  {
    name: "Caterpillar Inc.",
    symbol: "CAT",
    certificateName: "Caterpillar Inc.",
    price: 43.12,
    priceChange: -0.15,
    priceChangePercent: -0.35,
    logoSrc: "/assets/explore-cat-logo.png",
    logoClassName: "bg-black",
    trendDisplay: "up",
  },
  {
    name: "Palantir",
    symbol: "PLTR",
    certificateName: "Palantir Technologies Inc.",
    price: 60.78,
    priceChange: -0.23,
    priceChangePercent: -0.38,
    logoSrc: "/assets/explore-pltr-logo.png",
    trendDisplay: "down",
  },
  {
    name: "Shopify",
    symbol: "SHOP",
    certificateName: "Shopify Inc.",
    price: 120.45,
    priceChange: 2.1,
    priceChangePercent: 1.77,
    logoSrc: "/assets/explore-shop-logo.png",
  },
  {
    name: "Netflix, Inc",
    symbol: "NFLX",
    certificateName: "Netflix, Inc.",
    price: 165.58,
    priceChange: 1.05,
    priceChangePercent: 0.64,
    logoSrc: "/assets/explore-nflx-logo.png",
    trendDisplay: "up",
  },
];
