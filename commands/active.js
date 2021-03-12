const fs = require('fs');

module.exports = {
    name: 'active',
    description: 'Check active users',
    async execute(client, message, args, Discord) {
        if (args[0] && args[1]) {
            let fileName = `${
                args[0]
            }-${new Date().getFullYear()}-ActivityData`;
            let attendance = {};
            try {
                if (fs.existsSync(`./db/${fileName}.json`)) {
                    attendance = JSON.parse(
                        fs.readFileSync(`./db/${fileName}.json`)
                    );

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

                    // ---- MAKING EMBEDS ------ //
                    let attendanceEmbed = new Discord.MessageEmbed()
                        .setColor(`#aaEEaa`)
                        .setTitle(`Attendance Check for ${fileName}!`)
                        .setDescription(
                            `Here's this quarter of the month's users' activity 🎉`
                        );

                    // Role checks for the user
                    if (args[1] === 'art') {
                        attendanceEmbed.addFields({
                            name: 'Art Team',
                            value: `✅ Active Users: \n ${artTeam}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else if (args[1] === 'dev') {
                        attendanceEmbed.addFields({
                            name: 'Development Team',
                            value: `✅ Active Users: \n ${devTeam}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else if (args[1] === 'test') {
                        attendanceEmbed.addFields({
                            name: 'Testing Team',
                            value: `✅ Active Users: \n ${testTeam}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else if (args[1] === 'map') {
                        attendanceEmbed.addFields({
                            name: 'Mapping Team',
                            value: `✅ Active Users: \n ${mapTeam}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else if (args[1] === 'mod') {
                        attendanceEmbed.addFields({
                            name: 'Management Team',
                            value: `✅ Active Users: \n ${modTeam}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else {
                        let errorEmbed = new Discord.MessageEmbed()
                            .setTitle('Error')
                            .setDescription(
                                'Wrong Team! Here are the list of teams available for checking.'
                            )
                            .addFields({
                                name: 'Teams',
                                value: 'art\ndev\ntest\nmap\nmod',
                            })
                            .setFooter('AoTTG 2 - Attendance Checker')
                            .setColor('#DD2222');
                        await message.channel.send(errorEmbed);
                    }
                } else {
                    let files = fs.readdirSync(`./db/`);
                    let errorEmbed = new Discord.MessageEmbed()
                        .setTitle('No data found')
                        .setColor('#771111')
                        .setDescription(
                            `No file with name ${fileName}. Here are the available data to check.`
                        )
                        .addFields({ name: 'Data', value: files.join('\n') });
                    await message.channel.send(errorEmbed);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            let errorEmbed = new Discord.MessageEmbed()
                .setTitle('Error')
                .setDescription(
                    'Wrong use of command. Use `a!active` `month-quarter` `team`'
                )
                .setFooter('AoTTG 2 - Attendance Checker')
                .setColor('#DD2222');
            await message.channel.send(errorEmbed);
        }
    },
};
