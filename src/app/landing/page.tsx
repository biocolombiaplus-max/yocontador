import { Check, ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/money";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { BILLING_PERIOD_META } from "@/lib/constants";
import { companyInitials } from "@/lib/initials";
import "./premium.css";
import LandingInteractions from "./landing-interactions";
import WhatsAppIcon from "./whatsapp-icon";

const LANDING_TITLE = "Bio Marketing | Innovacion digital con Inteligencia Artificial";
const LANDING_DESCRIPTION =
  "Grupo tecnologico colombiano: software, automatizacion y marketing con IA para negocios en toda Colombia.";

export const metadata = {
  title: LANDING_TITLE,
  description: LANDING_DESCRIPTION,
  openGraph: {
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "Bio Marketing" }],
    type: "website",
    locale: "es_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    images: ["/brand/og-image.png"],
  },
};

// Los servicios y empresas se administran desde el panel, asi que esta
// pagina debe consultar la base de datos en cada visita, no quedar cacheada.
export const dynamic = "force-dynamic";

const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP ?? "573505457420";
const GENERAL_MSG = "Hola Bio Marketing, quiero informacion sobre sus productos y servicios.";

const PRICING_SLUGS = ["redes-emprendedor", "redes-basico", "redes-intermedio", "redes-empresarial"];

const META_ADS_SETUP_FEES: Record<string, number> = {
  "redes-emprendedor": 50000,
  "redes-basico": 70000,
  "redes-intermedio": 100000,
};

const AI_SERVICES = [
  {
    title: "Automatizacion de procesos con IA",
    text: "Optimizamos procesos manuales y repetitivos de tu empresa (atencion al cliente, ventas, facturacion, reportes) con soluciones de Inteligencia Artificial a la medida, sin importar el sector.",
    bullets: [
      "Chatbots y asistentes con IA",
      "Automatizacion de flujos internos y reportes",
      "Integracion con tus sistemas actuales",
    ],
    ctaText: "Hablar de automatizacion",
    waMsg: "Hola, quiero informacion sobre automatizacion de procesos con IA para mi empresa.",
  },
  {
    title: "Cursos y talleres de Inteligencia Artificial",
    text: "Capacitamos a tu equipo para usar la Inteligencia Artificial en el dia a dia: desde herramientas basicas hasta automatizacion avanzada, con talleres practicos adaptados a tu empresa.",
    bullets: [
      "Talleres presenciales o virtuales",
      "Contenido adaptado a tu sector",
      "Casos practicos con herramientas reales de IA",
    ],
    ctaText: "Hablar de cursos de IA",
    waMsg: "Hola, quiero informacion sobre cursos y talleres de Inteligencia Artificial para mi empresa.",
  },
];

const VALUES = [
  {
    title: "Decisiones con datos, no con suposiciones",
    text: "Cada estrategia se apoya en analitica de datos e Inteligencia Artificial real, no en una etiqueta de moda.",
  },
  {
    title: "Desarrollo a la medida",
    text: "Cada producto se personaliza con el logo, colores y necesidades reales de tu negocio.",
  },
  {
    title: "Soporte humano real",
    text: "Detras de cada producto hay un equipo que responde por WhatsApp, no un bot sin salida.",
  },
  {
    title: "Hecho en Colombia",
    text: "Para negocios colombianos: precios en pesos, soporte en espanol y por WhatsApp.",
  },
];

export default async function LandingPage() {
  const [companies, allServices] = await Promise.all([
    prisma.company.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.serviceOffering.findMany({
      where: { isActive: true, isPublished: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const pricingPlans = allServices.filter((s) => PRICING_SLUGS.includes(s.slug));
  const services = allServices.filter((s) => !PRICING_SLUGS.includes(s.slug));

  const heroWhatsApp = buildWhatsAppLink(SUPPORT_WHATSAPP, GENERAL_MSG);
  const loopedCompanies = companies.length > 0 ? [...companies, ...companies] : [];

  return (
    <div className="bio-landing">
      <LandingInteractions />
      <div className="bg-glow" aria-hidden="true" />

      {/* NAV */}
      <nav id="bioNav">
        <a href="#top" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Bio Marketing" className="brand-mark" />
          <span className="brand-word">
            Bio<b>Marketing</b>
          </span>
        </a>
        <div className="nav-links" id="bioNavLinks">
          <a href="#empresas">Empresas</a>
          <a href="#planes">Planes</a>
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
              <b className="counter" data-target={pricingPlans.length}>0</b>
              <span>Planes de redes sociales</span>
            </div>
            <div className="stat">
              <b className="counter" data-target={services.length}>0</b>
              <span>Servicios digitales</span>
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
                          Ver demo
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

      {/* PLANES DE REDES SOCIALES */}
      {pricingPlans.length > 0 && (
        <section id="planes" style={{ background: "var(--bg2)" }}>
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">Estrategia - Datos - Inteligencia Artificial</span>
              <h2>
                Redes sociales que convierten <span className="grad-text">seguidores en clientes</span>
              </h2>
              <p>
                Nada de publicar por publicar. Trabajamos con la misma metodologia de las agencias
                lideres: analisis de nicho, optimizacion de perfil y estrategia de contenido apoyada
                en Inteligencia Artificial y analitica de datos, para cualquier negocio o marca
                personal que quiera crecer con resultados medibles, no solo likes.
              </p>
            </div>
            <div className="pricing-grid">
              {pricingPlans.map((s) => {
                const bullets = s.description.split("\n").filter(Boolean);
                const isCustom = s.defaultPriceCOP === 0;
                const planLabel = s.name.replace("Redes sociales - ", "");
                const waLink = buildWhatsAppLink(
                  SUPPORT_WHATSAPP,
                  `Hola, quiero adquirir el plan "${s.name}" de gestion de redes sociales.`
                );
                const metaFee = META_ADS_SETUP_FEES[s.slug];
                return (
                  <div className={`plan reveal${s.isFeatured ? " featured" : ""}`} key={s.id}>
                    {s.isFeatured && <span className="plan-badge">Mas elegido</span>}
                    <h3>{planLabel}</h3>
                    <p className="plan-sub">{s.shortDescription}</p>
                    {isCustom ? (
                      <div className="price">A la medida</div>
                    ) : (
                      <div className="price">
                        {formatCOP(s.defaultPriceCOP)} <small>COP/mes</small>
                      </div>
                    )}
                    <div className="price-note">
                      {isCustom ? "Cotizacion segun marcas y alcance" : "Sin permanencia minima"}
                    </div>
                    <ul>
                      {bullets.map((b) => (
                        <li key={b}>
                          <Check size={17} />
                          {b}
                        </li>
                      ))}
                    </ul>

                    {metaFee ? (
                      <>
                        <div className="plan-divider">Elige como quieres empezar</div>
                        <div className="plan-options">
                          <div className="plan-option recommended">
                            <span className="plan-option-badge">Recomendado</span>
                            <h4>Con campana paga en Meta Ads</h4>
                            <p>
                              Anuncios reales en Instagram y Facebook para atraer clientes
                              potenciales desde el dia 1.
                            </p>
                            <div className="plan-option-price">
                              +{formatCOP(metaFee)} <small>montaje unico</small>
                            </div>
                            <div className="plan-option-note">
                              Inversion publicitaria desde $5.000 COP/dia (se paga directo a Meta)
                            </div>
                            <a
                              href={buildWhatsAppLink(
                                SUPPORT_WHATSAPP,
                                `Hola, quiero el plan ${planLabel} CON campana paga en Meta Ads.`
                              )}
                              className="btn btn-grad"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Me interesa con campana paga
                            </a>
                          </div>
                          <div className="plan-option">
                            <h4>Sin campana paga (organico)</h4>
                            <p>Empieza a crecer con contenido y estrategia organica.</p>
                            <div className="plan-option-price">Incluido</div>
                            <div className="plan-option-note">
                              Puedes activar la pauta mas adelante cuando quieras
                            </div>
                            <a
                              href={buildWhatsAppLink(
                                SUPPORT_WHATSAPP,
                                `Hola, quiero el plan ${planLabel} SIN campana paga por ahora.`
                              )}
                              className="btn btn-ghost"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Me interesa sin campana paga
                            </a>
                          </div>
                        </div>
                      </>
                    ) : (
                      <a
                        href={waLink}
                        className={`btn ${s.isFeatured ? "btn-whatsapp" : "btn-ghost"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Me interesa adquirir
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SERVICIOS */}
      <section id="servicios">
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
                  `Hola! Me interesa el servicio "${s.name}" que vi en la pagina de Bio Marketing.`
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
                    <ul>
                      {s.description.split("\n").filter(Boolean).map((line) => (
                        <li key={line}>
                          <Check size={16} style={{ color: s.colorHex }} />
                          {line}
                        </li>
                      ))}
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

      {/* MAS SERVICIOS (IA a la medida) */}
      <section id="mas-servicios" style={{ background: "var(--bg2)" }}>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">Mas servicios</span>
            <h2>
              Inteligencia Artificial aplicada a <span className="grad-text">cualquier empresa</span>
            </h2>
            <p>
              No solo desarrollamos productos propios: tambien ayudamos a otras empresas a
              incorporar IA en sus procesos y a que sus equipos aprendan a usarla.
            </p>
          </div>
          <div className="services-grid-2col">
            {AI_SERVICES.map((svc) => {
              const waLink = buildWhatsAppLink(SUPPORT_WHATSAPP, svc.waMsg);
              return (
                <div className="scard reveal" key={svc.title}>
                  <div className="scard-icon">
                    <Sparkles />
                  </div>
                  <h3>{svc.title}</h3>
                  <p>{svc.text}</p>
                  <ul>
                    {svc.bullets.map((b) => (
                      <li key={b}>
                        <Check size={17} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a href={waLink} className="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon size={16} />
                    {svc.ctaText}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="kicker">Por que Bio Marketing</span>
            <h2>
              IA real, hecha por personas que <span className="grad-text">responden</span>
            </h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div className="value reveal" key={v.title}>
                <div className="value-icon">
                  <ShieldCheck />
                </div>
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contacto">
        <div className="wrap">
          <div className="final-cta reveal">
            <h2>Hablemos de tu proyecto</h2>
            <p>
              Cuentanos que necesitas y te decimos, sin rodeos, que servicio de Bio Marketing se
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo.png" alt="Bio Marketing" className="brand-mark" />
                <span className="brand-word">
                  Bio<b>Marketing</b>
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
              <h5>Servicios</h5>
              <a href="#planes">Redes sociales</a>
              <a href="#servicios">Servicios digitales</a>
              <a href="#mas-servicios">Automatizacion con IA</a>
            </div>
            <div className="footer-col">
              <h5>Contacto</h5>
              <a href={heroWhatsApp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href={`mailto:${process.env.EMAIL_USER ?? "contacto@biomarketing.com"}`}>Correo</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Bio Marketing. Todos los derechos reservados.</span>
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
