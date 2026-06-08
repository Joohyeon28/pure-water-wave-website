export const pricing = {
  purified: {
    label: "Purified Water",
    refillRate: 1.0,
    bottles: {
      "500ml": 4.0,
      "1L": 7.0,
      "2L": 12.0,
      "5L": 25.0,
      "10L": 40.0,
    },
  },
  alkaline: {
    label: "Alkaline Water",
    refillRate: 1.5,
    bottles: {
      "500ml": 6.0,
      "1L": 10.0,
      "2L": 18.0,
      "5L": 38.0,
      "10L": 60.0,
    },
  },
  fruitJuice: {
    label: "Fruit Juice",
    refillRate: 2.5,
    bottles: {
      "500ml": 10.0,
      "1L": 18.0,
      "2L": 30.0,
      "5L": 65.0,
      "10L": 110.0,
    },
  },
} as const;

export type ProductKey = keyof typeof pricing;
export type ContainerSize = keyof typeof pricing.purified.bottles;

export const containerSizes: ContainerSize[] = ["500ml", "1L", "2L", "5L", "10L"];
export const productKeys: ProductKey[] = ["purified", "alkaline", "fruitJuice"];
