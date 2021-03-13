const fs = require('fs');
require('dotenv').config();

module.exports = {
    name: 'attendance',
    description: 'This is the attendance command',
    async execute(client, message, args, Discord) {
        try {
            const channel = process.env.CHANNEL;
            const attendanceChannel = client.channels.cache.get(channel);
            const checkEmoji = '✅';
            const activeCheck = '📔';
            //CLEAR MSGS
            attendanceChannel.bulkDelete(1);
            /////////
            let today = new Date();
            let quarter;
            Number.prototype.between = function (a, b) {
                var min = Math.min.apply(Math, [a, b]),
                    max = Math.max.apply(Math, [a, b]);
                return this >= min && this < max;
            };

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
                    "It's that time of the month again. React here for attendance!\n\nReact with ✅ to register your attendance.\nReact with 📔 if you're a Lead or Team Manager to get a summary of your members' activity.\n"
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
                .setFooter(
                    'Source code: github.com/gisketch/discord-attendance-bot'
                )
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
        } catch (err) {
            await message.channel.send(
                new Discord.MessageEmbed()
                    .setColor('#AA2222')
                    .setTitle('SYSTEM ERROR!')
                    .setDescription(`${err}`)
                    .setFooter(
                        'Monke Monke Monke Monke Monke Monke Monke Monke Monke Monke Monke Monke Monke '
                    )
            );
        }
    },
};
