import { BUSINESS } from "../config";
import { buildWhatsAppContactLink } from "../utils/whatsapp";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container contact__row">
        <div>
          <span className="section-kicker">SKIP THE MARKET</span>
          <h2>You only needed fish. So why did it take all afternoon?</h2>
          <p>
            Leave the house. &rarr; Find transport. &rarr; Get to the market. &rarr; Search around.&rarr; Negotiate. &rarr;
            Carry everything back.
          </p>
          <p>
            <b>A simple food run shouldn't take half your day.</b>
          </p>

          <p>Order your meat and fish from your phone and let Afonja bring it to your doorstep.</p>
          <a
            href={buildWhatsAppContactLink(
              "Hello Afonja Frozen Foods, I have a question."
            )}
            className="btn btn-whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            Order on WhatsApp
          </a>
        </div>

        <dl className="contact-card">
          <div className="contact-card__row">
            <dt>Location</dt>
            <dd>{BUSINESS.town}</dd>
          </div>
          <div className="contact-card__row">
            <dt>Phone / WhatsApp</dt>
            <dd>{BUSINESS.whatsappDisplay}</dd>
          </div>
          <div className="contact-card__row">
            <dt>Hours</dt>
            <dd>{BUSINESS.hours}</dd>
          </div>
          <div className="contact-card__row">
            <dt>Email</dt>
            <dd>{BUSINESS.email}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
