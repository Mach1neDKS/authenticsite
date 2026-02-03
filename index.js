require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

client.once("ready", () => {
  console.log(`🤖 Bot online som ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  const [action, appId, userId] = interaction.customId.split(":");
  const embed = interaction.message.embeds?.[0];
  if (!embed) return;

  const updateStatus = async (statusText) => {
    const updated = {
      ...embed.data,
      fields: embed.data.fields.map(f =>
        f.name === "📌 Status"
          ? { name: "📌 Status", value: statusText, inline: true }
          : f
      )
    };
    await interaction.update({ embeds: [updated], components: [] });
  };

  try {
    if (action === "approve") {
      await updateStatus("✅ Godkendt");

      if (process.env.STAFF_ROLE_ID && interaction.guild && userId) {
        const member = await interaction.guild.members.fetch(userId).catch(()=>null);
        if (member) await member.roles.add(process.env.STAFF_ROLE_ID).catch(()=>{});
      }

      if (userId) {
        const user = await client.users.fetch(userId).catch(()=>null);
        if (user) {
          await user.send(
            `✅ **Din ansøgning (${appId}) er GODKENDT!**\nVelkommen til Authentic RP.`
          ).catch(()=>{});
        }
      }
    }

    if (action === "deny") {
      await updateStatus("❌ Afvist");

      if (userId) {
        const user = await client.users.fetch(userId).catch(()=>null);
        if (user) {
          await user.send(
            `❌ **Din ansøgning (${appId}) er AFVIST.**\nTak for din interesse i Authentic RP.`
          ).catch(()=>{});
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
});

client.login(process.env.BOT_TOKEN);