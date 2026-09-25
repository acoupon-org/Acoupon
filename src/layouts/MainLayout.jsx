import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import QuickAccessBar from "../components/QuickAccessBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <QuickAccessBar />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
