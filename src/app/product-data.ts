export interface Product {
  id: string;
  imageUrl: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "FRIHETEN",
    imageUrl: "product1.svg",
    shortDescription: "Corner sofa-bed with storage",
    description:
      "Cheer the team on in style with our unstructured, low crown, six-panel baseball cap made of 100% organic cotton twill. Featuring our original Big Star Collectibles artwork, screen-printed with PVC- and phthalate-free inks. Complete with matching sewn ventilation eyelets, and adjustable fabric closure.",
    price: 29,
  },
  {
    id: "2",
    name: "FRIDHULT",
    imageUrl: "mug.jpg",
    shortDescription: "Sofa-bed, Skiftebo yellow",
    description: "",
    price: 16,
  },
  {
    id: "3",
    name: "SKÖNABÄCK",
    imageUrl: "shirt.jpg",
    shortDescription: "Corner sofa-bed with storage",
    description:
      "Our t-shirts are made from ring-spun, long-staple organic cotton that's ethically sourced from member farms of local organic cotton cooperatives. Original artwork is screen-printed using PVC- and phthalate-free inks. Features crew-neck styling, shoulder-to-shoulder taping, and a buttery soft feel. Machine-wash warm, tumble-dry low.",
    price: 26,
  },
  {
    id: "4",
    name: "ÄNGSLILJA",
    imageUrl: "apron.jpg",
    shortDescription: "Duvet cover and 2 pillowcases, blue",
    description:
      "Everyone’s a chef in our eco-friendly apron made from 55% organic cotton and 45% recycled polyester. Showcasing your favorite Big Star Collectibles design, the apron is screen-printed in PVC- and phthalate-free inks. Apron measures 24 inches wide by 30 inches long and is easily adjustable around the neck and waist with one continuous strap. Machine-wash warm, tumble-dry low.",
    price: 24,
  },
  {
    id: "5",
    name: "BRUKSVARA",
    imageUrl: "apron.jpg",
    shortDescription: "4-piece bedlinen set, light blue/geometric",
    description:
      "Everyone’s a chef in our eco-friendly apron made from 55% organic cotton and 45% recycled polyester. Showcasing your favorite Big Star Collectibles design, the apron is screen-printed in PVC- and phthalate-free inks. Apron measures 24 inches wide by 30 inches long and is easily adjustable around the neck and waist with one continuous strap. Machine-wash warm, tumble-dry low.",
    price: 24,
  },
  {
    id: "6",
    name: "BERGPALM",
    imageUrl: "apron.jpg",
    shortDescription: "Duvet cover and 2 pillowcases, blue/striped",
    description:
      "Everyone’s a chef in our eco-friendly apron made from 55% organic cotton and 45% recycled polyester. Showcasing your favorite Big Star Collectibles design, the apron is screen-printed in PVC- and phthalate-free inks. Apron measures 24 inches wide by 30 inches long and is easily adjustable around the neck and waist with one continuous strap. Machine-wash warm, tumble-dry low.",
    price: 24,
  },
];
