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
                    name: 'a!inactive',
                    value:
                        "Check users' inactivity during a set quarter of a month. \n`usage: a!inactive month-quarter team`\n`ex. a!inactive 3-2 art`",
                },
                {
                    name: 'a!active',
                    value:
                        "Check users' activity during a set quarter of a month. \n`usage: a!active month-quarter team`\n`ex. a!active 3-2 art`",
                },
                {
                    name: 'a!monthly',
                    value:
                        "Check users' activity in the set month. \n`usage: a!monthly month team`\n`ex. a!monthly 3 dev`",
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
