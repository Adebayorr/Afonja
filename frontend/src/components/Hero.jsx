import "./Hero.css";

export default function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(/hero-image.webp)` }}
    >
      <div className="container hero__row">
        <div className="hero__copy">
          <h1>Need fish? Skip the market.</h1>
          <p className="hero__lead">
            Fresh meat and fish delivered straight to your door across Oyo town. 
            Order only what you need. 
            <br />
            <strong>30-minute delivery or your delivery fee is FREE.</strong>
          </p>
          <a href="#products" className="btn btn-primary">
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
}
