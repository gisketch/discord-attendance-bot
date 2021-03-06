module.exports = async () => {
    const channel = '819556333694222366';
    const checkEmoji = '✅';
    const activeCheck = '📝';
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
            `Attendance Check for ${
                today.getMonth() + 1
            }/${today.getFullYear()}!`
        )
        .setDescription(
            "It's that time of the month again. React here for attendance!\n\nReact with 📝 if you're a Lead or Team Manager to get a summary of your members' activity\n"
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
        .setFooter('Source code: github.com/gisketch/discord-attendance-bot')
        .setTimestamp();

    let messageEmbed = await client.channels.cache
        .get('819556333694222366')
        .send(embed);
    messageEmbed.react(checkEmoji);
    messageEmbed.react(activeCheck);

    const fileName = `${
        today.getMonth() + 1
    }-${quarter}-${today.getFullYear()}-ActivityData`;

    client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;

        if (reaction.message.channel.id == channel) {
            if (reaction.emoji.name === checkEmoji) {
                let attendance = {};

                //CHECK IF ATTENDANCE EXISTS, load file if true, create new object if false
                try {
                    if (fs.existsSync(`./db/${fileName}.json`)) {
                        attendance = JSON.parse(
                            fs.readFileSync(`./db/${fileName}.json`)
                        );
                    } else {
                        attendance = {
                            artTeam: [],
                            devTeam: [],
                            mapTeam: [],
                            testTeam: [],
                            modTeam: [],
                        };
                    }
                } catch (err) {
                    console.error(err);
                }

                //Get the member instead of the user to access roles
                const guildMember = reaction.message.guild.members.cache.find(
                    (member) => member.id === user.id
                );

                // Role checks for the user
                if (
                    guildMember.roles.cache.some((r) => r.name === 'Art Team')
                ) {
                    if (attendance.artTeam.includes(`<@${user.id}>`)) {
                        console.log(`${user.id} already is in attendance.`);
                    } else {
                        attendance.artTeam.push(`<@${user.id}>`);
                    }
                }

                if (
                    guildMember.roles.cache.some(
                        (r) => r.name === 'Development Team'
                    )
                ) {
                    if (attendance.devTeam.includes(`<@${user.id}>`)) {
                        console.log(`${user.id} already is in attendance.`);
                    } else {
                        attendance.devTeam.push(`<@${user.id}>`);
                    }
                }

                if (
                    guildMember.roles.cache.some(
                        (r) => r.name === 'Testing Team'
                    )
                ) {
                    if (attendance.testTeam.includes(`<@${user.id}>`)) {
                        console.log(`${user.id} already is in attendance.`);
                    } else {
                        attendance.testTeam.push(`<@${user.id}>`);
                    }
                }

                if (
                    guildMember.roles.cache.some(
                        (r) => r.name === 'Management Team'
                    )
                ) {
                    if (attendance.modTeam.includes(`<@${user.id}>`)) {
                        console.log(`${user.id} already is in attendance.`);
                    } else {
                        attendance.modTeam.push(`<@${user.id}>`);
                    }
                }

                if (
                    guildMember.roles.cache.some(
                        (r) => r.name === 'Mapping Team'
                    )
                ) {
                    if (attendance.mapTeam.includes(`<@${user.id}>`)) {
                        console.log(`${user.id} already is in attendance.`);
                    } else {
                        attendance.mapTeam.push(`<@${user.id}>`);
                    }
                }
                ///ROLE CHECK END

                //Write attendance data to json
                let attendanceData = JSON.stringify(attendance);
                fs.writeFileSync(`./db/${fileName}.json`, attendanceData);
            }

            // Manager check users
            else if (reaction.emoji.name === activeCheck) {
                //Read json
                let attendance = {};
                try {
                    if (fs.existsSync(`./db/${fileName}.json`)) {
                        attendance = JSON.parse(
                            fs.readFileSync(`./db/${fileName}.json`)
                        );
                    } else {
                        attendance = {
                            artTeam: [],
                            devTeam: [],
                            mapTeam: [],
                            testTeam: [],
                            modTeam: [],
                        };
                    }
                } catch (err) {
                    console.error(err);
                }

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
                    .members.map((m) => `<@${m.user.id}>`);

                const artInactive = attendance.artTeam
                    .filter((x) => !artMembers.includes(x))
                    .concat(
                        artMembers.filter(
                            (x) => !attendance.artTeam.includes(x)
                        )
                    );

                const artInactiveValue =
                    artInactive.length === 0 ? `None` : artInactive.join(`\n`);

                //-----------DEV TEAM-------------//
                const devMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Development Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const devInactive = attendance.devTeam
                    .filter((x) => !devMembers.includes(x))
                    .concat(
                        devMembers.filter(
                            (x) => !attendance.devTeam.includes(x)
                        )
                    );

                const devInactiveValue =
                    devInactive.length === 0 ? `None` : devInactive.join(`\n`);

                //-----------MAP TEAM-------------//
                const mapMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Mapping Team')
                    .members.map((m) => `<@${m.user.id}>`);

                const mapInactive = attendance.mapTeam
                    .filter((x) => !mapMembers.includes(x))
                    .concat(
                        mapMembers.filter(
                            (x) => !attendance.mapTeam.includes(x)
                        )
                    );

                const mapInactiveValue =
                    mapInactive.length === 0 ? `None` : mapInactive.join(`\n`);

                //-----------TEST TEAM-------------//
                const testMembers = message.guild.roles.cache
                    .find((role) => role.name === 'Testing Team')
                    .members.map((m) => `<@${m.user.id}>`);

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
                    .members.map((m) => `<@${m.user.id}>`);

                const modInactive = attendance.modTeam
                    .filter((x) => !modMembers.includes(x))
                    .concat(
                        modMembers.filter(
                            (x) => !attendance.modTeam.includes(x)
                        )
                    );

                const modInactiveValue =
                    modInactive.length === 0 ? `None` : modInactive.join(`\n`);

                // ---- MAKING EMBEDS ------ //
                let attendanceEmbed = new Discord.MessageEmbed()
                    .setColor(`#aaEEaa`)
                    .setTitle(
                        `Attendance Check for ${
                            today.getMonth() + 1
                        }-${quarter}-${today.getFullYear()}!`
                    )
                    .setDescription(
                        `Here's this quarter of the month's users' activity 🎉`
                    );

                messageEmbed.reactions.cache.get(activeCheck).remove(user);
                messageEmbed.react(activeCheck);

                const guildMember = reaction.message.guild.members.cache.find(
                    (member) => member.id === user.id
                );

                // Role checks for the user
                if (
                    guildMember.roles.cache.some(
                        (r) =>
                            r.name === 'Art Team Manager' ||
                            r.name === 'Lead Animator' ||
                            r.name === 'Lead Composer' ||
                            r.name === 'Lead 3D Artist' ||
                            r.name === 'Lead 2D Artists'
                    )
                ) {
                    attendanceEmbed.addFields({
                        name: 'Art Team',
                        value: `✅ Active Users: \n ${artTeam} \n\n❌Inactive Users: \n ${artInactiveValue}\n\n----------`,
                    });
                    await user.send(attendanceEmbed);
                }
                if (
                    guildMember.roles.cache.some(
                        (r) => r.name === 'Lead Developer'
                    )
                ) {
                    attendanceEmbed.addFields({
                        name: 'Development Team',
                        value: `✅ Active Users: \n ${devTeam} \n\n❌Inactive Users: \n ${devInactiveValue}\n\n----------`,
                    });
                    await user.send(attendanceEmbed);
                }
                if (
                    guildMember.roles.cache.some(
                        (r) => r.name === 'Lead Tester'
                    )
                ) {
                    attendanceEmbed.addFields({
                        name: 'Testing Team',
                        value: `✅ Active Users: \n ${testTeam} \n\n❌Inactive Users: \n ${testInactiveValue}\n\n----------`,
                    });
                    await user.send(attendanceEmbed);
                }
                if (
                    guildMember.roles.cache.some(
                        (r) => r.name === 'Mapping Manager'
                    )
                ) {
                    attendanceEmbed.addFields({
                        name: 'Mapping Team',
                        value: `✅ Active Users: \n ${testTeam} \n\n❌Inactive Users: \n ${testInactiveValue}\n\n----------`,
                    });
                    await user.send(attendanceEmbed);
                }
                if (
                    guildMember.roles.cache.some(
                        (r) => r.name === 'Head Moderator'
                    )
                ) {
                    attendanceEmbed.addFields({
                        name: 'Management Team',
                        value: `✅ Active Users: \n ${modTeam} \n\n❌Inactive Users: \n ${modInactiveValue}\n\n----------`,
                    });
                    await user.send(attendanceEmbed);
                }
            }
        } else {
            return;
        }
    });
};
