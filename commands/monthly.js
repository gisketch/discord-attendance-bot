const fs = require('fs');

module.exports = {
    name: 'check',
    aliases: ['c'],
    description: 'Check monthly inactive users',
    async execute(client, message, args, Discord) {
        if (args[0] && args[1]) {
            let attendance = {
                artTeam: [],
                devTeam: [],
                testTeam: [],
                mapTeam: [],
                modTeam: [],
            };
            let files;
            let uniqArt;
            let uniqDev;
            let uniqTest;
            let uniqMap;
            let uniqMod;
            let monthCheck = false;
            let quarterCheck = false;
            const monthly =
                parseInt(args[0]) >= 1 &&
                parseInt(args[0]) <= 12 &&
                !args[0].includes('-');
            const quarterly = args[0].split('-').length === 2;
            if (quarterly) {
                let fileName = `${
                    args[0]
                }-${new Date().getFullYear()}-ActivityData`;
                try {
                    if (fs.existsSync(`./db/${fileName}.json`)) {
                        attendance = JSON.parse(
                            fs.readFileSync(`./db/${fileName}.json`)
                        );
                        quarterCheck = true;
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
            }
            if (monthly) {
                files = fs
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
                        const data = JSON.parse(
                            fs.readFileSync(`./db/${file}`)
                        );
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
                    monthCheck = true;
                }
            }

            if (!monthly && !quarterly) {
                await message.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle('Wrong argument')
                        .setDescription(
                            'Correct usage examples:\n`a!check 3 art` or `a!check 12-2 art`'
                        )
                        .setColor('#dd3333')
                );
            }

            if ((monthly && monthCheck) || (quarterly && quarterCheck)) {
                ////// CHECK INACTIVE USERS /////////
                uniqArt = [...new Set(attendance.artTeam)];
                uniqDev = [...new Set(attendance.devTeam)];
                uniqTest = [...new Set(attendance.testTeam)];
                uniqMap = [...new Set(attendance.mapTeam)];
                uniqMod = [...new Set(attendance.modTeam)];
                //-----------ART TEAM-------------//
                const artMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Art Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const artInactive = artMembers.filter(
                    (x1) => !uniqArt.some((x2) => x2 === x1)
                );

                //-----------DEV TEAM-------------//
                const devMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Development Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const devInactive = devMembers.filter(
                    (x1) => !uniqDev.some((x2) => x2 === x1)
                );

                //-----------MAP TEAM-------------//
                const mapMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Mapping Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const mapInactive = mapMembers.filter(
                    (x1) => !uniqMap.some((x2) => x2 === x1)
                );

                //-----------TEST TEAM-------------//
                const testMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Testing Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const testInactive = testMembers.filter(
                    (x1) => !uniqTest.some((x2) => x2 === x1)
                );

                //-----------MOD TEAM-------------//
                const modMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Management Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const modInactive = modMembers.filter(
                    (x1) => !uniqMod.some((x2) => x2 === x1)
                );

                // ---- MAKING EMBEDS ------ //
                let attendanceEmbed = new Discord.MessageEmbed()
                    .setColor(`#aaEEaa`)
                    .setTitle(
                        `Attendance Check for ${
                            args[0]
                        }-${new Date().getFullYear()}!`
                    )
                    .setDescription(`Here's this month's users' activity 🎉`);

                ///// ------- DIVIDING USERS ------ ////
                const n = 15; //tweak this to add more items per line
                /////-------ART----------/////
                let artPage = 1;
                let artMaxPage = 1;

                const artActiveLength = uniqArt.length;
                const artInactiveLength = artInactive.length;

                const artResult = new Array(Math.ceil(uniqArt.length / n))
                    .fill()
                    .map((_) => uniqArt.splice(0, n));

                const iArtResult = new Array(Math.ceil(artInactive.length / n))
                    .fill()
                    .map((_) => artInactive.splice(0, n));

                if (artResult.length === 0) {
                    artMaxPage = iArtResult.length;
                } else if (iArtResult.length === 0) {
                    artMaxPage = artResult.length;
                } else if (artResult.length > iArtResult.length) {
                    artMaxPage = artResult.length;
                } else if (iArtResult.length > artResult.length) {
                    artMaxPage = iArtResult.length;
                } else if (artResult.length === iArtResult.length) {
                    artMaxPage = artResult.length;
                }
                /////-------DEV----------/////
                let devPage = 1;
                let devMaxPage = 1;

                const devActiveLength = uniqDev.length;
                const devInactiveLength = devInactive.length;

                const devResult = new Array(Math.ceil(uniqDev.length / n))
                    .fill()
                    .map((_) => uniqDev.splice(0, n));

                const iDevResult = new Array(Math.ceil(devInactive.length / n))
                    .fill()
                    .map((_) => devInactive.splice(0, n));

                if (devResult.length === 0) {
                    devMaxPage = iDevResult.length;
                } else if (iDevResult.length === 0) {
                    devMaxPage = devResult.length;
                } else if (devResult.length > iDevResult.length) {
                    devMaxPage = devResult.length;
                } else if (iDevResult.length > devResult.length) {
                    devMaxPage = iDevResult.length;
                } else if (devResult.length === iDevResult.length) {
                    devMaxPage = devResult.length;
                }
                /////-------TEST----------/////
                let testPage = 1;
                let testMaxPage = 1;

                const testActiveLength = uniqTest.length;
                const testInactiveLength = testInactive.length;

                const testResult = new Array(Math.ceil(uniqTest.length / n))
                    .fill()
                    .map((_) => uniqTest.splice(0, n));

                const iTestResult = new Array(
                    Math.ceil(testInactive.length / n)
                )
                    .fill()
                    .map((_) => testInactive.splice(0, n));

                if (testResult.length === 0) {
                    testMaxPage = iTestResult.length;
                } else if (iTestResult.length === 0) {
                    testMaxPage = testResult.length;
                } else if (testResult.length > iTestResult.length) {
                    testMaxPage = testResult.length;
                } else if (iTestResult.length > testResult.length) {
                    testMaxPage = iTestResult.length;
                } else if (testResult.length === iTestResult.length) {
                    testMaxPage = testResult.length;
                }

                /////--------MAP---------/////
                let mapPage = 1;
                let mapMaxPage = 1;

                const mapActiveLength = uniqMap.length;
                const mapInactiveLength = mapInactive.length;

                const mapResult = new Array(Math.ceil(uniqMap.length / n))
                    .fill()
                    .map((_) => uniqMap.splice(0, n));

                const iMapResult = new Array(Math.ceil(mapInactive.length / n))
                    .fill()
                    .map((_) => mapInactive.splice(0, n));

                if (mapResult.length === 0) {
                    mapMaxPage = iMapResult.length;
                } else if (iMapResult.length === 0) {
                    mapMaxPage = mapResult.length;
                } else if (mapResult.length > iMapResult.length) {
                    mapMaxPage = mapResult.length;
                } else if (iMapResult.length > mapResult.length) {
                    mapMaxPage = iMapResult.length;
                } else if (mapResult.length === iMapResult.length) {
                    mapMaxPage = mapResult.length;
                }

                /////-------MOD----------/////
                let modPage = 1;
                let modMaxPage = 1;

                const modActiveLength = uniqMod.length;
                const modInactiveLength = modInactive.length;

                const modResult = new Array(Math.ceil(uniqMod.length / n))
                    .fill()
                    .map((_) => uniqMod.splice(0, n));

                const iModResult = new Array(Math.ceil(modInactive.length / n))
                    .fill()
                    .map((_) => modInactive.splice(0, n));

                if (modResult.length === 0) {
                    modMaxPage = iModResult.length;
                } else if (iModResult.length === 0) {
                    modMaxPage = modResult.length;
                } else if (modResult.length > iModResult.length) {
                    modMaxPage = modResult.length;
                } else if (iModResult.length > modResult.length) {
                    modMaxPage = iModResult.length;
                } else if (modResult.length === iModResult.length) {
                    modMaxPage = modResult.length;
                }

                ////////////////////////////////

                // Role checks for the user
                if (args[1] === 'art') {
                    if (args[2]) {
                        let filter = '';
                        if (artResult[artPage - 1] !== undefined) {
                            artResult[artPage - 1] = artResult[
                                artPage - 1
                            ].map((r) => r.replace(/\D/g, ''));
                        }
                        if (args[2] === '2d') {
                            filter = '2D Artist';
                        }

                        artResult[artPage - 1] = artResult[
                            artpage - 1
                        ].filter((e) =>
                            e.includes(
                                message.guild.roles.cache
                                    .find((r) => r.name === filter)
                                    .members.map((m) => m.user.id)
                            )
                        );

                        console.log(artResult[artPage - 1]);

                        // message.guild.roles.cache
                        // .find((role) => role.name === filter)
                        // .members.map((m) => `<@${m.user.id}>`);
                    }

                    attendanceEmbed
                        .setTitle(
                            `Art Team Attendance Check for ${args[0]}-2021`
                        )
                        .addFields({
                            name: `✅ Active Users (${artActiveLength})`,
                            value: `${
                                artResult[artPage - 1] === undefined
                                    ? 'None'
                                    : artResult[artPage - 1].join(`\n`)
                            } \n\n`,
                        })
                        .addFields({
                            name: `❌Inactive Users (${artInactiveLength})`,
                            value: `\n ${
                                iArtResult[artPage - 1] === undefined
                                    ? 'None'
                                    : iArtResult[artPage - 1].join(`\n`)
                            }\n`,
                        })
                        .setFooter(`Page ${artPage} of ${artMaxPage}`);
                    let artEmbed = await message.channel.send(attendanceEmbed);
                    if (artPage < artMaxPage) {
                        artEmbed.react('⏭');
                    }
                    artEmbed.react('✅');

                    client.on('messageReactionAdd', async (reaction, user) => {
                        if (user.bot) return;
                        if (!reaction.message.guild) return;
                        if (
                            reaction.emoji.name === '⏭' &&
                            reaction.message === artEmbed
                        ) {
                            artPage++;
                            reaction.message.reactions.cache
                                .get('⏭')
                                .users.remove(user.id);

                            if (artPage > 1) {
                                artEmbed.react('⏮');
                            }
                            if (artPage < artMaxPage) {
                                artEmbed.react('⏭');
                            }
                            if (artPage == artMaxPage) {
                                reaction.message.reactions.cache
                                    .get('⏭')
                                    .remove(user.id);
                            }
                            if (artPage > artMaxPage) {
                                artPage = artMaxPage;
                            }
                            attendanceEmbed.fields = [];
                            await artEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${artActiveLength})`,
                                        value: `${
                                            artResult[artPage - 1] === undefined
                                                ? 'None'
                                                : artResult[artPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${artInactiveLength})`,
                                        value: `\n ${
                                            iArtResult[artPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iArtResult[artPage - 1].join(
                                                      `\n`
                                                  )
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Art Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${artPage} of ${artMaxPage}`
                                    )
                            );
                        }

                        if (
                            reaction.emoji.name === '⏮' &&
                            reaction.message === artEmbed
                        ) {
                            artPage--;
                            reaction.message.reactions.cache
                                .get('⏮')
                                .users.remove(user.id);

                            if (artPage > 1) {
                                artEmbed.react('⏮');
                            }
                            if (artPage < artMaxPage) {
                                artEmbed.react('⏭');
                            }
                            if (artPage == 1) {
                                reaction.message.reactions.cache
                                    .get('⏮')
                                    .remove(user.id);
                            }
                            if (artPage < 1) {
                                artPage == 1;
                            }
                            attendanceEmbed.fields = [];
                            await artEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${artActiveLength})`,
                                        value: `${
                                            artResult[artPage - 1] === undefined
                                                ? 'None'
                                                : artResult[artPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${artInactiveLength})`,
                                        value: `\n ${
                                            iArtResult[artPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iArtResult[artPage - 1].join(
                                                      `\n`
                                                  )
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Art Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${artPage} of ${artMaxPage}`
                                    )
                            );
                        }
                        if (
                            reaction.emoji.name === '✅' &&
                            reaction.message === artEmbed
                        ) {
                            artEmbed.delete();
                        }
                    });
                } else if (args[1] === 'dev') {
                    attendanceEmbed
                        .setTitle(
                            `Dev Team Attendance Check for ${args[0]}-2021`
                        )
                        .addFields({
                            name: `✅ Active Users (${devActiveLength})`,
                            value: `${
                                devResult[devPage - 1] === undefined
                                    ? 'None'
                                    : devResult[devPage - 1].join(`\n`)
                            } \n\n`,
                        })
                        .addFields({
                            name: `❌Inactive Users (${devInactiveLength})`,
                            value: `\n ${
                                iDevResult[devPage - 1] === undefined
                                    ? 'None'
                                    : iDevResult[devPage - 1].join(`\n`)
                            }\n`,
                        })
                        .setFooter(`Page ${devPage} of ${devMaxPage}`);
                    let devEmbed = await message.channel.send(attendanceEmbed);
                    if (devPage < devMaxPage) {
                        devEmbed.react('⏭');
                    }
                    devEmbed.react('✅');

                    client.on('messageReactionAdd', async (reaction, user) => {
                        if (user.bot) return;
                        if (!reaction.message.guild) return;
                        if (
                            reaction.emoji.name === '⏭' &&
                            reaction.message === devEmbed
                        ) {
                            devPage++;
                            reaction.message.reactions.cache
                                .get('⏭')
                                .users.remove(user.id);

                            if (devPage > 1) {
                                devEmbed.react('⏮');
                            }
                            if (devPage < devMaxPage) {
                                devEmbed.react('⏭');
                            }
                            if (devPage == devMaxPage) {
                                reaction.message.reactions.cache
                                    .get('⏭')
                                    .remove(user.id);
                            }
                            if (devPage > devMaxPage) {
                                devPage = devMaxPage;
                            }
                            attendanceEmbed.fields = [];
                            await devEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${devActiveLength})`,
                                        value: `${
                                            devResult[devPage - 1] === undefined
                                                ? 'None'
                                                : devResult[devPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${devInactiveLength})`,
                                        value: `\n ${
                                            iDevResult[devPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iDevResult[devPage - 1].join(
                                                      `\n`
                                                  )
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Dev Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${devPage} of ${devMaxPage}`
                                    )
                            );
                        }

                        if (
                            reaction.emoji.name === '⏮' &&
                            reaction.message === devEmbed
                        ) {
                            devPage--;
                            reaction.message.reactions.cache
                                .get('⏮')
                                .users.remove(user.id);

                            if (devPage > 1) {
                                devEmbed.react('⏮');
                            }
                            if (devPage < devMaxPage) {
                                devEmbed.react('⏭');
                            }
                            if (devPage == 1) {
                                reaction.message.reactions.cache
                                    .get('⏮')
                                    .remove(user.id);
                            }
                            if (devPage < 1) {
                                devPage == 1;
                            }
                            attendanceEmbed.fields = [];
                            await devEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${devActiveLength})`,
                                        value: `${
                                            devResult[devPage - 1] === undefined
                                                ? 'None'
                                                : devResult[devPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${devInactiveLength})`,
                                        value: `\n ${
                                            iDevResult[devPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iDevResult[devPage - 1].join(
                                                      `\n`
                                                  )
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Dev Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${devPage} of ${devMaxPage}`
                                    )
                            );
                        }
                        if (
                            reaction.emoji.name === '✅' &&
                            reaction.message === devEmbed
                        ) {
                            devEmbed.delete();
                        }
                    });
                } else if (args[1] === 'test') {
                    attendanceEmbed
                        .setTitle(
                            `Testing Team Attendance Check for ${args[0]}-2021`
                        )
                        .addFields({
                            name: `✅ Active Users (${testActiveLength})`,
                            value: `${
                                testResult[testPage - 1] === undefined
                                    ? 'None'
                                    : testResult[testPage - 1].join(`\n`)
                            } \n\n`,
                        })
                        .addFields({
                            name: `❌Inactive Users (${testInactiveLength})`,
                            value: `\n ${
                                iTestResult[testPage - 1] === undefined
                                    ? 'None'
                                    : iTestResult[testPage - 1].join(`\n`)
                            }\n`,
                        })
                        .setFooter(`Page ${testPage} of ${testMaxPage}`);
                    let testEmbed = await message.channel.send(attendanceEmbed);
                    if (testPage < testMaxPage) {
                        testEmbed.react('⏭');
                    }
                    testEmbed.react('✅');

                    client.on('messageReactionAdd', async (reaction, user) => {
                        if (user.bot) return;
                        if (!reaction.message.guild) return;
                        if (
                            reaction.emoji.name === '⏭' &&
                            reaction.message === testEmbed
                        ) {
                            testPage++;
                            reaction.message.reactions.cache
                                .get('⏭')
                                .users.remove(user.id);

                            if (testPage > 1) {
                                testEmbed.react('⏮');
                            }
                            if (testPage < testMaxPage) {
                                testEmbed.react('⏭');
                            }
                            if (testPage == testMaxPage) {
                                reaction.message.reactions.cache
                                    .get('⏭')
                                    .remove(user.id);
                            }
                            if (testPage > testMaxPage) {
                                testPage = testMaxPage;
                            }
                            attendanceEmbed.fields = [];
                            await testEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${testActiveLength})`,
                                        value: `${
                                            testResult[testPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : testResult[testPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${testInactiveLength})`,
                                        value: `\n ${
                                            iTestResult[testPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iTestResult[
                                                      testPage - 1
                                                  ].join(`\n`)
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Testing Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${testPage} of ${testMaxPage}`
                                    )
                            );
                        }

                        if (
                            reaction.emoji.name === '⏮' &&
                            reaction.message === testEmbed
                        ) {
                            testPage--;
                            reaction.message.reactions.cache
                                .get('⏮')
                                .users.remove(user.id);

                            if (testPage > 1) {
                                testEmbed.react('⏮');
                            }
                            if (testPage < testMaxPage) {
                                testEmbed.react('⏭');
                            }
                            if (testPage == 1) {
                                reaction.message.reactions.cache
                                    .get('⏮')
                                    .remove(user.id);
                            }
                            if (testPage < 1) {
                                testPage == 1;
                            }
                            attendanceEmbed.fields = [];
                            await testEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${testActiveLength})`,
                                        value: `${
                                            testResult[testPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : testResult[testPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${testInactiveLength})`,
                                        value: `\n ${
                                            iTestResult[testPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iTestResult[
                                                      testPage - 1
                                                  ].join(`\n`)
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Testing Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${testPage} of ${testMaxPage}`
                                    )
                            );
                        }
                        if (
                            reaction.emoji.name === '✅' &&
                            reaction.message === testEmbed
                        ) {
                            testEmbed.delete();
                        }
                    });
                } else if (args[1] === 'map') {
                    attendanceEmbed
                        .setTitle(
                            `Mapping Team Attendance Check for ${args[0]}-2021`
                        )
                        .addFields({
                            name: `✅ Active Users (${mapActiveLength})`,
                            value: `${
                                mapResult[mapPage - 1] === undefined
                                    ? 'None'
                                    : mapResult[mapPage - 1].join(`\n`)
                            } \n\n`,
                        })
                        .addFields({
                            name: `❌Inactive Users (${mapInactiveLength})`,
                            value: `\n ${
                                iMapResult[mapPage - 1] === undefined
                                    ? 'None'
                                    : iMapResult[mapPage - 1].join(`\n`)
                            }\n`,
                        })
                        .setFooter(`Page ${mapPage} of ${mapMaxPage}`);
                    let mapEmbed = await message.channel.send(attendanceEmbed);
                    if (mapPage < mapMaxPage) {
                        mapEmbed.react('⏭');
                    }
                    mapEmbed.react('✅');

                    client.on('messageReactionAdd', async (reaction, user) => {
                        if (user.bot) return;
                        if (!reaction.message.guild) return;
                        if (
                            reaction.emoji.name === '⏭' &&
                            reaction.message === mapEmbed
                        ) {
                            mapPage++;
                            reaction.message.reactions.cache
                                .get('⏭')
                                .users.remove(user.id);

                            if (mapPage > 1) {
                                mapEmbed.react('⏮');
                            }
                            if (mapPage < mapMaxPage) {
                                mapEmbed.react('⏭');
                            }
                            if (mapPage == mapMaxPage) {
                                reaction.message.reactions.cache
                                    .get('⏭')
                                    .remove(user.id);
                            }
                            if (mapPage > mapMaxPage) {
                                mapPage = mapMaxPage;
                            }
                            attendanceEmbed.fields = [];
                            await mapEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${mapActiveLength})`,
                                        value: `${
                                            mapResult[mapPage - 1] === undefined
                                                ? 'None'
                                                : mapResult[mapPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${mapInactiveLength})`,
                                        value: `\n ${
                                            iMapResult[mapPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iMapResult[mapPage - 1].join(
                                                      `\n`
                                                  )
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Mapping Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${mapPage} of ${mapMaxPage}`
                                    )
                            );
                        }

                        if (
                            reaction.emoji.name === '⏮' &&
                            reaction.message === mapEmbed
                        ) {
                            mapPage--;
                            reaction.message.reactions.cache
                                .get('⏮')
                                .users.remove(user.id);

                            if (mapPage > 1) {
                                mapEmbed.react('⏮');
                            }
                            if (mapPage < mapMaxPage) {
                                mapEmbed.react('⏭');
                            }
                            if (mapPage == 1) {
                                reaction.message.reactions.cache
                                    .get('⏮')
                                    .remove(user.id);
                            }
                            if (mapPage < 1) {
                                mapPage == 1;
                            }
                            attendanceEmbed.fields = [];
                            await mapEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${mapActiveLength})`,
                                        value: `${
                                            mapResult[mapPage - 1] === undefined
                                                ? 'None'
                                                : mapResult[mapPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${mapInactiveLength})`,
                                        value: `\n ${
                                            iMapResult[mapPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iMapResult[mapPage - 1].join(
                                                      `\n`
                                                  )
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Mapping Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${mapPage} of ${mapMaxPage}`
                                    )
                            );
                        }
                        if (
                            reaction.emoji.name === '✅' &&
                            reaction.message === mapEmbed
                        ) {
                            mapEmbed.delete();
                        }
                    });
                } else if (args[1] === 'mod') {
                    attendanceEmbed
                        .setTitle(
                            `Management Team Attendance Check for ${args[0]}-2021`
                        )
                        .addFields({
                            name: `✅ Active Users (${modActiveLength})`,
                            value: `${
                                modResult[modPage - 1] === undefined
                                    ? 'None'
                                    : modResult[modPage - 1].join(`\n`)
                            } \n\n`,
                        })
                        .addFields({
                            name: `❌Inactive Users (${modInactiveLength})`,
                            value: `\n ${
                                iModResult[modPage - 1] === undefined
                                    ? 'None'
                                    : iModResult[modPage - 1].join(`\n`)
                            }\n`,
                        })
                        .setFooter(`Page ${modPage} of ${modMaxPage}`);
                    let modEmbed = await message.channel.send(attendanceEmbed);
                    if (modPage < modMaxPage) {
                        modEmbed.react('⏭');
                    }
                    modEmbed.react('✅');

                    client.on('messageReactionAdd', async (reaction, user) => {
                        if (user.bot) return;
                        if (!reaction.message.guild) return;
                        if (
                            reaction.emoji.name === '⏭' &&
                            reaction.message === modEmbed
                        ) {
                            modPage++;
                            reaction.message.reactions.cache
                                .get('⏭')
                                .users.remove(user.id);

                            if (modPage > 1) {
                                modEmbed.react('⏮');
                            }
                            if (modPage < modMaxPage) {
                                modEmbed.react('⏭');
                            }
                            if (modPage == modMaxPage) {
                                reaction.message.reactions.cache
                                    .get('⏭')
                                    .remove(user.id);
                            }
                            if (modPage > modMaxPage) {
                                modPage = modMaxPage;
                            }
                            attendanceEmbed.fields = [];
                            await modEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${modActiveLength})`,
                                        value: `${
                                            modResult[modPage - 1] === undefined
                                                ? 'None'
                                                : modResult[modPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${modInactiveLength})`,
                                        value: `\n ${
                                            iModResult[modPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iModResult[modPage - 1].join(
                                                      `\n`
                                                  )
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Management Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${modPage} of ${modMaxPage}`
                                    )
                            );
                        }

                        if (
                            reaction.emoji.name === '⏮' &&
                            reaction.message === modEmbed
                        ) {
                            modPage--;
                            reaction.message.reactions.cache
                                .get('⏮')
                                .users.remove(user.id);

                            if (modPage > 1) {
                                modEmbed.react('⏮');
                            }
                            if (modPage < modMaxPage) {
                                modEmbed.react('⏭');
                            }
                            if (modPage == 1) {
                                reaction.message.reactions.cache
                                    .get('⏮')
                                    .remove(user.id);
                            }
                            if (modPage < 1) {
                                modPage == 1;
                            }
                            attendanceEmbed.fields = [];
                            await modEmbed.edit(
                                attendanceEmbed
                                    .addFields({
                                        name: `✅ Active Users (${modActiveLength})`,
                                        value: `${
                                            modResult[modPage - 1] === undefined
                                                ? 'None'
                                                : modResult[modPage - 1].join(
                                                      `\n`
                                                  )
                                        } \n\n`,
                                    })
                                    .addFields({
                                        name: `❌Inactive Users (${modInactiveLength})`,
                                        value: `\n ${
                                            iModResult[modPage - 1] ===
                                            undefined
                                                ? 'None'
                                                : iModResult[modPage - 1].join(
                                                      `\n`
                                                  )
                                        }\n`,
                                    })
                                    .setTitle(
                                        `Management Team Attendance Check for ${args[0]}-2021`
                                    )
                                    .setFooter(
                                        `Page ${modPage} of ${modMaxPage}`
                                    )
                            );
                        }
                        if (
                            reaction.emoji.name === '✅' &&
                            reaction.message === modEmbed
                        ) {
                            modEmbed.delete();
                        }
                    });
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
                    'Wrong use of command. Use `a!check` `month or month-quarter` `team`'
                )
                .setFooter('AoTTG 2 - Attendance Checker')
                .setColor('#DD2222');
            await message.channel.send(errorEmbed);
        }
    },
};
