const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const cron = require('cron');
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    disableEveryone: false,
});

//Commands Startup
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach((handler) => {
    require(`./handlers/${handler}`)(client, Discord);
});

const channel = process.env.CHANNEL;
const checkEmoji = '✅';

Number.prototype.between = function (a, b) {
    var min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
    return this >= min && this < max;
};

const attendanceEvent = async () => {
    const attendanceChannel = client.channels.cache.get(channel);
    //CLEAR MSGS
    attendanceChannel.bulkDelete(5);
    /////////
    let today = new Date();
    let quarter;

    if (today.getDate().between(1, 8)) {
        quarter = 1;
    } else if (today.getDate().between(8, 15)) {
        quarter = 2;
    } else if (today.getDate().between(15, 22)) {
        quarter = 3;
    } else if (today.getDate().between(22, 32)) {
        quarter = 4;
    }

    let embed = new Discord.MessageEmbed()
        .setColor('#aaffaa')
        .setTitle(
            `Attendance Check for Quarter ${quarter} of ${
                today.getMonth() + 1
            }/${today.getFullYear()}!`
        )
        .setDescription(
            "It's that time of the month again. React here for attendance!\n\nReact with ✅ to be record your attendance.\n"
        )
        .addFields(
            {
                name: 'Month',
                value: today.getMonth() + 1,
                inline: true,
            },
            {
                name: 'Quarter',
                value: quarter,
                inline: true,
            },
            {
                name: 'Year',
                value: today.getFullYear(),
                inline: true,
            }
        )
        .setFooter('Source code: github.com/gisketch/discord-attendance-bot')
        .setImage('https://i.imgur.com/cbhevsG.png');

    if (quarter === 1) {
        embed.setThumbnail('https://i.imgur.com/fS9dcf3.png');
    } else if (quarter === 2) {
        embed.setThumbnail('https://i.imgur.com/Vpb2PIu.png');
    } else if (quarter === 3) {
        embed.setThumbnail('https://i.imgur.com/fX7PHbv.png');
    } else if (quarter === 4) {
        embed.setThumbnail('https://i.imgur.com/0fBlV0r.png');
    }

    let messageEmbed = await attendanceChannel.send(embed);
    messageEmbed.react(checkEmoji);
};

const attendanceEventStart = async () => {
    const attendanceChannel = client.channels.cache.get(channel);
    //CLEAR MSGS
    attendanceChannel.bulkDelete(5);
    /////////
    let today = new Date();
    let quarter;

    if (today.getDate().between(1, 8)) {
        quarter = 1;
    } else if (today.getDate().between(8, 15)) {
        quarter = 2;
    } else if (today.getDate().between(15, 22)) {
        quarter = 3;
    } else if (today.getDate().between(22, 32)) {
        quarter = 4;
    }

    let embed = new Discord.MessageEmbed()
        .setColor('#aaffaa')
        .setTitle(
            `Attendance Check for Quarter ${quarter} of ${
                today.getMonth() + 1
            }/${today.getFullYear()}!`
        )
        .setDescription(
            "It's that time of the month again. React here for attendance!\n\nReact with ✅ to be record your attendance.\n"
        )
        .addFields(
            {
                name: 'Month',
                value: today.getMonth() + 1,
                inline: true,
            },
            {
                name: 'Quarter',
                value: quarter,
                inline: true,
            },
            {
                name: 'Year',
                value: today.getFullYear(),
                inline: true,
            }
        )
        .setFooter('Source code: github.com/gisketch/discord-attendance-bot')
        .setImage('https://i.imgur.com/cbhevsG.png');

    if (quarter === 1) {
        embed.setThumbnail('https://i.imgur.com/fS9dcf3.png');
    } else if (quarter === 2) {
        embed.setThumbnail('https://i.imgur.com/Vpb2PIu.png');
    } else if (quarter === 3) {
        embed.setThumbnail('https://i.imgur.com/fX7PHbv.png');
    } else if (quarter === 4) {
        embed.setThumbnail('https://i.imgur.com/0fBlV0r.png');
    }
    await attendanceChannel.send('@everyone');
    let messageEmbed = await attendanceChannel.send(embed);
    messageEmbed.react(checkEmoji);
};

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id == channel) {
        if (reaction.emoji.name === checkEmoji) {
            //////////////////////////////////////////////
            /////////// ✅ - EMOJI CHECK - ✅ ////////////
            //////////////////////////////////////////////
            let today = new Date();
            if (today.getDate().between(1, 8)) {
                quarter = 1;
            } else if (today.getDate().between(8, 15)) {
                quarter = 2;
            } else if (today.getDate().between(15, 22)) {
                quarter = 3;
            } else if (today.getDate().between(22, 32)) {
                quarter = 4;
            }
            let attendance = {};
            const fileName = `${
                today.getMonth() + 1
            }-${quarter}-${today.getFullYear()}-ActivityData`;

            //CHECK IF ATTENDANCE EXISTS, load file if true, create new object if false
            try {
                if (fs.existsSync(`./db/${fileName}.json`)) {
                    attendance = JSON.parse(
                        fs.readFileSync(`./db/${fileName}.json`)
                    );
                } else {
                    attendance = {
                        artTeam: [],
                        devTeam: [],
                        mapTeam: [],
                        testTeam: [],
                        modTeam: [],
                    };
                }
            } catch (err) {
                console.error(err);
            }

            //Get the member instead of the user to access roles
            const guildMember = reaction.message.guild.members.cache.find(
                (member) => member.id === user.id
            );

            // Role checks for the user
            if (guildMember.roles.cache.some((r) => r.name === 'Art Team')) {
                if (attendance.artTeam.includes(`<@${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                } else {
                    attendance.artTeam.push(`<@${user.id}>`);
                }
            }

            if (
                guildMember.roles.cache.some(
                    (r) => r.name === 'Development Team'
                )
            ) {
                if (attendance.devTeam.includes(`<@${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                } else {
                    attendance.devTeam.push(`<@${user.id}>`);
                }
            }

            if (
                guildMember.roles.cache.some((r) => r.name === 'Testing Team')
            ) {
                if (attendance.testTeam.includes(`<@${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                } else {
                    attendance.testTeam.push(`<@${user.id}>`);
                }
            }

            if (
                guildMember.roles.cache.some(
                    (r) => r.name === 'Management Team'
                )
            ) {
                if (attendance.modTeam.includes(`<@${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                } else {
                    attendance.modTeam.push(`<@${user.id}>`);
                }
            }

            if (
                guildMember.roles.cache.some((r) => r.name === 'Mapping Team')
            ) {
                if (attendance.mapTeam.includes(`<@${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                    console.log(`${user.id} already is in attendance.`);
                } else {
                    attendance.mapTeam.push(`<@${user.id}>`);
                }
            }
            ///ROLE CHECK END

            //Write attendance data to json
            let attendanceData = JSON.stringify(attendance);
            fs.writeFileSync(`./db/${fileName}.json`, attendanceData);
        }
    } else {
        return;
    }
});

let quarterOne = new cron.CronJob('00 8 1 * *', attendanceEventStart);
let quarterTwo = new cron.CronJob('00 8 8 * *', attendanceEvent);
let quarterThree = new cron.CronJob('00 8 15 * *', attendanceEvent);
let quarterFour = new cron.CronJob('00 8 22 * *', attendanceEvent);

quarterOne.start();
quarterTwo.start();
quarterThree.start();
quarterFour.start();

client.login(process.env.DISCORD_TOKEN);
