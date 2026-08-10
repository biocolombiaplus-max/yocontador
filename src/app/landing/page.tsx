import { Check, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/money";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { BILLING_PERIOD_META } from "@/lib/constants";
import { companyInitials } from "@/lib/initials";
import "./premium.css";
import LandingInteractions from "./landing-interactions";
import WhatsAppIcon from "./whatsapp-icon";

export const metadata = {
  title: "BIO COLOMBIA | Innovacion digital con Inteligencia Artificial",
  description:
    "Grupo tecnologico colombiano: software, automatizacion y marketing con IA para negocios en toda Colombia.",
};

// Los servicios y empresas se administran desde el panel, asi que esta
// pagina debe consultar la base de datos en cada visita, no quedar cacheada.
export const dynamic = "force-dynamic";

const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP ?? "573505457420";
const GENERAL_MSG = "Hola BIO COLOMBIA, quiero informacion sobre sus productos y servicios.";

export default async function LandingPage() {
  const [companies, services] = await Promise.all([
    prisma.company.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.serviceOffering.findMany({
      where: { isActive: true, isPublished: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const heroWhatsApp = buildWhatsAppLink(SUPPORT_WHATSAPP, GENERAL_MSG);
  const loopedCompanies = companies.length > 0 ? [...companies, ...companies] : [];

  return (
    <div className="bio-landing">
      <LandingInteractions />
      <div className="bg-glow" aria-hidden="true" />

      {/* NAV */}
      <nav id="bioNav">
        <a href="#top" className="brand">
          <div className="brand-mark" style={{ background: "var(--grad-brand)" }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.85rem",
              }}
            >
              BC
            </div>
          </div>
          <span className="brand-word">
            BIO<b>COLOMBIA</b>
          </span>
        </a>
        <div className="nav-links" id="bioNavLinks">
          <a href="#empresas">Empresas</a>
          <a href="#servicios">Servicios</a>
          <a href="#contacto">Contacto</a>
          <a href={heroWhatsApp} className="nav-cta" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={17} />
            WhatsApp
          </a>
        </div>
        <button className="nav-toggle" id="bioNavToggle" aria-label="Menu">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </nav>

      {/* HERO */}
      <header className="hero" id="top">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="wrap">
          <span className="kicker">Grupo tecnologico colombiano - IA aplicada</span>
          <h1>
            Convertimos <span className="grad-text">Inteligencia Artificial</span> en resultados
            reales para tu negocio
          </h1>
          <p className="lead">
            Desarrollamos software, automatizacion y estrategia digital apoyada en analitica de
            datos e Inteligencia Artificial, para negocios de cualquier sector en toda Colombia.
          </p>
          <div className="hero-cta">
            <a href={heroWhatsApp} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Hablar por WhatsApp
            </a>
            <a href="#servicios" className="btn btn-ghost">
              Ver servicios
            </a>
          </div>
          <div className="stats-bar reveal">
            <div className="stat">
              <b className="counter" data-target={companies.length}>0</b>
              <span>Empresas del grupo</span>
            </div>
            <div className="stat">
              <b className="counter" data-target={services.length}>0</b>
              <span>Servicios digitales</span>
            </div>
            <div className="stat">
              <b className="counter" data-target={4} data-prefix="+">0</b>
              <span>Redes sociales integradas</span>
            </div>
            <div className="stat">
              <b className="counter" data-target={100} data-suffix="%">0</b>
              <span>Soporte humano real</span>
            </div>
          </div>
        </div>
      </header>

      {/* LOGO MARQUEE */}
      {companies.length > 0 && (
        <div className="logo-strip">
          <div className="wrap">
            <p>Nuestro ecosistema de empresas</p>
          </div>
          <div className="marquee">
            <div className="marquee-track">
              {loopedCompanies.map((c, i) => (
                <div className="brand-chip" key={`${c.id}-${i}`} aria-hidden={i >= companies.length}>
                  <div className="badge" style={{ background: c.colorHex }}>
                    {c.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logoUrl} alt={c.name} loading="lazy" />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 800,
                        }}
                      >
                        {companyInitials(c.name)}
                      </div>
                    )}
                  </div>
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EMPRESAS */}
      {companies.length > 0 && (
        <section id="empresas">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">Nuestras empresas</span>
              <h2>
                Un ecosistema de negocios con <span className="grad-text">Inteligencia Artificial</span>
              </h2>
              <p>
                Empresas propias del grupo, cada una enfocada en resolver un problema real, con
                tecnologia trabajando de verdad dentro, no solo de nombre.
              </p>
            </div>
            <div className="products-grid">
              {companies.map((c) => {
                const waLink = buildWhatsAppLink(
                  SUPPORT_WHATSAPP,
                  `Hola, quiero informacion sobre ${c.name}.`
                );
                return (
                  <article
                    className="pcard reveal"
                    key={c.id}
                    style={
                      {
                        "--accent-c": c.colorHex,
                        "--accent-grad": `linear-gradient(90deg, ${c.colorHex}, rgba(255,255,255,.2))`,
                      } as React.CSSProperties
                    }
                  >
                    <div className="pcard-top">
                      <div className="pcard-badge" style={{ background: c.colorHex }}>
                        {c.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.logoUrl} alt={c.name} loading="lazy" />
                        ) : (
                          companyInitials(c.name)
                        )}
                      </div>
                      <div>
                        <span className="pcard-tag">{c.sector}</span>
                        <h3>{c.name}</h3>
                      </div>
                    </div>
                    <p className="desc">{c.description}</p>
                    <div className="pcard-actions">
                      <a href={waLink} className="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon size={16} />
                        Preguntar por {c.name}
                      </a>
                      {c.website && (
                        <a href={c.website} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
                          <ArrowUpRight size={15} />
                          Sitio web
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SERVICIOS */}
      <section id="servicios" style={{ background: "var(--bg2)" }}>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">Servicios digitales</span>
            <h2>
              Soluciones que <span className="grad-text">convierten en resultados</span>
            </h2>
            <p>
              Cada servicio esta pensado para resolver algo concreto: automatizar, comunicar mejor
              o crecer con datos reales, no solo con actividad en redes.
            </p>
          </div>

          {services.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--ink3)" }}>
              Pronto publicaremos nuestros servicios aqui.
            </p>
          ) : (
            <div className="services-grid">
              {services.map((s) => {
                const waLink = buildWhatsAppLink(
                  SUPPORT_WHATSAPP,
                  `Hola! Me interesa el servicio "${s.name}" que vi en la pagina de BIO COLOMBIA.`
                );
                return (
                  <div
                    className="plan reveal"
                    key={s.id}
                    style={
                      {
                        "--accent-grad": `linear-gradient(90deg, ${s.colorHex}, rgba(255,255,255,.2))`,
                      } as React.CSSProperties
                    }
                  >
                    <div className="plan-badge-img" style={{ background: s.colorHex }}>
                      {s.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.logoUrl} alt={s.name} loading="lazy" />
                      ) : (
                        companyInitials(s.name)
                      )}
                    </div>
                    <h3>{s.name}</h3>
                    <p className="plan-sub">{s.shortDescription}</p>
                    <div className="price">
                      {formatCOP(s.defaultPriceCOP)}{" "}
                      <small>/ {BILLING_PERIOD_META[s.defaultPeriod].label.toLowerCase()}</small>
                    </div>
                    <ul style={{ marginBottom: 24 }}>
                      <li style={{ display: "flex", gap: 9, fontSize: ".84rem", color: "var(--ink2)" }}>
                        <Check size={16} style={{ flexShrink: 0, marginTop: 2, color: s.colorHex }} />
                        {s.description}
                      </li>
                    </ul>
                    <a href={waLink} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon size={16} />
                      Quiero este servicio
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contacto">
        <div className="wrap">
          <div className="final-cta reveal">
            <h2>Hablemos de tu proyecto</h2>
            <p>
              Cuentanos que necesitas y te decimos, sin rodeos, que servicio de BIO COLOMBIA se
              ajusta mejor a tu negocio.
            </p>
            <div className="hero-cta">
              <a href={heroWhatsApp} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                Escribir por WhatsApp
              </a>
              <a
                href={`mailto:${process.env.EMAIL_USER ?? "contacto@biocolombia.com"}`}
                className="btn btn-ghost"
              >
                Enviar un correo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="brand">
                <div className="brand-mark" style={{ background: "var(--grad-brand)" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                    }}
                  >
                    BC
                  </div>
                </div>
                <span className="brand-word">
                  BIO<b>COLOMBIA</b>
                </span>
              </a>
              <p>Innovacion digital: software, automatizacion y marketing con Inteligencia Artificial.</p>
            </div>
            <div className="footer-col">
              <h5>Empresas</h5>
              {companies.map((c) => (
                <a href="#empresas" key={c.id}>
                  {c.name}
                </a>
              ))}
            </div>
            <div className="footer-col">
              <h5>Contacto</h5>
              <a href={heroWhatsApp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href={`mailto:${process.env.EMAIL_USER ?? "contacto@biocolombia.com"}`}>Correo</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} BIO COLOMBIA. Todos los derechos reservados.</span>
            <span>Hecho en Colombia</span>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOTANTE */}
      <a href={heroWhatsApp} className="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp">
        <WhatsAppIcon size={30} />
      </a>
    </div>
  );
}
