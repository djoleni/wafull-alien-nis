const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navOverlay = document.getElementById("navOverlay");

const setHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};
setHeader();
window.addEventListener("scroll", setHeader, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Sprečava defaultno ponašanje i promjenu URL-a
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

function setNavOpen(open) {
  navMenu.classList.toggle("open", open);
  menuToggle.classList.toggle("open", open);
  header.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Zatvori meni" : "Otvori meni");
  document.body.classList.toggle("nav-open", open);
  navOverlay.hidden = !open;
}

menuToggle.addEventListener("click", () => {
  setNavOpen(!navMenu.classList.contains("open"));
});
navOverlay.addEventListener("click", () => setNavOpen(false));

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".menu-panel").forEach((panel) => {
      panel.classList.remove("active");
      panel.hidden = true;
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    const panel = document.getElementById(button.dataset.tab);
    panel.classList.add("active");
    panel.hidden = false;
  });
});

document.getElementById("year").textContent = String(new Date().getFullYear());

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const galleryItems = [...document.querySelectorAll(".gallery-item[data-gallery]")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCounter = document.getElementById("lightboxCounter");
let galleryIndex = 0;

function showGalleryImage(index) {
  galleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  lightboxImage.src = item.dataset.gallery;
  lightboxImage.alt = item.querySelector("img")?.alt || "Wafull Alien fotografija";
  lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
}

function openLightbox(index) {
  showGalleryImage(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("nav-open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("nav-open");
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => showGalleryImage(galleryIndex - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showGalleryImage(galleryIndex + 1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("open")) setNavOpen(false);
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showGalleryImage(galleryIndex - 1);
  if (e.key === "ArrowRight") showGalleryImage(galleryIndex + 1);
});

let touchStartX = 0;
lightbox.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);
lightbox.addEventListener(
  "touchend",
  (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) < 45) return;
    showGalleryImage(galleryIndex + (delta < 0 ? 1 : -1));
  },
  { passive: true },
);

const deliveryMarkup = `
  <a class="partner-btn partner-wolt" href="https://wolt.com/sr/srb/nis/restaurant/wafull-alien-nis" target="_blank" rel="noopener noreferrer" aria-label="Poruči preko Wolta">
    <span class="partner-left">
      <span class="wolt-disc" aria-hidden="true">wolt</span>
      <span class="meta"><small>Poruči preko</small><strong>wolt</strong></span>
    </span>
    <svg class="ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
  </a>
  <a class="partner-btn partner-glovo" href="https://glovoapp.com/sr/rs/nis/stores/waful" target="_blank" rel="noopener noreferrer" aria-label="Poruči preko Glova">
    <span class="partner-left">
      <span class="glovo-pin" aria-hidden="true">
        <svg viewBox="90 50 220 310"><path fill="currentColor" d="M198.09 60.108c-49.731 0-90.189 40.459-90.189 90.189 0 18.825 5.9 37.087 16.858 52.54l2.529 3.372 46.921 66.308s5.619 9.272 18.263 9.272h3.652h4.776h2.81c12.362 0 18.263-9.272 18.263-9.272l46.921-66.308 2.248-3.372c11.239-15.453 16.858-33.716 16.858-52.54 0-49.73-40.459-90.189-90.19-90.189m37.087 116.6-2.529 3.372-34.559 48.888-34.559-48.607-2.529-3.653c-5.619-7.867-8.71-17.139-8.71-26.692 0-25.287 20.51-45.797 45.797-45.797s45.797 20.51 45.797 45.797c0 9.561-3.09 18.551-8.71 26.418"/><path fill="currentColor" d="M172.803 322.248c0-13.767 10.677-24.725 25.006-24.725s25.006 10.958 25.006 24.444v.281c0 13.486-10.677 24.444-25.287 24.444-14.328 0-24.725-10.958-24.725-24.444"/></svg>
      </span>
      <span class="meta"><small>Poruči preko</small><strong>glovo</strong></span>
    </span>
    <svg class="ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
  </a>
`;

document.querySelectorAll("[data-delivery-buttons]").forEach((el) => {
  el.innerHTML = deliveryMarkup;
});
