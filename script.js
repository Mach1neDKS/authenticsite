/* ==================================================
   AUTHENTIC RP – MAIN SCRIPT
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     APPLICATION SYSTEM
     ========================= */
  document.querySelectorAll(".allowlist-form").forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const webhook = form.dataset.webhook;
      if (!webhook) {
        alert("Webhook mangler på formularen.");
        return;
      }

      const appId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const fields = [...form.querySelectorAll("textarea")];

      let description = "";
      fields.forEach((field, i) => {
        description += `**Spørgsmål ${i + 1}**\n${field.value}\n\n`;
      });

      if (description.length > 3800) {
        description = description.slice(0, 3800) + "\n\n*(Forkortet)*";
      }

      const discordIdMatch = fields[0]?.value.match(/(\d{17,20})/);
      const discordUserId = discordIdMatch ? discordIdMatch[1] : "Ukendt";

      const payload = {
        embeds: [{
          title: "📥 Ny Ansøgning – Authentic RP",
          description,
          color: 0x2d7cff,
          fields: [
            { name: "📌 Status", value: "⏳ Afventer", inline: true },
            { name: "🆔 Ansøgnings ID", value: appId, inline: true }
          ],
          footer: { text: "Authentic RP • Ansøgningssystem" },
          timestamp: new Date().toISOString()
        }]
      };

      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        alert(`✅ Ansøgning sendt!\nAnsøgnings ID: ${appId}`);
        form.reset();

      } catch (error) {
        console.error(error);
        alert("❌ Kunne ikke sende ansøgningen.");
      }
    });
  });

  /* =========================
     PAGE TRANSITION
     ========================= */
  document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", e => {
      const url = link.getAttribute("href");
      if (!url || url.startsWith("#") || link.target === "_blank") return;

      e.preventDefault();
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = url;
      }, 450);
    });
  });

/* =========================
   SCROLL REVEAL (IN + OUT)
   ========================= */
const revealElements = document.querySelectorAll(
  ".section, .staff-card, .allowlist-form, .status-card, .center-actions"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -120px 0px"
  }
);

revealElements.forEach(el => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

  /* =========================
     LOADER REMOVE
     ========================= */
  const loader = document.getElementById("page-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("fade-out");
      setTimeout(() => loader.remove(), 900);
    }, 2500);
  }

});

/* =========================
   DIVIDER SCROLL DIRECTION
   ========================= */
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const dividers = document.querySelectorAll(".section-divider.diagonal");

  dividers.forEach(divider => {
    if (currentScroll > lastScrollY) {
      divider.classList.add("scroll-down");
      divider.classList.remove("scroll-up");
    } else {
      divider.classList.add("scroll-up");
      divider.classList.remove("scroll-down");
    }
  });

  lastScrollY = currentScroll;
});
