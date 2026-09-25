const brands = {
  Amazon: { url: "https://www.amazon.in/", logo: "https://cdn.simpleicons.org/amazon", image: "https://cdn.simpleicons.org/amazon" },
  AJIO: { url: "https://www.ajio.com/", logo: "https://cdn.simpleicons.org/ajio", image: "https://cdn.simpleicons.org/ajio" },
  Swiggy: { url: "https://www.swiggy.com/", logo: "https://cdn.simpleicons.org/swiggy", image: "https://cdn.simpleicons.org/swiggy" },
  Ola: { url: "https://www.olacabs.com/", logo: "https://cdn.simpleicons.org/ola", image: "https://cdn.simpleicons.org/ola" }
};

export const popularStores = [
  { name: "Amazon", slug: "amazon", category: "Shopping", logo: brands.Amazon.logo, url: brands.Amazon.url, cashbackRate: 8 },
  { name: "AJIO", slug: "ajio", category: "Fashion", logo: brands.AJIO.logo, url: brands.AJIO.url, cashbackRate: 12 },
  { name: "Flipkart", slug: "flipkart", category: "Shopping", logo: "F", url: "https://www.flipkart.com/", cashbackRate: 7 },
  { name: "Myntra", slug: "myntra", category: "Fashion", logo: "M", url: "https://www.myntra.com/", cashbackRate: 10 },
  { name: "Swiggy", slug: "swiggy", category: "Food", logo: brands.Swiggy.logo, url: brands.Swiggy.url, cashbackRate: 6 },
  { name: "Zomato", slug: "zomato", category: "Food", logo: "Z", url: "https://www.zomato.com/", cashbackRate: 5 },
  { name: "Blinkit", slug: "blinkit", category: "Grocery", logo: "B", url: "https://blinkit.com/", cashbackRate: 5 },
  { name: "MakeMyTrip", slug: "makemytrip", category: "Travel", logo: "MMT", url: "https://www.makemytrip.com/", cashbackRate: 9 }
];

export const demoCoupons = [
  { id: 1, store: "Amazon", logo: brands.Amazon.logo, image: brands.Amazon.image, url: brands.Amazon.url, title: "Save on selected products", code: "ACSAVE", discount: "Up to 20% OFF", verified: true, expires: "30 Sep 2026" },
  { id: 2, store: "AJIO", logo: brands.AJIO.logo, image: brands.AJIO.image, url: brands.AJIO.url, title: "Extra savings on fashion", code: "AJIO20", discount: "Extra 20% OFF", verified: true, expires: "28 Sep 2026" },
  { id: 3, store: "Swiggy", logo: brands.Swiggy.logo, image: brands.Swiggy.image, url: brands.Swiggy.url, title: "Food delivery savings", code: "SWIGGY150", discount: "₹150 OFF", verified: true, expires: "29 Sep 2026" },
  { id: 4, store: "Ola", logo: brands.Ola.logo, image: brands.Ola.image, url: brands.Ola.url, title: "Ride savings for selected users", code: "OLA100", discount: "₹100 OFF", verified: true, expires: "27 Sep 2026" }
];
