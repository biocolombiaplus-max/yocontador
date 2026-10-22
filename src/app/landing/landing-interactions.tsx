"use client";

import { useEffect } from "react";

export default function LandingInteractions() {
  useEffect(() => {
    const nav = document.getElementById("bioNav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll);

    const toggle = document.getElementById("bioNavToggle");
    const links = document.getElementById("bioNavLinks");
    const onToggle = () => links?.classList.toggle("open");
    toggle?.addEventListener("click", onToggle);
    const linkEls = links ? Array.from(links.querySelectorAll("a")) : [];
    const closeMenu = () => links?.classList.remove("open");
    linkEls.forEach((a) => a.addEventListener("click", closeMenu));

    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".bio-landing .reveal").forEach((el) => revealIo.observe(el));

    function animateCounter(el: Element) {
      const target = parseInt((el as HTMLElement).dataset.target || "0", 10) || 0;
      const prefix = (el as HTMLElement).dataset.prefix || "";
      const suffix = (el as HTMLElement).dataset.suffix || "";
      const dur = 1300;
      const start = performance.now();
      function tick(now: number) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        (el as HTMLElement).textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const counterIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            counterIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll(".bio-landing .counter").forEach((el) => counterIo.observe(el));

    let tiltCards: HTMLElement[] = [];
    const onMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = x / r.width - 0.5;
      const cy = y / r.height - 0.5;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.style.transform = `perspective(900px) rotateX(${(-cy * 5).toFixed(2)}deg) rotateY(${(cx * 5).toFixed(2)}deg) translateY(-4px)`;
    };
    const onLeave = (e: MouseEvent) => {
      (e.currentTarget as HTMLElement).style.transform = "";
    };
    if (!window.matchMedia("(pointer: coarse)").matches) {
      tiltCards = Array.from(document.querySelectorAll(".bio-landing .pcard"));
      tiltCards.forEach((card) => {
        card.addEventListener("mousemove", onMove as EventListener);
        card.addEventListener("mouseleave", onLeave as EventListener);
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      toggle?.removeEventListener("click", onToggle);
      linkEls.forEach((a) => a.removeEventListener("click", closeMenu));
      revealIo.disconnect();
      counterIo.disconnect();
      tiltCards.forEach((card) => {
        card.removeEventListener("mousemove", onMove as EventListener);
        card.removeEventListener("mouseleave", onLeave as EventListener);
      });
    };
  }, []);

  return null;
}
