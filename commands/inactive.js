const fs = require('fs');

module.exports = {
    name: 'inactive',
    description: 'Check inactive users',
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

                    /////LOGIC//////
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
                    const artMembers = message.guild.roles.cache
                        .find((role) => role.name === 'Art Team')
                        .members.map((m) => `<@!${m.user.id}>`);

                    const artInactive = attendance.artTeam
                        .filter((x) => !artMembers.includes(x))
                        .concat(
                            artMembers.filter(
                                (x) => !attendance.artTeam.includes(x)
                            )
                        );

                    const artInactiveValue =
                        artInactive.length === 0
                            ? `None`
                            : artInactive.join(`\n`);

                    //-----------DEV TEAM-------------//
                    const devMembers = message.guild.roles.cache
                        .find((role) => role.name === 'Development Team')
                        .members.map((m) => `<@!${m.user.id}>`);

                    const devInactive = attendance.devTeam
                        .filter((x) => !devMembers.includes(x))
                        .concat(
                            devMembers.filter(
                                (x) => !attendance.devTeam.includes(x)
                            )
                        );

                    const devInactiveValue =
                        devInactive.length === 0
                            ? `None`
                            : devInactive.join(`\n`);

                    //-----------MAP TEAM-------------//
                    const mapMembers = message.guild.roles.cache
                        .find((role) => role.name === 'Mapping Team')
                        .members.map((m) => `<@!${m.user.id}>`);

                    const mapInactive = attendance.mapTeam
                        .filter((x) => !mapMembers.includes(x))
                        .concat(
                            mapMembers.filter(
                                (x) => !attendance.mapTeam.includes(x)
                            )
                        );

                    const mapInactiveValue =
                        mapInactive.length === 0
                            ? `None`
                            : mapInactive.join(`\n`);

                    //-----------TEST TEAM-------------//
                    const testMembers = message.guild.roles.cache
                        .find((role) => role.name === 'Testing Team')
                        .members.map((m) => `<@!${m.user.id}>`);

                    const testInactive = attendance.testTeam
                        .filter((x) => !testMembers.includes(x))
                        .concat(
                            testMembers.filter(
                                (x) => !attendance.testTeam.includes(x)
                            )
                        );

                    const testInactiveValue =
                        testInactive.length === 0
                            ? `None`
                            : testInactive.join(`\n`);

                    //-----------MOD TEAM-------------//
                    const modMembers = message.guild.roles.cache
                        .find((role) => role.name === 'Management Team')
                        .members.map((m) => `<@!${m.user.id}>`);

                    const modInactive = attendance.modTeam
                        .filter((x) => !modMembers.includes(x))
                        .concat(
                            modMembers.filter(
                                (x) => !attendance.modTeam.includes(x)
                            )
                        );

                    const modInactiveValue =
                        modInactive.length === 0
                            ? `None`
                            : modInactive.join(`\n`);

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
                            value: `❌Inactive Users (${artInactive.length}): \n ${artInactiveValue}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else if (args[1] === 'dev') {
                        attendanceEmbed.addFields({
                            name: 'Development Team',
                            value: `❌Inactive Users (${devInactive.length}): \n ${devInactiveValue}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else if (args[1] === 'test') {
                        attendanceEmbed.addFields({
                            name: 'Testing Team',
                            value: `❌Inactive Users (${testInactive.length}): \n ${testInactiveValue}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else if (args[1] === 'map') {
                        attendanceEmbed.addFields({
                            name: 'Mapping Team',
                            value: `❌Inactive Users (${mapInactive.length}): \n ${mapInactiveValue}\n\n----------`,
                        });
                        await message.channel.send(attendanceEmbed);
                    } else if (args[1] === 'mod') {
                        attendanceEmbed.addFields({
                            name: 'Management Team',
                            value: `❌Inactive Users (${modInactive.length}): \n ${modInactiveValue}\n\n----------`,
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
                    try {
                        let files = fs.readdirSync(`./db/`);
                        let errorEmbed = new Discord.MessageEmbed()
                            .setTitle('No data found')
                            .setColor('#771111')
                            .setDescription(
                                `No file with name ${fileName}. Here are the available data to check.`
                            )
                            .addFields({
                                name: 'Data',
                                value: files.join('\n'),
                            });
                        await message.channel.send(errorEmbed);
                    } catch (err) {
                        let errorEmbed = new Discord.MessageEmbed()
                            .setTitle('No data found')
                            .setColor('#771111')
                            .setDescription(`No data.`);
                        await message.channel.send(errorEmbed);
                        console.log(err);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            let errorEmbed = new Discord.MessageEmbed()
                .setTitle('Error')
                .setDescription(
                    'Wrong use of command. Use `a!inactive` `month-quarter` `team`'
                )
                .setFooter('AoTTG 2 - Attendance Checker')
                .setColor('#DD2222');
            await message.channel.send(errorEmbed);
        }
    },
};
