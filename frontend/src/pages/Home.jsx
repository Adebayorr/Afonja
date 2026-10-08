import Header from "../components/Header";
import Hero from "../components/Hero";
import Products from "../components/Products";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { useInventory } from "../hooks/useInventory";

export default function Home() {
  const { products } = useInventory();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products products={products} />
        <About />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
