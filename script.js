document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".allowlist-form").forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const webhook = form.dataset.webhook;
      if (!webhook) return alert("Webhook mangler!");

      const appId = Math.random().toString(36).substring(2, 8).toUpperCase();

      const fields = [...form.querySelectorAll("textarea")];
      const labels = [
        "Discord navn & ID (inkl. User ID)",
        "Alder",
        "FiveM erfaring",
        "Tidligere RP erfaring",
        "Seriøs RP forståelse",
        "Eksempel på god RP",
        "Eksempel på dårlig RP",
        "IC vs OOC",
        "Konflikthåndtering",
        "Regelforståelse",
        "Motivation for rollen",
        "Bidrag til serveren"
      ];

      let description = "";
      fields.forEach((field, i) => {
        description += `**${labels[i] || "Spørgsmål"}**\n\`${field.value}\`\n\n`;
      });

      if (description.length > 3800) {
        description = description.slice(0, 3800) + "\n\n*(Forkortet)*";
      }

      const userIdMatch = fields[0]?.value.match(/(\d{17,20})/);
      const discordUserId = userIdMatch ? userIdMatch[1] : "";

      const payload = {
        embeds: [{
          title: "📥 Ny Ansøgning – Authentic RP",
          description,
          color: 3447003,
          fields: [
            { name: "📌 Status", value: "⏳ Afventer", inline: true },
            { name: "🆔 Ansøgnings ID", value: appId, inline: true }
          ],
          footer: { text: "Authentic RP • Ansøgningssystem" },
          timestamp: new Date().toISOString()
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Godkend",
                style: 3,
                custom_id: `approve:${appId}:${discordUserId}`
              },
              {
                type: 2,
                label: "Afvis",
                style: 4,
                custom_id: `deny:${appId}:${discordUserId}`
              }
            ]
          }
        ]
      };

      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        alert(`Ansøgning sendt!\nID: ${appId}`);
        form.reset();
      } catch (err) {
        console.error(err);
        alert("Kunne ikke sende ansøgning.");
      }
    });
  });
});


(function () {
  const removeLoader = () => {
    const loader = document.getElementById("page-loader");
    if (!loader) return;

    loader.classList.add("fade-out");

    setTimeout(() => {
      loader.remove();
    }, 900);
  };

  // 🔒 FAILSAFE: fjern loader uanset hvad efter 4 sek
  setTimeout(removeLoader, 4000);

  // 🔓 Normal flow: fjern når DOM er klar
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(removeLoader, 2800);
  });
})();
