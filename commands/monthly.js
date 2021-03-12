const fs = require('fs');

module.exports = {
    name: 'monthly',
    description: 'Check monthly inactive users',
    async execute(client, message, args, Discord) {
        if (args[0] && args[1]) {
            let page = 1;
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

                ////// CHECK INACTIVE USERS /////////

                //-----------ART TEAM-------------//
                const artMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Art Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const artInactive = uniqArt
                    .filter((x) => !artMembers.includes(x))
                    .concat(artMembers.filter((x) => !uniqArt.includes(x)));

                const artInactiveValue =
                    artInactive.length === 0 ? `None` : artInactive.join(`\n`);

                //-----------DEV TEAM-------------//
                const devMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Development Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const devInactive = uniqDev
                    .filter((x) => !devMembers.includes(x))
                    .concat(devMembers.filter((x) => !uniqDev.includes(x)));

                const devInactiveValue =
                    devInactive.length === 0 ? `None` : devInactive.join(`\n`);

                //-----------MAP TEAM-------------//
                const mapMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Mapping Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const mapInactive = uniqMap
                    .filter((x) => !mapMembers.includes(x))
                    .concat(mapMembers.filter((x) => !uniqMap.includes(x)));

                const mapInactiveValue =
                    mapInactive.length === 0 ? `None` : mapInactive.join(`\n`);

                //-----------TEST TEAM-------------//
                const testMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Testing Team')
                    .members.map((m) => `<@${m.user.id}>`);

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
                    .members.map((m) => `<@${m.user.id}>`);

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

                ///// ------- DIVIDING USERS ------ ////
                const n = 15; //tweak this to add more items per line
                let mapMaxPage = 1;

                const mapResult = new Array(Math.ceil(uniqMap.length / n))
                    .fill()
                    .map((_) => uniqMap.splice(0, n));

                const iMapResult = new Array(Math.ceil(mapInactive.length / n))
                    .fill()
                    .map((_) => mapInactive.splice(0, n));

                if (mapResult.length === undefined)
                    mapMaxPage = iMapResult.length + 1;
                if (iMapResult.length === undefined)
                    mapMaxPage = mapResult.length + 1;

                ////////////////////////////////

                // Role checks for the user
                if (args[1] && args[2]) {
                    if (args[1] === 'map') {
                        attendanceEmbed
                            .setTitle(
                                `Mapping Team Attendance Check for ${args[0]}-2021`
                            )
                            .addFields({
                                name: `✅ Active Users (${uniqMap.length})`,
                                value: `${
                                    mapResult[args[2] - 1] === undefined
                                        ? 'None'
                                        : mapResult[args[2] - 1].join(`\n`)
                                } \n\n`,
                            })
                            .addFields({
                                name: `❌Inactive Users (${mapInactive.length})`,
                                value: `\n ${
                                    iMapResult[args[2] - 1] === undefined
                                        ? 'None'
                                        : iMapResult[args[2] - 1].join(`\n`)
                                }\n`,
                            })
                            .setFooter(`Page ${args[2]} of ${mapMaxPage}`);
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
