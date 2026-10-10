const express = require("express");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { verifyKey } = require("discord-interactions");
require("dotenv").config();

const token = process.env.DISCORD_TOKEN;
const publicKey = process.env.DISCORD_PUBLIC_KEY;
const port = Number(process.env.PORT || 3000);
const prefix = process.env.BOT_PREFIX || ",";

if (!token || token === "TU_TOKEN_DE_BOT") {
  throw new Error("Configura DISCORD_TOKEN en .env antes de iniciar el bot Node.js.");
}

if (!publicKey || publicKey === "TU_PUBLIC_KEY") {
  throw new Error("Configura DISCORD_PUBLIC_KEY en .env para usar el endpoint de interacciones.");
}

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = Buffer.from(buf);
  },
}));

app.get("/", (_req, res) => {
  res.send("Discord bot server is running.");
});

app.post("/api/discord/interactions", (req, res) => {
  const signature = req.get("x-signature-ed25519");
  const timestamp = req.get("x-signature-timestamp");

  if (!signature || !timestamp) {
    return res.status(401).send("Missing Discord signature headers");
  }

  const isValid = verifyKey(req.rawBody, signature, timestamp, publicKey);

  if (!isValid) {
    return res.status(401).send("Invalid request signature");
  }

  const interaction = req.body;

  if (interaction.type === 1) {
    return res.json({ type: 1 });
  }

  if (interaction.type === 2) {
    return res.json({
      type: 4,
      data: {
        content: "Hello from your bot! ✅",
      },
    });
  }

  return res.sendStatus(200);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, readyClient => {
  console.info(`Conectado como ${readyClient.user.tag} (Node.js).`);

  app.listen(port, () => {
    console.info(`Servidor HTTP escuchando en http://localhost:${port}`);
  });
});

client.on(Events.MessageCreate, message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const [command] = message.content.slice(prefix.length).trim().split(/\s+/, 1);
  if (command?.toLowerCase() !== "ping") return;

  void message.reply(`Pong! \`${Math.round(client.ws.ping)} ms\``).catch(error => {
    console.error("No se pudo responder al comando ping:", error);
  });
});

client.login(token).catch(error => {
  console.error("No se pudo iniciar sesión con el bot de Discord:", error);
  process.exitCode = 1;
});
