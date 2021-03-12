const fs = require('fs');

module.exports = {
    name: 'monthly',
    description: 'Check monthly inactive users',
    async execute(client, message, args, Discord) {
        if (args[0] && args[1]) {
            let month = args[0];
            let attendance = {
                artTeam: [],
                devTeam: [],
                testTeam: [],
                mapTeam: [],
                modTeam: [],
            };
            let files = fs
                .readdirSync(`./db/`)
                .filter((file) => file.startsWith(args[0]))
                .filter((file) =>
                    file.endsWith(
                        `${new Date().getFullYear()}-ActivityData.json`
                    )
                );

            if (files.length === 0) {
                let errorEmbed = new Discord.MessageEmbed()
                    .setTitle('Error')
                    .setDescription(
                        `No data found for month ${args[0]}, check with a!data.`
                    )
                    .setFooter('AoTTG 2 - Attendance Checker')
                    .setColor('#DD2222');
                await message.channel.send(errorEmbed);
            } else {
                files.forEach((file) => {
                    const data = JSON.parse(fs.readFileSync(`./db/${file}`));
                    attendance.artTeam = attendance.artTeam.concat(
                        data.artTeam
                    );
                    attendance.devTeam = attendance.devTeam.concat(
                        data.devTeam
                    );
                    attendance.testTeam = attendance.testTeam.concat(
                        data.testTeam
                    );
                    attendance.mapTeam = attendance.mapTeam.concat(
                        data.mapTeam
                    );
                    attendance.modTeam = attendance.modTeam.concat(
                        data.modTeam
                    );
                });

                uniqArt = [...new Set(attendance.artTeam)];
                uniqDev = [...new Set(attendance.devTeam)];
                uniqTest = [...new Set(attendance.testTeam)];
                uniqMap = [...new Set(attendance.mapTeam)];
                uniqMod = [...new Set(attendance.modTeam)];
                //Join each users for fields
                const artTeam =
                    uniqArt.length === 0 ? `None` : uniqArt.join('\n');
                const devTeam =
                    uniqDev.length === 0 ? `None` : uniqDev.join('\n');
                const testTeam =
                    uniqTest.length === 0 ? `None` : uniqTest.join('\n');
                const mapTeam =
                    uniqMap.length === 0 ? `None` : uniqMap.join('\n');
                const modTeam =
                    uniqMod.length === 0 ? `None` : uniqMod.join('\n');

                ////// CHECK INACTIVE USERS /////////

                //-----------ART TEAM-------------//
                const artMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Art Team')
                    .members.map((m) => `<@!${m.user.id}>`);

                const artInactive = uniqArt
                    .filter((x) => !artMembers.includes(x))
                    .concat(artMembers.filter((x) => !uniqArt.includes(x)));

                const artInactiveValue =
                    artInactive.length === 0 ? `None` : artInactive.join(`\n`);

                //-----------DEV TEAM-------------//
                const devMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Development Team')
                    .members.map((m) => `<@!${m.user.id}>`);

                const devInactive = uniqDev
                    .filter((x) => !devMembers.includes(x))
                    .concat(devMembers.filter((x) => !uniqDev.includes(x)));

                const devInactiveValue =
                    devInactive.length === 0 ? `None` : devInactive.join(`\n`);

                //-----------MAP TEAM-------------//
                const mapMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Mapping Team')
                    .members.map((m) => `<@!${m.user.id}>`);

                const mapInactive = uniqMap
                    .filter((x) => !mapMembers.includes(x))
                    .concat(mapMembers.filter((x) => !uniqMap.includes(x)));

                const mapInactiveValue =
                    mapInactive.length === 0 ? `None` : mapInactive.join(`\n`);

                //-----------TEST TEAM-------------//
                const testMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Testing Team')
                    .members.map((m) => `<@!${m.user.id}>`);

                const testInactive = uniqTest
                    .filter((x) => !testMembers.includes(x))
                    .concat(testMembers.filter((x) => !uniqTest.includes(x)));

                const testInactiveValue =
                    testInactive.length === 0
                        ? `None`
                        : testInactive.join(`\n`);

                //-----------MOD TEAM-------------//
                const modMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Management Team')
                    .members.map((m) => `<@!${m.user.id}>`);

                const modInactive = uniqMod
                    .filter((x) => !modMembers.includes(x))
                    .concat(modMembers.filter((x) => !uniqMod.includes(x)));

                const modInactiveValue =
                    modInactive.length === 0 ? `None` : modInactive.join(`\n`);

                // ---- MAKING EMBEDS ------ //
                let attendanceEmbed = new Discord.MessageEmbed()
                    .setColor(`#aaEEaa`)
                    .setTitle(
                        `Attendance Check for ${
                            args[0]
                        }-${new Date().getFullYear()}!`
                    )
                    .setDescription(
                        `Here's this quarter of the month's users' activity 🎉`
                    );

                // Role checks for the user
                if (args[1] === 'art') {
                    attendanceEmbed.addFields({
                        name: 'Art Team',
                        value: `❌Inactive Users: \n ${artInactiveValue}\n\n----------`,
                    });
                    await message.channel.send(attendanceEmbed);
                } else if (args[1] === 'dev') {
                    attendanceEmbed.addFields({
                        name: 'Development Team',
                        value: `❌Inactive Users: \n ${devInactiveValue}\n\n----------`,
                    });
                    await message.channel.send(attendanceEmbed);
                } else if (args[1] === 'test') {
                    attendanceEmbed.addFields({
                        name: 'Testing Team',
                        value: `❌Inactive Users: \n ${testInactiveValue}\n\n----------`,
                    });
                    await message.channel.send(attendanceEmbed);
                } else if (args[1] === 'map') {
                    attendanceEmbed.addFields({
                        name: 'Mapping Team',
                        value: `❌Inactive Users: \n ${mapInactiveValue}\n\n----------`,
                    });
                    await message.channel.send(attendanceEmbed);
                } else if (args[1] === 'mod') {
                    attendanceEmbed.addFields({
                        name: 'Management Team',
                        value: `❌Inactive Users: \n ${modInactiveValue}\n\n----------`,
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
            }
        } else {
            let errorEmbed = new Discord.MessageEmbed()
                .setTitle('Error')
                .setDescription(
                    'Wrong use of command. Use `a!monthly` `month(int)` `team`'
                )
                .setFooter('AoTTG 2 - Attendance Checker')
                .setColor('#DD2222');
            await message.channel.send(errorEmbed);
        }
    },
};
