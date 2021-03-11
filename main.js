const Discord = require("discord.js");

const client = new Discord.Client();

const prefix = "a!";

client.once("ready", () => {
  console.log("AoTTG 2 Attendance is ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("pong!");
  }
});

client.login(
  "ODE5NTI1OTMyNjE5NjYxMzQz." + "YEn5AA.V_hGmhmNmfSzpZnBpqkWKa35orA"
);
