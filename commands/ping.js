module.exports = {
    name: 'ping',
    description: 'This is a simple ping command',
    async execute(client, message, args, Discord) {
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#22AA22')
            .setTitle('Pong!')
            .setDescription(
                `🏓Latency is ${Date.now() - message.createdTimestamp} ms.`
            );

        await message.channel.send(newEmbed);
    },
};
