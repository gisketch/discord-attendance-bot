module.exports = {
    name: 'help',
    description: 'command help',
    async execute(client, message, args, Discord) {
        let helpEmbed = new Discord.MessageEmbed()
            .setTitle('AoTTG 2 - Attendance Checker (commands)')
            .setDescription('Here are the various commands you can use!')
            .setColor('#aabbFF')
            .addFields(
                {
                    name: 'a!attendance',
                    value:
                        'Updates the attendance message in the attendance channel. Use every 1st, 8th, 15th, and 22nd day of the month whenever the bot unexpectedly crashes.',
                },
                {
                    name: 'a!data',
                    value: 'Sends the list of all the data in the database.',
                },
                {
                    name: 'a!check',
                    value:
                        "Check users' activity in the set month or quarter. \n`usage: a!check month/month-quarter team`\n`ex. a!check 9-4 dev`",
                },
                {
                    name: 'a!ping',
                    value: 'pong!',
                }
            )
            .setFooter(
                'Spaghetti source code: https://github.com/gisketch/discord-attendance-bot'
            );

        await message.channel.send(helpEmbed);
    },
};
