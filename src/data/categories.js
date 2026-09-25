export const categories = [
  { slug: "hotel", name: "Hotel", icon: "🏨", apiCategory: "Hotels", subcategories: ["Hotel Coupons", "Hotel Deals", "Budget Hotels", "Resorts", "Weekend Stays"] },
  { slug: "restaurant", name: "Restaurant", icon: "🍽️", apiCategory: "Restaurants", subcategories: ["Restaurant Coupons", "Dining Offers", "Food Delivery", "Cafes", "Fast Food"] },
  { slug: "shopping", name: "Shopping", icon: "🛍️", apiCategory: "Shopping", subcategories: ["Amazon", "AJIO", "Flipkart", "Myntra", "Fashion", "Electronics"] },
  { slug: "cab", name: "Cab", icon: "🚕", apiCategory: "Transport", subcategories: ["Ola", "Uber", "Rapido", "Auto", "Bike Taxi"] },
  { slug: "fashion", name: "Fashion", icon: "👕", apiCategory: "Fashion", subcategories: ["Men's", "Women's", "Kids", "Shoes", "Accessories", "Sportswear", "Bags & Luggage"] },
  { slug: "electronics", name: "Electronics", icon: "📱", apiCategory: "Electronics", subcategories: ["Mobiles", "Laptops", "Tablets", "TVs", "Headphones & Earbuds", "Smartwatches", "Cameras", "Gaming", "Accessories"] },
  { slug: "food-dining", name: "Food & Dining", icon: "🍔", apiCategory: "Food", subcategories: ["Food Delivery", "Restaurants", "Pizza", "Fast Food", "Cafes", "Dining Offers", "Grocery Delivery"] },
  { slug: "grocery", name: "Grocery & Daily Needs", icon: "🛒", apiCategory: "Grocery", subcategories: ["Grocery", "Fruits & Vegetables", "Household", "Cleaning Products", "Personal Care", "Baby Products", "Quick Commerce"] },
  { slug: "recharge-bills", name: "Recharge & Bills", icon: "📲", apiCategory: "Recharge", subcategories: ["Mobile Recharge", "DTH Recharge", "Electricity Bill", "Gas Bill", "Broadband", "Water Bill", "FASTag"] },
  { slug: "transport", name: "Transport", icon: "🚕", apiCategory: "Transport", subcategories: ["Cab", "Auto", "Bike Taxi", "Car Rental", "Local Transport"] },
  { slug: "travel", name: "Travel", icon: "✈️", apiCategory: "Travel", subcategories: ["Flights", "Hotels", "Bus", "Train", "Cab", "Car Rental", "Holiday Packages"] },
  { slug: "beauty", name: "Beauty & Personal Care", icon: "💄", apiCategory: "Beauty", subcategories: ["Skincare", "Haircare", "Makeup", "Perfumes", "Grooming", "Salon & Spa"] },
  { slug: "home-living", name: "Home & Living", icon: "🏠", apiCategory: "Home", subcategories: ["Furniture", "Home Decor", "Kitchen", "Appliances", "Home Improvement", "Bedding"] },
  { slug: "health", name: "Health & Wellness", icon: "💊", apiCategory: "Health", subcategories: ["Pharmacy", "Health Tests", "Fitness", "Supplements", "Wellness"] },
  { slug: "software-services", name: "Software & Services", icon: "💻", apiCategory: "Software", subcategories: ["Web Hosting", "Domains", "VPN", "AI Tools", "SaaS", "Design Tools", "Productivity Tools"] },
  { slug: "entertainment", name: "Entertainment", icon: "🎬", apiCategory: "Entertainment", subcategories: ["OTT", "Movies", "Music", "Games", "Gaming Accessories", "Events"] },
  { slug: "education", name: "Education", icon: "📚", apiCategory: "Education", subcategories: ["Online Courses", "Coding", "Certifications", "Exam Preparation", "Books", "Learning Apps"] },
  { slug: "bank-payment", name: "Bank & Payment Offers", icon: "💳", apiCategory: "Bank & Payment", subcategories: ["Credit Card", "Debit Card", "UPI", "Wallets", "EMI Offers", "Cashback Offers"] },
  { slug: "automotive", name: "Automotive", icon: "🚗", apiCategory: "Automotive", subcategories: ["Car Accessories", "Bike Accessories", "Tyres", "Car Service", "Bike Service", "Car Wash"] },
  { slug: "baby-kids", name: "Baby & Kids", icon: "👶", apiCategory: "Baby & Kids", subcategories: ["Baby Care", "Diapers", "Toys", "Kids Fashion", "Baby Food"] },
  { slug: "pet-care", name: "Pet Care", icon: "🐶", apiCategory: "Pet Care", subcategories: ["Pet Food", "Pet Accessories", "Grooming", "Pet Healthcare"] },
  { slug: "gifts", name: "Gifts & Occasions", icon: "🎁", apiCategory: "Gifts & Occasions", subcategories: ["Flowers", "Cakes", "Gifts", "Personalized Gifts", "Festival Offers"] },
  { slug: "local-deals", name: "Local Deals", icon: "🏪", apiCategory: "Local Deals", subcategories: ["Restaurants", "Salons", "Spas", "Gyms", "Hotels", "Local Shops", "Local Services"] }
];

export const dailyUse = [
  { name: "Taxi", icon: "🚕", brands: ["Ola", "Uber", "Rapido"], category: "cab", href: "/category/cab" },
  { name: "Shopping", icon: "🛍️", brands: ["Amazon", "AJIO", "Flipkart", "Myntra"], category: "shopping", href: "/category/shopping" },
  { name: "Food", icon: "🍔", brands: ["Swiggy", "Zomato", "Domino's"], category: "restaurant", href: "/category/restaurant" },
  { name: "Grocery", icon: "🥦", brands: ["Blinkit", "Zepto", "BigBasket"], category: "Grocery" },
  { name: "Recharge", icon: "📱", brands: ["Jio", "Airtel", "Vi"], category: "recharge-bills", href: "/category/recharge-bills" },
  { name: "Travel", icon: "✈️", brands: ["MakeMyTrip", "Goibibo", "Cleartrip"], category: "travel", href: "/category/travel" },
  { name: "Payments", icon: "💳", brands: ["PhonePe", "Paytm", "Google Pay"], category: "bank-payment", href: "/category/bank-payment" }
];
