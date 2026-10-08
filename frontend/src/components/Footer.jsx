import { BUSINESS } from "../config";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__row">
        <div>
          <p className="site-footer__brand">Afonja Frozen Foods</p>
          <p className="site-footer__tag">{BUSINESS.tagline}</p>
        </div>

        <nav className="site-footer__links" aria-label="Footer">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="/admin">Inventory login</a>
        </nav>
      </div>
      <div className="container">
        <p className="site-footer__copy">
          © {year} Afonja Frozen Foods, {BUSINESS.town}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
