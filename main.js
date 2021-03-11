const Discord = require('discord.js');
require('dotenv').config();
const sched = require('node-schedule');
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

//Commands Startup
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach((handler) => {
    require(`./handlers/${handler}`)(client, Discord);
});

client.login(process.env.DISCORD_TOKEN);
