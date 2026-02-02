/* ===========================
   AUTHENTIC RP – script.js
   =========================== */

window.addEventListener("load", () => {
  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none";
  }

  /* ---------- Allowlist Form ---------- */
  const form = document.querySelector(".allowlist-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* 🔴 INDSÆT DIN DISCORD WEBHOOK HER */
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1467947911878021214/6dNvDkEgEfvbmaEYo_ifUfOmjqBnso0M5mjOUAueVVaf3SClPcOxKs7Jv_eIQUbLWYdx";

    const questions = [
      "Hvad betyder seriøs roleplay for dig, og hvorfor er det vigtigt på en RP-server?",
      "Beskriv en god, realistisk RP-situation du selv kunne forestille dig at spille.",
      "Beskriv en dårlig RP-situation og forklar hvorfor den er dårlig.",
      "Hvilken type karakter ønsker du at spille? (Baggrund, personlighed, styrker/svagheder)",
      "Hvordan adskiller du in-character (IC) og out-of-character (OOC)?",
      "Hvordan håndterer du konflikter i RP, fx hvis en situation ikke går som forventet?",
      "Hvordan vil du reagere, hvis en staff-medarbejder stopper din RP-situation?",
      "Har du tidligere erfaring med seriøs RP? Hvis ja, hvor og i hvor lang tid?",
      "Hvad forventer du af Authentic RP som server og community?",
      "Hvorfor har du valgt at ansøge netop hos Authentic RP frem for andre servere?",
      "Hvordan kan du bidrage positivt til Authentic RP og dets community?",
      "Er der noget andet, du mener staff bør vide om dig som spiller?"
    ];

    const answers = [...form.querySelectorAll("textarea")].map(t =>
      t.value.trim()
    );

    /* ---------- Saml tekst ---------- */
    let fullText = questions
      .map((q, i) => `**${i + 1}. ${q}**\n${answers[i] || "—"}`)
      .join("\n\n");

    /* ---------- Discord limit handling ---------- */
    const MAX_LENGTH = 3900;
    const chunks = [];

    while (fullText.length > 0) {
      chunks.push(fullText.substring(0, MAX_LENGTH));
      fullText = fullText.substring(MAX_LENGTH);
    }

    /* ---------- Send til Discord ---------- */
    try {
      for (let i = 0; i < chunks.length; i++) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            content: i === 0 ? "📥 **Ny Allowlist Ansøgning – Authentic RP**" : null,
            embeds: [
              {
                description: chunks[i],
                color: 3447003,
                timestamp: new Date()
              }
            ]
          })
        });
      }

      alert("✅ Din allowlist-ansøgning er sendt. Tak for din tid!");
      form.reset();

    } catch (error) {
      console.error(error);
      alert("❌ Noget gik galt. Prøv igen senere.");
    }
  });
});
