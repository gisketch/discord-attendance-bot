const fs = require('fs');

module.exports = {
    name: 'data',
    description: 'Check data files',
    async execute(client, message, args, Discord) {
        try {
            let files = fs.readdirSync(`./db/`);
            let embed = new Discord.MessageEmbed()
                .setTitle('Data check!')
                .setColor('#AAEEAA')
                .setDescription('Here are the available data to check.')
                .addFields({ name: 'Data', value: files.join('\n') });
            await message.channel.send(embed);
        } catch (err) {
            console.log(err);
        }
    },
};
