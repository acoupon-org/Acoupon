import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Coupons from "./pages/Coupons";
import Deals from "./pages/Deals";
import Stores from "./pages/Stores";
import Store from "./pages/Store";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Search from "./pages/Search";
import StaticPage from "./pages/StaticPage";

function NotFound() {
  return <StaticPage title="Page not found"><p>The page you requested does not exist.</p></StaticPage>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/store/:slug" element={<Store />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<StaticPage title="About ACoupon"><p>ACoupon is a savings discovery platform for coupons, deals and cashback.</p></StaticPage>} />
        <Route path="/contact" element={<StaticPage title="Contact"><p>For general enquiries, partnership requests and store submissions, contact the ACoupon team.</p></StaticPage>} />
        <Route path="/faq" element={<StaticPage title="Frequently Asked Questions"><p>Coupon availability, expiry and merchant terms can change. Always review the merchant checkout page before completing a purchase.</p></StaticPage>} />
        <Route path="/privacy" element={<StaticPage title="Privacy"><p>Replace this placeholder with ACoupon's production privacy policy before launch.</p></StaticPage>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
