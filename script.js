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
            const type = form.getAttribute('data-type') || 'ansøgning';
            const button = form.querySelector('button');

            if (!webhook) {
                alert("Fejl: Webhook URL mangler i HTML-koden (data-webhook).");
                return;
            }

            // Visuel feedback til brugeren
            const originalBtnText = button.innerText;
            button.disabled = true;
            button.innerText = "Sender...";

            // Generer unikt Ansøgnings ID
            const appId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const fields = [...form.querySelectorAll("textarea")];

            // Saml beskrivelse med de faktiske spørgsmål fra placeholder-teksten
            let description = "";
            fields.forEach((field) => {
                // Her tager vi placeholderen (spørgsmålet) og sætter den sammen med svaret
                const question = field.placeholder;
                const answer = field.value;
                
                // Formateret med fed skrift for spørgsmålet for bedre læsbarhed i Discord
                description += `**${question}**\n${answer}\n\n`;
            });

            // Discord begrænsning (max 4096 tegn i description)
            if (description.length > 3800) {
                description = description.slice(0, 3800) + "\n\n*(Ansøgningen er forkortet pga. længde)*";
            }

            const payload = {
                embeds: [{
                    title: `📥 Ny ${type.toUpperCase()} Ansøgning`,
                    description: description,
                    color: 0x2d7cff,
                    fields: [
                        { name: "📌 Status", value: "⏳ Afventer vurdering", inline: true },
                        { name: "🆔 ID", value: appId, inline: true }
                    ],
                    footer: { text: "Authentic RP • Ansøgningssystem" },
                    timestamp: new Date().toISOString()
                }]
            };

            try {
                const response = await fetch(webhook, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert(`✅ Ansøgning sendt!\nGem dit ID: ${appId}`);
                    form.reset();
                } else {
                    throw new Error("Discord API svarede med en fejl");
                }

            } catch (error) {
                console.error(error);
                alert("❌ Kunne ikke sende ansøgningen. Tjek din internetforbindelse eller kontakt en admin.");
            } finally {
                button.disabled = false;
                button.innerText = originalBtnText;
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
        { threshold: 0.15, rootMargin: "0px 0px -120px 0px" }
    );

    revealElements.forEach(el => {
        el.classList.add("reveal");
        revealObserver.observe(el);
    });

    /* =========================
       CUSTOM CURSOR
       ========================= */
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    if (cursor && follower) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });

        document.querySelectorAll("a, button, .staff-card").forEach(el => {
            el.addEventListener("mouseenter", () => follower.classList.add("active"));
            el.addEventListener("mouseleave", () => follower.classList.remove("active"));
        });
    }

    /* =========================
       LOADER REMOVE
       ========================= */
    const loader = document.getElementById("page-loader");
    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("fade-out");
                setTimeout(() => loader.remove(), 900);
            }, 1000);
        });
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