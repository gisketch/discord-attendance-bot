const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const cron = require('cron');
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

//Commands Startup
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach((handler) => {
    require(`./handlers/${handler}`)(client, Discord);
});

const channel = process.env.CHANNEL;
const checkEmoji = '✅';
const activeCheck = '📔';

Number.prototype.between = function (a, b) {
    var min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
    return this >= min && this < max;
};

const attendanceEvent = async () => {
    const attendanceChannel = client.channels.cache.get(channel);
    //CLEAR MSGS
    attendanceChannel.bulkDelete(99);
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
            "It's that time of the month again. React here for attendance!\n\nReact with ✅ to be register your attendance.\nReact with 📔 if you're a Lead or Team Manager to get a summary of your members' activity.\n"
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
        .setTimestamp()
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
    messageEmbed.react(activeCheck);
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
                if (attendance.artTeam.includes(`<@!${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                } else {
                    attendance.artTeam.push(`<@!${user.id}>`);
                }
            }

            if (
                guildMember.roles.cache.some(
                    (r) => r.name === 'Development Team'
                )
            ) {
                if (attendance.devTeam.includes(`<@!${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                } else {
                    attendance.devTeam.push(`<@!${user.id}>`);
                }
            }

            if (
                guildMember.roles.cache.some((r) => r.name === 'Testing Team')
            ) {
                if (attendance.testTeam.includes(`<@!${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                } else {
                    attendance.testTeam.push(`<@!${user.id}>`);
                }
            }

            if (
                guildMember.roles.cache.some(
                    (r) => r.name === 'Management Team'
                )
            ) {
                if (attendance.modTeam.includes(`<@!${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                } else {
                    attendance.modTeam.push(`<@!${user.id}>`);
                }
            }

            if (
                guildMember.roles.cache.some((r) => r.name === 'Mapping Team')
            ) {
                if (attendance.mapTeam.includes(`<@!${user.id}>`)) {
                    await user.send(
                        `You have already checked in for quarter ${quarter} of month ${
                            today.getMonth() + 1
                        }.`
                    );
                    console.log(`${user.id} already is in attendance.`);
                } else {
                    attendance.mapTeam.push(`<@!${user.id}>`);
                }
            }
            ///ROLE CHECK END

            //Write attendance data to json
            let attendanceData = JSON.stringify(attendance);
            fs.writeFileSync(`./db/${fileName}.json`, attendanceData);
        } else if (reaction.emoji.name === activeCheck) {
            //////////////////////////////////////////////
            /////////// 📔 - EMOJI CHECK - 📔 ////////////
            //////////////////////////////////////////////

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
            //Read json
            let attendance = {};
            const fileName = `${
                today.getMonth() + 1
            }-${quarter}-${today.getFullYear()}-ActivityData`;
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

            //Join each users for fields
            const artTeam =
                attendance.artTeam.length === 0
                    ? `None`
                    : attendance.artTeam.join('\n');
            const devTeam =
                attendance.devTeam.length === 0
                    ? `None`
                    : attendance.devTeam.join('\n');
            const testTeam =
                attendance.testTeam.length === 0
                    ? `None`
                    : attendance.testTeam.join('\n');
            const mapTeam =
                attendance.mapTeam.length === 0
                    ? `None`
                    : attendance.mapTeam.join('\n');
            const modTeam =
                attendance.modTeam.length === 0
                    ? `None`
                    : attendance.modTeam.join('\n');

            ////// CHECK INACTIVE USERS /////////

            //-----------ART TEAM-------------//
            const artMembers = reaction.message.guild.roles.cache
                .find((role) => role.name === 'Art Team')
                .members.map((m) => `<@!${m.user.id}>`);

            const artInactive = attendance.artTeam
                .filter((x) => !artMembers.includes(x))
                .concat(
                    artMembers.filter((x) => !attendance.artTeam.includes(x))
                );

            const artInactiveValue =
                artInactive.length === 0 ? `None` : artInactive.join(`\n`);

            //-----------DEV TEAM-------------//
            const devMembers = reaction.message.guild.roles.cache
                .find((role) => role.name === 'Development Team')
                .members.map((m) => `<@!${m.user.id}>`);

            const devInactive = attendance.devTeam
                .filter((x) => !devMembers.includes(x))
                .concat(
                    devMembers.filter((x) => !attendance.devTeam.includes(x))
                );

            const devInactiveValue =
                devInactive.length === 0 ? `None` : devInactive.join(`\n`);

            //-----------MAP TEAM-------------//
            const mapMembers = reaction.message.guild.roles.cache
                .find((role) => role.name === 'Mapping Team')
                .members.map((m) => `<@!${m.user.id}>`);

            const mapInactive = attendance.mapTeam
                .filter((x) => !mapMembers.includes(x))
                .concat(
                    mapMembers.filter((x) => !attendance.mapTeam.includes(x))
                );

            const mapInactiveValue =
                mapInactive.length === 0 ? `None` : mapInactive.join(`\n`);

            //-----------TEST TEAM-------------//
            const testMembers = reaction.message.guild.roles.cache
                .find((role) => role.name === 'Testing Team')
                .members.map((m) => `<@!${m.user.id}>`);

            const testInactive = attendance.testTeam
                .filter((x) => !testMembers.includes(x))
                .concat(
                    testMembers.filter((x) => !attendance.testTeam.includes(x))
                );

            const testInactiveValue =
                testInactive.length === 0 ? `None` : testInactive.join(`\n`);

            //-----------MOD TEAM-------------//
            const modMembers = reaction.message.guild.roles.cache
                .find((role) => role.name === 'Management Team')
                .members.map((m) => `<@!${m.user.id}>`);

            const modInactive = attendance.modTeam
                .filter((x) => !modMembers.includes(x))
                .concat(
                    modMembers.filter((x) => !attendance.modTeam.includes(x))
                );

            const modInactiveValue =
                modInactive.length === 0 ? `None` : modInactive.join(`\n`);

            // ---- MAKING EMBEDS ------ //
            let attendanceEmbed = new Discord.MessageEmbed()
                .setColor(`#aaEEaa`)
                .setTitle(
                    `Attendance Check for ${
                        today.getMonth() + 1
                    }-${quarter}-${today.getFullYear()}!`
                )
                .setDescription(
                    `Here's this quarter of the month's users' activity 🎉`
                );

            reaction.message.reactions.cache.get(activeCheck).remove(user);
            reaction.message.react(activeCheck);

            const guildMember = reaction.message.guild.members.cache.find(
                (member) => member.id === user.id
            );

            // Role checks for the user
            if (
                guildMember.roles.cache.some(
                    (r) =>
                        r.name === 'Art Team Manager' ||
                        r.name === 'Lead Animator' ||
                        r.name === 'Lead Composer' ||
                        r.name === 'Lead 3D Artist' ||
                        r.name === 'Lead 2D Artists'
                )
            ) {
                attendanceEmbed.addFields({
                    name: 'Art Team',
                    value: `✅ Active Users: \n ${artTeam} \n\n❌Inactive Users: \n ${artInactiveValue}\n\n----------`,
                });
                await user.send(attendanceEmbed);
            }
            if (
                guildMember.roles.cache.some((r) => r.name === 'Lead Developer')
            ) {
                attendanceEmbed.addFields({
                    name: 'Development Team',
                    value: `✅ Active Users: \n ${devTeam} \n\n❌Inactive Users: \n ${devInactiveValue}\n\n----------`,
                });
                await user.send(attendanceEmbed);
            }
            if (guildMember.roles.cache.some((r) => r.name === 'Lead Tester')) {
                attendanceEmbed.addFields({
                    name: 'Testing Team',
                    value: `✅ Active Users: \n ${testTeam} \n\n❌Inactive Users: \n ${testInactiveValue}\n\n----------`,
                });
                await user.send(attendanceEmbed);
            }
            if (
                guildMember.roles.cache.some(
                    (r) => r.name === 'Mapping Manager'
                )
            ) {
                attendanceEmbed.addFields({
                    name: 'Mapping Team',
                    value: `✅ Active Users: \n ${mapTeam} \n\n❌Inactive Users: \n ${mapInactiveValue}\n\n----------`,
                });
                await user.send(attendanceEmbed);
            }
            if (
                guildMember.roles.cache.some((r) => r.name === 'Head Moderator')
            ) {
                attendanceEmbed.addFields({
                    name: 'Management Team',
                    value: `✅ Active Users: \n ${modTeam} \n\n❌Inactive Users: \n ${modInactiveValue}\n\n----------`,
                });
                await user.send(attendanceEmbed);
            }
        }
    } else {
        return;
    }
});

let quarterOne = new cron.CronJob('00 8 1 * *', attendanceEvent);
let quarterTwo = new cron.CronJob('00 8 8 * *', attendanceEvent);
let quarterThree = new cron.CronJob('00 8 15 * *', attendanceEvent);
let quarterFour = new cron.CronJob('00 8 22 * *', attendanceEvent);

quarterOne.start();
quarterTwo.start();
quarterThree.start();
quarterFour.start();

client.login(process.env.DISCORD_TOKEN);
