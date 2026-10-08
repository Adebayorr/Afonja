import "./About.css";

const PILLARS = [
  {
    title: "30-minute delivery",
    body: "Get your meat and fish delivered straight to your door across Oyo town. And if we're late, we waive your delivery fee.",
  },
  {
    title: "Buy it your way",
    body: "Need a few pieces? Buying by weight? Stocking the freezer? Order exactly the quantity you need.",
  },
  {
    title: "Skip the market",
    body: "No transport. No searching. No negotiating. No carrying heavy bags home. Just order from your phone and stay where you are.",
  },
];

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container about__row">
        <div className="about__copy">
          <span className="section-kicker">Why Afonja</span>
          <h2>Your meat. Your quantity. Your time.</h2>
          <p>
            You shouldn't have to spend half your day at the market just to buy meat. With Afonja, you can order what you need from your phone and have it brought straight to your doorstep.
            <br />
            <br />
            Buy by weight or by piece. Order only what makes sense for your meal. And if we take longer than 30 minutes to deliver, your delivery fee is on us.
          </p>
        </div>

        <div className="pillars">
          {PILLARS.map((pillar) => (
            <div className="pillar-card" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
