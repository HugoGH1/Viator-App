export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  street: string;
  neighborhood: string;
  postalCode: string;
  rating: number;
  image: string;
  gallery: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  mapImage: string;
  mapUrl: string;
}

export const categories: Category[] = [
  { id: "restaurants", name: "Restaurantes", icon: "utensils" },
  { id: "theaters", name: "Teatros", icon: "theater" },
  { id: "desserts", name: "Postres", icon: "cake" },
  { id: "museums", name: "Museos", icon: "landmark" },
];

export const businesses: Business[] = [
  {
    id: "la-finca",
    name: "La Finca",
    description: "Cocina tradicional mexicana con ingredientes locales frescos.",
    longDescription: "La Finca es un restaurante de cocina tradicional mexicana que combina recetas ancestrales con técnicas culinarias modernas. Nuestros ingredientes son cuidadosamente seleccionados de productores locales, garantizando frescura y calidad en cada platillo. Disfruta de un ambiente acogedor y rústico mientras saboreas los sabores auténticos de México.",
    category: "restaurants",
    street: "Av. Insurgentes Sur 1234",
    neighborhood: "Col. Del Valle",
    postalCode: "03100",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    ],
    socialLinks: {
      facebook: "https://facebook.com/lafinca",
      instagram: "https://instagram.com/lafinca",
      website: "https://lafinca.com",
    },
    mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80",
    mapUrl: "https://maps.google.com/?q=19.3765,-99.1671",
  },
  {
    id: "sweetcake-house",
    name: "SweetCake House",
    description: "Pastelería artesanal con los mejores postres de la ciudad.",
    longDescription: "SweetCake House es una pastelería boutique especializada en postres artesanales elaborados con ingredientes premium. Desde pasteles de diseño hasta cupcakes gourmet, cada creación es una obra de arte comestible. Nuestro equipo de pasteleros expertos combina técnicas francesas con sabores locales para crear experiencias dulces inolvidables.",
    category: "desserts",
    street: "Calle Durango 156",
    neighborhood: "Col. Roma Norte",
    postalCode: "06700",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
    ],
    socialLinks: {
      instagram: "https://instagram.com/sweetcakehouse",
      facebook: "https://facebook.com/sweetcakehouse",
    },
    mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80",
    mapUrl: "https://maps.google.com/?q=19.4195,-99.1617",
  },
  {
    id: "teatro-ricardo-castro",
    name: "Teatro Ricardo Castro",
    description: "Teatro histórico con espectáculos de clase mundial.",
    longDescription: "El Teatro Ricardo Castro es un emblemático recinto cultural que ha sido escenario de las más prestigiosas producciones teatrales, conciertos y espectáculos de danza durante más de 80 años. Su arquitectura art déco y su acústica excepcional lo convierten en un destino imperdible para los amantes de las artes escénicas.",
    category: "theaters",
    street: "Calle 5 de Mayo 200",
    neighborhood: "Centro Histórico",
    postalCode: "06000",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1460881680093-7b2a89172366?w=800&q=80",
      "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&q=80",
    ],
    socialLinks: {
      website: "https://teatroricardocastro.com",
      twitter: "https://twitter.com/teatrorc",
      instagram: "https://instagram.com/teatroricardocastro",
    },
    mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80",
    mapUrl: "https://maps.google.com/?q=19.4326,-99.1332",
  },
  {
    id: "museo-arte-moderno",
    name: "Museo de Arte Moderno",
    description: "Colección de arte contemporáneo mexicano e internacional.",
    longDescription: "El Museo de Arte Moderno alberga una de las colecciones más importantes de arte mexicano del siglo XX. Sus salas exhiben obras de artistas icónicos como Frida Kahlo, Diego Rivera y Rufino Tamayo, junto con exposiciones temporales de artistas contemporáneos nacionales e internacionales. Un espacio imprescindible para los amantes del arte.",
    category: "museums",
    street: "Paseo de la Reforma 51",
    neighborhood: "Bosque de Chapultepec",
    postalCode: "11560",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80",
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80",
      "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800&q=80",
      "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80",
    ],
    socialLinks: {
      website: "https://mam.inba.gob.mx",
      facebook: "https://facebook.com/museoartemoderno",
      instagram: "https://instagram.com/maboreal",
    },
    mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80",
    mapUrl: "https://maps.google.com/?q=19.4260,-99.1783",
  },
  {
    id: "cantina-el-palenque",
    name: "Cantina El Palenque",
    description: "Auténtica cantina mexicana con mezcales artesanales.",
    longDescription: "Cantina El Palenque es un tributo a la tradición cantinera mexicana. Ofrecemos una selección curada de más de 100 mezcales artesanales de diferentes regiones de Oaxaca, acompañados de botanas tradicionales y platillos de la cocina mexicana. Un ambiente festivo y auténtico te espera.",
    category: "restaurants",
    street: "Calle Álvaro Obregón 298",
    neighborhood: "Col. Roma Norte",
    postalCode: "06700",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
      "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
    ],
    socialLinks: {
      instagram: "https://instagram.com/elpalenquemx",
      facebook: "https://facebook.com/elpalenquemx",
    },
    mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80",
    mapUrl: "https://maps.google.com/?q=19.4185,-99.1595",
  },
  {
    id: "chocolateria-que-bo",
    name: "Chocolatería Que Bo!",
    description: "Chocolates artesanales con cacao mexicano de origen.",
    longDescription: "Que Bo! es una chocolatería artesanal que celebra el cacao mexicano en todas sus expresiones. Utilizamos cacao de origen de Tabasco, Chiapas y Oaxaca para crear chocolates finos con sabores únicos que van desde lo tradicional hasta lo innovador. Una experiencia sensorial para los amantes del chocolate.",
    category: "desserts",
    street: "Av. Ámsterdam 154",
    neighborhood: "Col. Hipódromo Condesa",
    postalCode: "06100",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
      "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&q=80",
      "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80",
      "https://images.unsplash.com/photo-1542843137-8791a6904d14?w=800&q=80",
    ],
    socialLinks: {
      website: "https://quebo.mx",
      instagram: "https://instagram.com/quebo_mx",
    },
    mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80",
    mapUrl: "https://maps.google.com/?q=19.4115,-99.1685",
  },
];

export function getBusinessById(id: string): Business | undefined {
  return businesses.find((b) => b.id === id);
}

export function getBusinessesByCategory(categoryId: string): Business[] {
  if (categoryId === "all") return businesses;
  return businesses.filter((b) => b.category === categoryId);
}
