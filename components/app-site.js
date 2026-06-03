import { LitElement, html } from "lit";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class AppSite extends LitElement {
  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    const cardInner = this.querySelector(".card-inner");
    const bg = this.querySelector(".bg");
    const hint = this.querySelector(".scroll-hint");

    // Entrance animation
    gsap.fromTo(
      cardInner,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15 }
    );
    gsap.fromTo(
      hint,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out", delay: 1.0 }
    );

    // Scroll-driven flip timeline
    const tl = gsap.timeline({ defaults: { ease: "none" } });

    // Flip 1: front → back (0° → 180°)
    tl.to(cardInner, { rotateY: 180, duration: 1 }, 0);
    // BG snaps to blue when card is edge-on (≈90°, t=0.5)
    tl.to([bg, document.body], { backgroundColor: "#0000ff", duration: 0.3, ease: "power1.inOut" }, 0.35);

    // Flip 2: back → front again (180° → 360°)
    tl.to(cardInner, { rotateY: 360, duration: 1 }, 1);
    // BG snaps to dark when card is edge-on (≈270°, t=1.5)
    tl.to([bg, document.body], { backgroundColor: "#111111", duration: 0.3, ease: "power1.inOut" }, 1.35);

    let hintHidden = false;
    let revealed = false;

    ScrollTrigger.create({
      animation: tl,
      trigger: ".card-stage",
      pin: true,
      start: "top top",
      end: "+=300%",
      scrub: 0.6,
      snap: {
        snapTo: (value, self) => {
          const snaps = [0, 0.5, 1];
          const current = self.progress;
          // Only consider points within one step of current position
          const reachable = snaps.filter((s) => Math.abs(s - current) <= 0.51);
          return reachable.reduce((a, b) =>
            Math.abs(a - value) < Math.abs(b - value) ? a : b
          );
        },
        duration: { min: 0.2, max: 0.5 },
        ease: "none",
        delay: 0.1,
      },
      onUpdate: (self) => {
        if (!hintHidden && self.progress > 0.02) {
          hintHidden = true;
          gsap.to(hint, { opacity: 0, duration: 0.35 });
        }
        // Swap front face content while card is invisible (edge-on at ~270°)
        if (!revealed && self.progress >= 0.74) {
          revealed = true;
          cardInner.classList.add("is-revealed");
        } else if (revealed && self.progress < 0.74) {
          revealed = false;
          cardInner.classList.remove("is-revealed");
        }
      },
    });
  }

  render() {
    return html`
      <div class="bg"></div>
      <div class="card-stage">
        <div class="card-wrap">
          <div class="card-inner">
            <div class="card-face card-front">
              <!-- Layer A: initial professional face -->
              <div class="card-front-a">
                <div class="card-front-stripe"></div>
                <div class="card-front-body">
                  <svg class="card-logo" xmlns="http://www.w3.org/2000/svg" viewBox="1 2.5 5 2" fill="currentColor" aria-hidden="true">
                    <polygon points="2,2.5 5,2.5 6,3.5 6,4.5 4,2.5 2,4.5 2,3.5 1,4.5 1,3.5"></polygon>
                  </svg>
                  <div class="card-front-name">Philipp<br />Fromme</div>
                  <div class="card-front-role">Software Developer</div>
                </div>
              </div>
              <!-- Layer B: magic revealed face -->
              <div class="card-front-b">
                <svg class="card-logo card-logo--giant" xmlns="http://www.w3.org/2000/svg" viewBox="1 2.5 5 2" fill="currentColor" aria-hidden="true">
                  <polygon points="2,2.5 5,2.5 6,3.5 6,4.5 4,2.5 2,4.5 2,3.5 1,4.5 1,3.5"></polygon>
                </svg>
              </div>
            </div>
            <div class="card-face card-back">
              <div class="card-back-body">
                <svg class="card-logo" xmlns="http://www.w3.org/2000/svg" viewBox="1 2.5 5 2" fill="currentColor" aria-hidden="true">
                  <polygon points="2,2.5 5,2.5 6,3.5 6,4.5 4,2.5 2,4.5 2,3.5 1,4.5 1,3.5"></polygon>
                </svg>
                <a class="card-back-link" href="https://github.com/philippfromme" target="_blank" rel="noopener">github.com/<br />philippfromme</a>
              </div>
            </div>
          </div>
        </div>
        <div class="scroll-hint">
          <span>Scroll</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <line
              x1="7"
              y1="0"
              x2="7"
              y2="18"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <polyline
              points="1,12 7,18 13,12"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    `;
  }
}

customElements.define("app-site", AppSite);
