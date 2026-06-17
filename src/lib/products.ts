import wig1 from "@/wigs/wig 1.jpg";
import wig2 from "@/wigs/wig 2.jpg";
import wig3 from "@/wigs/wig 3.jpg";
import wig4 from "@/wigs/wig 4.jpg";
import wig5 from "@/wigs/wig 5.jpg";
import wig6 from "@/wigs/wig 6.jpg";
import wig7 from "@/wigs/wig 7.jpg";
import wig10 from "@/wigs/wig 10.jpg";
import wig11 from "@/wigs/wig 11.jpg";
import wig12 from "@/wigs/wig 12.jpg";
import wig13 from "@/wigs/wig 13.jpg";
import wig14 from "@/wigs/wig 14.jpg";
import wig15 from "@/wigs/wig 15.jpg";
import eq1 from "@/assets/equipment-1.jpg";
import eq2 from "@/assets/equipment-2.jpg";
import eq3 from "@/assets/equipment-3.jpg";
import eq4 from "@/assets/equipment-4.jpg";
import eq5 from "@/assets/equipment-5.jpg";
import eq6 from "@/assets/equipment-6.jpg";
import eq7 from "@/assets/equipment-7.jpg";
import tr1 from "@/assets/treatment-1.jpg";
import tr2 from "@/assets/treatment-2.jpg";
import tr3 from "@/assets/treatment-3.jpg";
import tr4 from "@/assets/treatment-4.jpg";
import tr5 from "@/assets/treatment-5.jpg";
import tr6 from "@/assets/treatment-6.jpg";
import tr7 from "@/assets/treatment-7.jpg";

export type Category = "wigs" | "equipment" | "treatment";

export function formatNGN(n: number): string {
  return `₦${Math.round(n).toLocaleString("en-NG")}`;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  image: string;
  category: Category;
  badge?: "New" | "Sale" | "Bestseller";
  description: string;
  details: string[];
  /** Length in inches — wigs only */
  length?: number;
  /** Wig texture / style — wigs only */
  texture?: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  // ===================== WIGS =====================
  {
    id: "brazilian-body-wave-26",
    name: "Brazilian Body Wave 26\"",
    price: 782400,
    compareAt: 928000,
    image: wig1,
    category: "wigs",
    badge: "Bestseller",
    length: 26,
    texture: "Body Wave",
    rating: 4.9,
    reviews: 412,
    description:
      "Hand-tied 100% raw Brazilian virgin hair with a soft, bouncy body wave. Pre-plucked HD lace front for an undetectable hairline.",
    details: [
      "100% raw Brazilian virgin hair",
      "HD transparent lace front 13x4",
      "Density: 200%",
      "Length: 26 inches",
    ],
  },
  {
    id: "honey-blonde-body-wave-24",
    name: "Honey Blonde Body Wave 24\"",
    price: 878400,
    image: wig2,
    category: "wigs",
    badge: "New",
    length: 24,
    texture: "Body Wave",
    rating: 4.8,
    reviews: 218,
    description:
      "Sun-kissed honey blonde #27 body wave. Custom hand-painted for a salon-finished depth.",
    details: [
      "Hand-painted honey #27",
      "Glueless wear & go",
      "Density: 220%",
      "Length: 24 inches",
    ],
  },
  {
    id: "deep-curly-22",
    name: "Peruvian Deep Curly 22\"",
    price: 686400,
    image: wig3,
    category: "wigs",
    length: 22,
    texture: "Deep Curly",
    rating: 4.7,
    reviews: 304,
    description:
      "Voluminous Peruvian deep curl in rich cocoa. Bouncy, defined and effortlessly glamorous.",
    details: [
      "Deep curl pattern",
      "Pre-bleached knots",
      "Density: 200%",
      "Length: 22 inches",
    ],
  },
  {
    id: "platinum-straight-28",
    name: "Platinum Silky Straight 28\"",
    price: 990400,
    image: wig4,
    category: "wigs",
    badge: "New",
    length: 28,
    texture: "Silky Straight",
    rating: 4.9,
    reviews: 156,
    description:
      "Icy platinum #613 with mirror-like shine. Bone straight, hand-tied for an effortless drape.",
    details: ["Raw virgin hair #613", "HD lace front", "Density: 180%", "Length: 28 inches"],
  },
  {
    id: "auburn-bob-14",
    name: "Auburn Layered Bob 14\"",
    price: 606400,
    image: wig5,
    category: "wigs",
    length: 14,
    texture: "Straight Bob",
    rating: 4.6,
    reviews: 92,
    description:
      "Sculpted auburn #33 bob with feathered layers. Modern, sharp and full of movement.",
    details: ["Custom-coloured #33", "Glueless cap", "Density: 200%", "Length: 14 inches"],
  },
  {
    id: "kinky-coily-20",
    name: "Afro Kinky Coily 20\"",
    price: 750400,
    image: wig6,
    category: "wigs",
    badge: "Bestseller",
    length: 20,
    texture: "Kinky Coily 4C",
    rating: 4.9,
    reviews: 387,
    description:
      "Voluminous 4C coily texture in deep noir. Defined coils with a soft, lived-in finish.",
    details: ["Kinky coil 4C pattern", "Pre-plucked hairline", "Density: 250%", "Length: 20 inches"],
  },
  {
    id: "espresso-straight-bang-30",
    name: "Espresso Straight with Bang 30\"",
    price: 910400,
    compareAt: 1024000,
    image: wig7,
    category: "wigs",
    badge: "Sale",
    length: 30,
    texture: "Silky Straight",
    rating: 4.8,
    reviews: 211,
    description:
      "Silky espresso brown with full fringe. Glassy straight finish for a polished signature look.",
    details: ["Silk straight", "Full fringe", "Density: 180%", "Length: 30 inches"],
  },
  {
    id: "water-wave-26",
    name: "Brazilian Water Wave 26\"",
    price: 830400,
    image: wig10,
    category: "wigs",
    length: 26,
    texture: "Water Wave",
    rating: 4.8,
    reviews: 263,
    description:
      "Hydrated, glossy water waves with a soft cascading finish. Effortlessly wet-look luxury.",
    details: ["100% virgin hair", "Transparent HD lace", "Density: 220%", "Length: 26 inches"],
  },
  {
    id: "loose-deep-wave-24",
    name: "Loose Deep Wave 24\"",
    price: 766400,
    image: wig11,
    category: "wigs",
    badge: "Bestseller",
    length: 24,
    texture: "Loose Deep Wave",
    rating: 4.9,
    reviews: 401,
    description:
      "Soft loose deep waves in natural 1B. Voluminous, romantic and beautifully defined.",
    details: ["Loose deep pattern", "Pre-plucked hairline", "Density: 220%", "Length: 24 inches"],
  },
  {
    id: "jerry-curl-18",
    name: "Chocolate Jerry Curl 18\"",
    price: 718400,
    image: wig12,
    category: "wigs",
    length: 18,
    texture: "Jerry Curl",
    rating: 4.7,
    reviews: 132,
    description:
      "Defined jerry curls in rich chocolate brown with a soft fringe. Playful, full and bouncy.",
    details: ["Jerry curl pattern", "Glueless cap", "Density: 250%", "Length: 18 inches"],
  },
  {
    id: "kinky-straight-yaki-22",
    name: "Kinky Straight Yaki 22\"",
    price: 798400,
    image: wig13,
    category: "wigs",
    length: 22,
    texture: "Kinky Straight Yaki",
    rating: 4.8,
    reviews: 187,
    description:
      "Silk-pressed yaki texture that blends seamlessly with natural relaxed hair. A versatile staple.",
    details: ["Yaki straight", "Side part", "Density: 180%", "Length: 22 inches"],
  },
  {
    id: "burgundy-body-wave-24",
    name: "Burgundy Body Wave 24\"",
    price: 862400,
    compareAt: 960000,
    image: wig14,
    category: "wigs",
    badge: "Sale",
    length: 24,
    texture: "Body Wave",
    rating: 4.8,
    reviews: 224,
    description:
      "Rich wine burgundy body wave. Hand-painted #99J colour for depth and editorial shine.",
    details: ["Custom colour #99J", "HD lace front", "Density: 200%", "Length: 24 inches"],
  },
  {
    id: "caramel-ombre-straight-28",
    name: "Caramel Ombre Straight 28\"",
    price: 958400,
    image: wig15,
    category: "wigs",
    badge: "New",
    length: 28,
    texture: "Silky Straight",
    rating: 4.7,
    reviews: 96,
    description:
      "Dark roots melting into warm caramel honey ends. Hand-painted balayage with luminous shine.",
    details: ["Hand-painted balayage", "HD lace 13x4", "Density: 200%", "Length: 28 inches"],
  },

  // ===================== EQUIPMENT =====================
  {
    id: "atelier-wand",
    name: "Atelier Curling Wand",
    price: 350400,
    image: eq1,
    category: "equipment",
    badge: "New",
    rating: 4.8,
    reviews: 142,
    description:
      "Tourmaline-infused 32mm wand with intelligent heat control. Salon results in seconds.",
    details: ["Tourmaline ceramic barrel", "Heat: 80–230°C", "Worldwide voltage", "2-year warranty"],
  },
  {
    id: "rose-airflow",
    name: "Rose Airflow Dryer",
    price: 462400,
    compareAt: 544000,
    image: eq2,
    category: "equipment",
    badge: "Sale",
    rating: 4.9,
    reviews: 318,
    description:
      "Ultra-light ionic dryer in soft rose gold. Dries 40% faster while sealing the cuticle.",
    details: ["Brushless digital motor", "3 heat / 2 speed settings", "Cool shot finish", "Magnetic nozzles"],
  },
  {
    id: "rose-gold-iron",
    name: "Rose Gold Flat Iron",
    price: 398400,
    image: eq3,
    category: "equipment",
    badge: "New",
    rating: 4.7,
    reviews: 96,
    description:
      "Floating titanium plates in brushed rose gold. Glides through any texture in a single pass.",
    details: ["Titanium plates", "Heat: 100–230°C", "Auto shut-off", "Dual voltage"],
  },
  {
    id: "heritage-brush",
    name: "Heritage Boar Brush",
    price: 134400,
    image: eq4,
    category: "equipment",
    rating: 4.6,
    reviews: 73,
    description:
      "Polished beechwood paddle with pure boar bristles. Distributes natural oils end to end.",
    details: ["Boar + nylon bristles", "Beechwood handle", "Anti-static", "Made in Germany"],
  },
  {
    id: "atelier-hot-brush",
    name: "Atelier Hot Brush",
    price: 318400,
    image: eq5,
    category: "equipment",
    rating: 4.7,
    reviews: 128,
    description:
      "One-step hot air brush in champagne gold. Dries and styles a soft blowout in minutes.",
    details: ["Ionic ceramic", "3 heat settings", "Oval barrel", "Cool tip"],
  },
  {
    id: "noir-clipper-pro",
    name: "Noir Clipper Pro",
    price: 430400,
    image: eq6,
    category: "equipment",
    badge: "New",
    rating: 4.8,
    reviews: 54,
    description:
      "Professional cordless clipper with precision steel blade. For tailored edges at home.",
    details: ["Steel blade", "120 min runtime", "USB-C charging", "8 guard combs"],
  },
  {
    id: "gold-shears",
    name: "Gold Atelier Shears",
    price: 254400,
    image: eq7,
    category: "equipment",
    rating: 4.9,
    reviews: 41,
    description:
      "24k gold-plated japanese steel shears. Whisper-sharp for clean dusting and trims.",
    details: ["Japanese steel", "6 inch blade", "Removable finger rest", "Velvet case"],
  },

  // ===================== TREATMENT =====================
  {
    id: "gold-elixir",
    name: "Gold Elixir Hair Oil",
    price: 108800,
    image: tr1,
    category: "treatment",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 522,
    description: "Weightless argan & marula elixir for instant shine and frizz control.",
    details: ["Argan + Marula + Camellia", "Silicone-free", "Vegan & cruelty free", "50ml"],
  },
  {
    id: "velvet-mask",
    name: "Velvet Repair Mask",
    price: 86400,
    image: tr2,
    category: "treatment",
    rating: 4.8,
    reviews: 287,
    description: "Deep-conditioning mask with keratin and shea. Restores softness in 5 minutes.",
    details: ["Hydrolyzed keratin", "Shea & cocoa butter", "Weekly treatment", "200ml"],
  },
  {
    id: "atelier-shampoo",
    name: "Atelier Hydra Shampoo",
    price: 67200,
    image: tr3,
    category: "treatment",
    badge: "New",
    rating: 4.7,
    reviews: 164,
    description: "Sulfate-free cleanser with rice water and biotin. Cleanses softly without stripping colour.",
    details: ["Sulfate & paraben free", "Colour safe", "Vegan", "300ml"],
  },
  {
    id: "silk-conditioner",
    name: "Silk Slip Conditioner",
    price: 73600,
    image: tr4,
    category: "treatment",
    rating: 4.7,
    reviews: 198,
    description: "Silk-protein conditioner that detangles and softens in seconds.",
    details: ["Silk amino acids", "pH balanced", "Lightweight", "300ml"],
  },
  {
    id: "amber-serum",
    name: "Amber Repair Serum",
    price: 124800,
    image: tr5,
    category: "treatment",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 341,
    description: "Concentrated bond-building serum. Mends split ends and seals the cuticle for glassy shine.",
    details: ["Bond-builder", "Heat protectant", "Vegan", "30ml"],
  },
  {
    id: "scalp-tonic-duo",
    name: "Scalp Renewal Duo",
    price: 147200,
    compareAt: 176000,
    image: tr6,
    category: "treatment",
    badge: "Sale",
    rating: 4.6,
    reviews: 119,
    description: "A clarifying tonic and balancing balm to soothe, exfoliate and renew the scalp ritual.",
    details: ["Salicylic + niacinamide", "Soothing duo", "Weekly use", "100ml + 50ml"],
  },
  {
    id: "thermal-veil",
    name: "Thermal Veil Mist",
    price: 60800,
    image: tr7,
    category: "treatment",
    rating: 4.8,
    reviews: 226,
    description: "Fine-mist heat protectant up to 230°C. Weightless veil with botanical extracts for shine.",
    details: ["Heat protect 230°C", "Weightless mist", "Botanical complex", "150ml"],
  },
];

export const collections = [
  { slug: "new-arrivals", title: "New Arrivals", image: "/src/assets/collection-new.jpg" },
  { slug: "best-sellers", title: "Best Sellers", image: "/src/assets/collection-wigs.jpg" },
  { slug: "wigs", title: "Wigs", image: "/src/assets/collection-wigs.jpg" },
  { slug: "treatment", title: "Hair Treatment", image: "/src/assets/collection-treatment.jpg" },
];

export function getDbProducts(): Product[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("jb_products_v2");
    if (stored) {
      try {
        return JSON.parse(stored) as Product[];
      } catch (e) {
        console.error("Failed to parse stored products", e);
      }
    } else {
      localStorage.setItem("jb_products_v2", JSON.stringify(products));
    }
  }
  return products;
}

export function saveDbProducts(newProducts: Product[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("jb_products_v2", JSON.stringify(newProducts));
    window.dispatchEvent(new Event("jb_products_updated"));
  }
}

export function getProduct(id: string) {
  return getDbProducts().find((p) => p.id === id);
}

