const Discord = require('discord.js');
const Utils = require('./Utils');
const Dialogue = require('./Dialogue');
const Embeds = require('./Embeds');
const Emojis = require('./Emojis');
const Avatars = require('./Avatars');

const utils = Utils.utils;
const patDialogue = Dialogue.patDialogue;
const welcomeDialogue = Dialogue.welcomeDialogue;
const hatchDialogue = Dialogue.hatchDialogue;
const embeds = Embeds.generateEmbeds;
const hatchlingEmbed = Embeds.generateHatchlingEmbed;
const emojis = Emojis.emojis;
const avatars = Avatars.avatars;

const temperament = ['**Hardy**', 'Lonely', 'Adamant', 'Naughty', 'Brave', 'Bold', '**Docile**', 'Impish', 'Lax', 'Relaxed', 'Modest', 'Mild', '**Bashful**', 'Rash', 'Quiet', 'Calm', 'Gentle', 'Careful', '**Quirky**', 'Sassy', 'Timid', 'Hasty', 'Jolly', 'Naive', '**Serious**'];
const colorPrimary = ['grey', 'blue', 'red', 'green', 'purple'];
const colorSecondary = ['teal', 'aqua', 'cyan', 'white', 'light'];
const colorTertiary = ['blue', 'red', 'green', 'brown', 'royal'];

exports.commands =
{
    test: function (db, msg)
    {
        let funkyName = 'ianpesty💀';
        let chinese = '我爱你';
        db.getConnection(function (poolerr, connection)
        {
            connection.query(`INSERT INTO test VALUES ('${funkyName}', NULL)`, function (err, results)
            {
                if (err) throw err;

                console.log('inserted test thing');

                connection.query(`SELECT unicode_test FROM test WHERE unicode_test = '${funkyName}'`, function(err2, rows2)
                {
                    console.log('Any Rows?', rows2.length);
                    let parsedJSON = JSON.parse(JSON.stringify(rows2[0]));
                    let toSend = parsedJSON.unicode_test;
                    msg.channel.send(toSend);

                    connection.release();
                });
            });
        });
    },

    test2: function (db, msg)
    {
        db.getConnection(function (poolerr, connection)
        {
            connection.query(`SELECT discord_name FROM users WHERE id = 16`, function (err, rows)
            {
                if (err) throw err;
                let parsedJSON = JSON.parse(JSON.stringify(rows[0]));
                let toSend = parsedJSON.discord_name;
                msg.channel.send(toSend);

                connection.release();
            })
        })
    },

    welcome: function (member, client)
    {
        const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
        const guild = member.guild;
    
        if (!channel)
        {
            console.log('no channel');
        }
    
        let rand = utils.randomize(welcomeDialogue);
        let emoji = utils.getEmoji(welcomeDialogue[rand].emoji, client);
    
        channel.send(`${welcomeDialogue[rand].message} ${member} ${emoji}`);
    },

    help: function (msg)
    {
        msg.channel.send(Embeds.helpEmbed);
    },

    hatchlingCare: function (msg)
    {
        msg.channel.send(Embeds.hatchlingCareEmbed);
    },

    sayHi: function (msg, client)
    {
        let rand = utils.randomize(hatchDialogue);

        let emoji = utils.getEmoji(hatchDialogue[rand].emoji, client);

        if (rand == 8)
        {
            let filter = m =>
            {
                return m.channel.id == msg.channel.id;
            };

            msg.channel.send(`${hatchDialogue[rand].message} ${emoji}`)
            .then(msg.channel.awaitMessages(filter, {max: 2, time: 60000, errors: ['time']})
            .then(collected =>
                {
                    let thankfulEmoji = utils.getEmoji(emojis[11].id, client);

                    let validDeadMeats = [`🐟`, `🍖`, `🍗`, `🥩`, `🥓`, `🦐`].includes(collected.last().content);
                    
                    if (validDeadMeats)
                    {
                        console.log('meat is valid!');
                        msg.channel.send(`I am very thankful! ${thankfulEmoji}`+` ${collected.last().content}`);
                    }
                    else
                    {
                        console.log('meat NOT valid');
                    }
                }
            )
            .catch(collected =>
            {
                console.log('Nobody fed the baby.');
            }));
        }
        else
        {
            msg.channel.send(`${hatchDialogue[rand].message} ${emoji}`);
        }
    },

    patTheBaby: function (msg, client)
    {
        let rand = utils.randomize(patDialogue);
        let emoji = utils.getEmoji(emojis[14].id, client);
        msg.reply(`${patDialogue[rand].message} ${emoji}`);
    },

    showProfile: function (db, msg, userID, userName, userTag)
    {
        db.getConnection(function (poolerr, connection)
        {
            if (poolerr) throw poolerr;

            connection.query(`SELECT * FROM users WHERE discord_id = ${userID}`, function (usererr, userrows)
            {
                if (usererr) throw usererr;

                if (userrows.length > 0)
                {
                    let parsedUserInfo = JSON.parse(JSON.stringify(userrows[0]));
                    let lvl = parsedUserInfo.level;
                    let exp = parsedUserInfo.exp;

                    connection.query(`SELECT * FROM inventories WHERE discord_id = ${userID}`, function (inverr, invrows)
                    {
                        if (inverr) throw inverr;

                        let parsedInventoryInfo = JSON.parse(JSON.stringify(invrows[0]));
                        let glimmer = parsedInventoryInfo.glimmer;
                        let ether = parsedInventoryInfo.ether;

                        connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID}`, function (hatcherr, hatchrows)
                        {
                            if (hatcherr) throw hatcherr;

                            let embed = Embeds.generateProfileEmbed(msg, userName, hatchrows.length, lvl, exp, glimmer, ether, '0/0');

                            msg.channel.send(`${msg.author}`, embed);
                        });

                    });
                }
                else
                {
                    msg.reply('You are not a registered Guardian. Use the `!h adopt [name]` command to begin. Use the `!h help` command for more information.');
                }
            });

            //console.log(db._freeConnections.indexOf(connection)); // -1

            connection.release();

            //console.log(db._freeConnections.indexOf(connection)); // 0
        });
    },

    adoptHatchling: function  (db, msg, userID, userName, userTag)
    {
        db.getConnection(function (poolerror, connection)
        {
            if (poolerror) throw poolerror

            // IF NEW USER, REGISTER USER

            createNewUser(db, userID, userName, userTag);

            connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID}`, function (q1err, rows, fields)
            {
                if (q1err) throw q1err;

                const adoptionLimit = 4;

                if (rows.length < adoptionLimit)
                {
                    let dateAdopted = utils.getCurrentDate();
                    let hatchlingName = msg.content.slice(9);
                    let nameValidation = utils.nameValidation(hatchlingName);
                    let slot = rows.length + 1;

                    dateAdopted = dateAdopted.slice(0, 10);

                    if (nameValidation)
                    {
                        let randTemp = utils.randomize(temperament);
                        let randColor1 = utils.randomize(colorPrimary);
                        let randColor2 = utils.randomize(colorSecondary);
                        let randColor3 = utils.randomize(colorTertiary);

                        const queryInsertHatchling = () =>
                        {

                            let sql = `INSERT INTO hatchlings_adopted VALUES (NULL, ${userID}, '${userName}', ${slot}, '${dateAdopted}', NULL, '${hatchlingName}', '${temperament[randTemp]}', 0.00, 0, NULL, '${colorPrimary[randColor1]}', '${colorSecondary[randColor2]}', '${colorTertiary[randColor3]}', NULL, NULL, NULL)`;

                            connection.query(sql, function (q2err, result)
                            {
                                if (q2err) throw q2err;
                                console.log('record inserted');
                            });
                        }

                        queryInsertHatchling();

                        let newHatchlingEmbed = hatchlingEmbed(userName, rows.length + 1, hatchlingName, avatars.stage1Icon, rows.length + 1, dateAdopted, 'N/A', temperament[randTemp], 0);

                        msg.reply('You\'ve just adopted `' + hatchlingName + '`!');
                        msg.channel.send(newHatchlingEmbed);
                        console.log(`${userName} just adopted a hatchling!`);
                    }
                    else
                    {
                        if (hatchlingName == '' || hatchlingName == ' ')
                        {
                            msg.reply('Please give your hatchling a name. (example: !h adopt name).\nValid characters are: `a-z` `A-Z` `0-9` `-` `\'` and `space`.\n Use `!h hatchlingCare` for more information.');
                        }
                        else
                        {
                            msg.reply('Please use valid charcters when naming your hatchling.\nValid characters are: `a-z` `A-Z` `0-9` `-` `\'` and `space`.\n Use `!h hatchlingCare` for more information.');
                        }
                    }
                }
                else
                {
                    msg.reply('You already have four hatchlings. Use the `!h showHatchlings` command to see them!');
                }

                //console.log(db._freeConnections.indexOf(connection)); // -1

                connection.release();

                //console.log(db._freeConnections.indexOf(connection)); // 0
            });
        });
    },

    showHatchlings: function  (db, msg, userID, userName)
    {
        db.getConnection(function (poolerror, connection)
        {
            if (poolerror) throw poolerror;

            connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID}`, function (err, rows, fields)
            {
                if (err) throw err;

                if (rows.length > 0)
                {
                    let id = [];
                    let names = [];
                    let hatchDay = [];
                    let affectionLvl = []; 
                    let isHatched = [];
                    let icons = [];

                    for (let i = 0; i < rows.length; i++)
                    {
                        let parsedData = JSON.parse(JSON.stringify(rows[i]));

                        id[i] = parsedData.id;
                        names[i] = parsedData.name;
                        hatchDay[i] = parsedData.date_hatched;
                        affectionLvl[i] = parsedData.affection_level;
                        isHatched[i] = parsedData.is_hatched;

                        icons[i] = assignIcon(hatchDay[i], affectionLvl[i], isHatched[i]);
                        console.log(icons[i]);
                    }

                    let reply = '';

                    if (rows.length == 1)
                    {
                    reply = `${msg.author}, You've adopted ${rows.length} hatchling!`;
                    }
                    else if (rows.length > 1)
                    {
                        reply = `${msg.author}, You've adopted ${rows.length} hatchlings!`;
                    }

                    msg.channel.createWebhook('Misraaks', 
                    {
                        avatar: 'https://hatchling.kinderguardians.io/assets/webhookIcon_misraaks.png'
                    })
                    .then(webhook => 
                    {
                        webhook.send(reply,
                        {
                            username: 'Misraaks',
                            avatarURL: 'https://hatchling.kinderguardians.io/assets/webhookIcon_misraaks.png',
                            embeds: embeds(userName, rows.length, names, icons).embeds
                        })
                        .then(() =>
                        {
                            webhook.delete();
                        });
                    });
                }
                else
                {
                    msg.reply('You haven\'t adopted any hatchlings yet.');
                }

                //console.log(db._freeConnections.indexOf(connection)); // -1

                connection.release();
    
                //console.log(db._freeConnections.indexOf(connection)); // 0
            });
        });
    },

    showHatchlingInfo: function (db, msg, userID, userName)
    {
        db.getConnection(function (poolerror, connection)
        {
            if (poolerror) throw poolerror;

            connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID}`, function (err, rows, fields)
            {
                if (err) throw err;

                if(rows.length > 0)
                {
                    let hatchling = msg.content.slice(8);

                    let childInfoQuery = function (childrow)
                    {
                        let parsedData = JSON.parse(JSON.stringify(childrow));

                        let childID = parsedData.id;
                        let dateAdopted = parsedData.date_adopted;
                        let dateHatched = parsedData.date_hatched;
                        let childName = parsedData.name;
                        let personality = parsedData.temperament;
                        let affectionLvl = parsedData.affection_level;
                        let childSlot = parsedData.save_slot;
                        let isHatched = parsedData.is_hatched;

                        dateAdopted = dateAdopted.slice(0, 10);

                        if (!dateHatched)
                        {
                            dateHatched = 'N/A';
                        }
                        else
                        {
                            dateHatched = dateHatched.slice(0, 10);
                        }

                        let childIcon = assignIcon(dateHatched, affectionLvl, isHatched);

                        childEmbed = hatchlingEmbed(userName, rows.length, childName, childIcon, childSlot, dateAdopted, dateHatched, personality, affectionLvl);

                        msg.channel.send(childEmbed);
                    }

                    if (hatchling == 'child1' || hatchling == 'child2' || hatchling == 'child3' || hatchling == 'child4')
                    {
                        let slot = hatchling.slice(5);

                        connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID} AND save_slot = ${slot}`, function (sloterr, slotrows)
                        {
                            if (sloterr) throw sloterr;

                            if (slotrows[0])
                            {
                                if (slotrows.length > 1)
                                {
                                    console.log('This shouldn\'t happen. More than 1 childx');
                                }
                                childInfoQuery(slotrows[0]);
                            }
                            else
                            {
                                let heirarchy = ['second', 'third', 'fourth'];
                                msg.reply(`You don't have a ${heirarchy[slot - 2]} child`);
                            }
                        })
                    }
                    else
                    {
                        connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID} AND name = '${hatchling}'`, function (nameerr, namerows)
                        {
                            if (nameerr) throw nameerr;
    
                            if (namerows[0])
                            {
                                if (namerows.length > 1)
                                {
                                    msg.reply('You have more than one active hatchling with the same name. Use the child heirarchy to view their info instead. (Example: `!h show child2`).');
                                }
                                else
                                {
                                    childInfoQuery(namerows[0]);
                                }
                            }
                            else
                            {
                                msg.reply('You don\'t have any hatchlings by the name of `' + hatchling + '`. Double check the spelling. This command is case-sensitive, and extra spaces count. Alternatively, try using `child1`, `child2`, `child3` or `child4` in place of the name. (Example: `!h show child1`).');
                            }
                        });
                    }
                }
                else
                {
                    msg.reply('You don\'t have any hatchlings. Try using the `!h adopt [name]` command to adopt one!');
                }

                //console.log(db._freeConnections.indexOf(connection)); // -1

                connection.release();
    
                //console.log(db._freeConnections.indexOf(connection)); // 0
            });
        });
    },

    renameHatchling: function  (db, msg, userID, userName)
    {
        // POOL CONNECT
        db.getConnection(function (poolerror, connection)
        {
            if (poolerror) throw poolerror;
        
            connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID}`, function (err, rows, fields)
            {
                if (err) throw err;

                if(rows.length > 0)
                {
                    let hatchlingNewName = msg.content.slice(10);

                    let nameValidation = utils.nameValidation(hatchlingNewName);

                    if (nameValidation)
                    {
                        let names = [];
                        let slots = [];

                        let nameString = '';

                        for (let i = 0; i < rows.length; i ++)
                        {
                            let parsedData = JSON.parse(JSON.stringify(rows[i]));

                            names[i] = parsedData.name;
                            slots[i] = parsedData.save_slot;
                            nameString = nameString + '`' + slots[i] + ' - ' + names[i] + '`' + '\n';
                        }

                        let renameEmbedReactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

                        const filter = (reaction, user) =>
                        {
                            return renameEmbedReactions.includes(reaction.emoji.name) && user.id === msg.author.id;
                        };

                        let renameEmbedSelection = Embeds.generateRenameEmbed(userName, nameString);

                        msg.channel.send(renameEmbedSelection).then(async m =>
                            {
                                for (let i = 0; i < rows.length; i++)
                                {
                                    await m.react(renameEmbedReactions[i]);
                                }

                                m.awaitReactions(filter, {max: 1, time: 10000})
                                .then(collected =>
                                    {
                                        let r = collected.first();

                                        const queryUpdateName = slotNumber =>
                                        {
                                            console.log('REACT' + slotNumber);
                                            let sql = `UPDATE hatchlings_adopted SET name = '${hatchlingNewName}' WHERE owner_id = ${userID} AND save_slot = ${slotNumber}`;
                                            connection.query(sql, function (updterr, ok)
                                            {
                                                if (updterr) throw updterr;

                                                connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID} AND save_slot = ${slotNumber}`, function (newerr, newRow)
                                                {
                                                    if (newerr) throw err;

                                                    let renameData = JSON.parse(JSON.stringify(newRow[0]));

                                                    let oldName = names[slots.indexOf(slotNumber)];
                                                    let verifiedNewName = renameData.name;
                                                    let verifiedSlot = renameData.save_slot;
                                                    let verifiedDateAdopted = renameData.date_adopted;
                                                    let verifiedDateHatched = renameData.date_hatched;
                                                    let verifiedTemperament = renameData.temperament;
                                                    let verifiedAffectionLvl = renameData.affection_level;
                                                    let verifiedHatchStatus = renameData.is_hatched;

                                                    verifiedDateAdopted = verifiedDateAdopted.slice(0, 10);

                                                    if (!verifiedDateHatched)
                                                    {
                                                        verifiedDateHatched = 'N/A';
                                                    }
                                                    else
                                                    {
                                                        verifiedDateHatched = verifiedDateHatched.slice(0, 10);
                                                    }

                                                    let newHatchlingIcon = assignIcon(verifiedDateHatched, verifiedAffectionLvl, verifiedHatchStatus);

                                                    let newHatchlingEmbed = hatchlingEmbed(userName, rows.length, verifiedNewName, newHatchlingIcon, verifiedSlot, verifiedDateAdopted, verifiedDateHatched, verifiedTemperament, verifiedAffectionLvl);
                        
                                                    msg.reply('You\'ve just renamed `' + oldName + '` to `' + verifiedNewName + '`!');
                                                    msg.channel.send(newHatchlingEmbed)
                                                });
                                            });
                                        }
                                
                                        if (r.emoji.name == '1️⃣')
                                        {
                                            queryUpdateName(1);
                                        } 
                                        else if (r.emoji.name == '2️⃣')
                                        {
                                            queryUpdateName(2);
                                        }
                                        else if (r.emoji.name == '3️⃣')
                                        {
                                            queryUpdateName(3);
                                        }
                                        else if (r.emoji.name == '4️⃣')
                                        {
                                            queryUpdateName(4);
                                        }

                                        console.log(`${userName} just renamed a hatchling!`);

                                    }
                                )
                                .catch(catcherr =>
                                {
                                        console.log('errors: if emoji parent undefined, user did not select reaction. ', catcherr);

                                        msg.reply('Selection time expired. Try again!');

                                });
                            });
                    }
                    else
                    {
                        if (hatchlingNewName == '' || hatchlingNewName == ' ')
                        {
                            msg.reply('Please provide a name. (example: !h rename Name).\nValid characters are: `a-z` `A-Z` `0-9` `-` `\'` and `space`.\n Use `!h hatchlingCare` for more information.');
                        }
                        else
                        {
                            msg.reply('Please use valid charcters when naming your hatchling.\nValid characters are: `a-z` `A-Z` `0-9` `-` `\'` and `space`.\n Use `!h hatchlingCare` for more information.');
                        }
                    }
                }
                else
                {
                    msg.reply('You don\'t have any hatchlings to rename. Use the `!h adopt HatchlingName` command to adopt one. Use the `!h hatchlingCare` command for more information.');
                }

                //console.log(db._freeConnections.indexOf(connection)); // -1

                connection.release();
    
                //console.log(db._freeConnections.indexOf(connection)); // 0
            });
        });
    },

    surrenderHatchling: function (db, msg, userID, userName)
    {
        db.getConnection(function (poolerror, connection)
        {
            if (poolerror) throw poolerror;
        
            connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID}`, function (err, rows, fields)
            {
                if (err) throw err;

                if(rows.length > 0)
                {
                    let names = [];
                    let slots = [];

                    let nameString = '';

                    for (let i = 0; i < rows.length; i ++)
                    {
                        let parsedData = JSON.parse(JSON.stringify(rows[i]));

                        names[i] = parsedData.name;
                        slots[i] = parsedData.save_slot;
                        nameString = nameString + '`' + slots[i] + ' - ' + names[i] + '`' + '\n';
                    }

                    let surrenderEmbedReactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

                    const filter = (reaction, user) =>
                    {
                        return surrenderEmbedReactions.includes(reaction.emoji.name) && user.id === msg.author.id;
                    };

                    let surrenderEmbedSelection = Embeds.generateSurrenderEmbed(userName, nameString);

                    msg.channel.send(surrenderEmbedSelection)
                    .then(async m =>
                    {
                        for (let i = 0; i < rows.length; i++)
                        {
                            await m.react(surrenderEmbedReactions[i]);
                        }

                        m.awaitReactions(filter, {max: 1, time: 10000})
                        .then(collected =>
                        {
                            let r = collected.first();

                            const queryDeleteRow = slotNumber =>
                            {
                                console.log('REACT ' + slotNumber);

                                let insertintosql = `INSERT INTO hatchlings_surrendered SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID} AND save_slot = ${slotNumber}`;
                                connection.query(insertintosql, function (inserr, insdata)
                                {
                                    if (inserr) throw inserr;

                                    let delownersql = `UPDATE hatchlings_adopted SET owner_id = NULL WHERE owner_id = ${userID} AND save_slot = ${slotNumber}`;
                                    connection.query(delownersql, function (delerr, deldata)
                                    {
                                        if (delerr) throw delerr;
    
                                        if (rows.length > 1)
                                        {
                                            connection.query(`SELECT * FROM hatchlings_adopted WHERE owner_id = ${userID}`, function (selecterr, selectrows)
                                            {
                                                if(selecterr) throw selecterr;
    
                                                for (let i = 0; i < selectrows.length; i++)
                                                {
                                                    let updatedData = JSON.parse(JSON.stringify(selectrows[i]));
                                                    let oldSaveSlot = updatedData.save_slot;
                                                    let newSaveSlot = i + 1;
    
                                                    connection.query(`UPDATE hatchlings_adopted SET save_slot = ${newSaveSlot} WHERE owner_id = ${userID} AND save_slot = ${oldSaveSlot}`, function (updterr, updtrows)
                                                    {
                                                        if (updterr) throw updterr;

                                                        console.log(`Child ${oldSaveSlot} is now child ${newSaveSlot} of ${selectrows + 1}`);
    
                                                        if (i == selectrows.length - 1)
                                                        {
                                                            console.log('I think this is last one');
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else
                                        {
                                            msg.reply('You have no more hatchlings left.');
                                        }
                                    });
                                });
                            }

                            if (r.emoji.name == '1️⃣')
                            {
                                queryDeleteRow(1);
                            } 
                            else if (r.emoji.name == '2️⃣')
                            {
                                queryDeleteRow(2);
                            }
                            else if (r.emoji.name == '3️⃣')
                            {
                                queryDeleteRow(3);
                            }
                            else if (r.emoji.name == '4️⃣')
                            {
                                queryDeleteRow(4);
                            }

                            console.log(`${userName} just surrendered a hatchling!`);

                            msg.reply(`You've rehomed a hatchling! Take care, friend...`);
                        })
                        .catch(catcherr =>
                        {
                            console.log('errors: if emoji parent undefined, user did not select reaction. ', catcherr);

                            msg.reply('Selection time expired. Try again!');
                        });
                    });
                }
                else
                {
                    msg.reply('You don\'t have any hatchlings to surrender. Use the `!h adopt HatchlingName` command to adopt one. Use the `!h hatchlingCare` command for more information.');
                }

                //console.log(db._freeConnections.indexOf(connection)); // -1

                connection.release();
    
                //console.log(db._freeConnections.indexOf(connection)); // 0
            });
        });
    },
}

function createNewUser (db, userID, userName, userTag)
{
    db.getConnection(function(poolerr, connection)
    {
        if (poolerr) throw poolerr;

        connection.query(`SELECT * FROM users WHERE discord_id = ${userID}`, function (usererr, userrows)
        {
            if (usererr) throw usererr;
    
            if (userrows.length == 0)
            {
                let dateJoined = utils.getCurrentDate();
                dateJoined = dateJoined.slice(0, 10);
    
                let newUserSQL = `INSERT INTO users VALUES (NULL, ${userID}, '${userName}', '${userTag}', '${dateJoined}', 0, 0, NULL)`;
                connection.query(newUserSQL, function (newusererr, newuserresults)
                {
                    if (newusererr) throw newusererr;
    
                    connection.query(`SELECT id FROM users WHERE discord_id = ${userID}`, function (iderr, idrows)
                    {
                        if (iderr) throw iderr;
    
                        if (idrows.length > 1)
                        {
                            console.warn('This shouldn\'t happen, more than one new user created: ', idrows.length);
                        }
    
                        let parsedUserData = JSON.parse(JSON.stringify(idrows[0]));
                        let newUserDBID = parsedUserData.id;
                        console.log('New User DB ID:', newUserDBID);
    
                        let newInventorySQL = `INSERT INTO inventories VALUES (NULL, ${newUserDBID}, ${userID}, '${userName}', 0, 0)`;
                        connection.query(newInventorySQL, function (newinventoryerr, newinventoryresults)
                        {
                            if (newinventoryerr) throw newinventoryerr;
    
                            connection.query(`SELECT id FROM inventories WHERE discord_id = ${userID}`, function (inventoryerr, inventoryrows)
                            {
                                if (inventoryerr) throw inventoryerr;
    
                                if (inventoryrows.length > 1)
                                {
                                    console.warn('This shouldn\'t happen, more than one inventory created: ', inventoryrows.length);
                                }
    
                                let parsedInventoryData = JSON.parse(JSON.stringify(inventoryrows[0]));
                                let newInventoryID = parsedInventoryData.id;
                                console.log('New User Inventory ID: ', newInventoryID);
    
                                let newInventoryUserIDSQL = `UPDATE users SET inventory_id = ${newInventoryID} WHERE discord_id = ${userID}`;
    
                                connection.query(newInventoryUserIDSQL, function(inventoryuseriderr, inventoryuserresults)
                                {
                                    if (inventoryuseriderr) throw inventoryuseriderr;
    
                                    console.log ('New User Registered');

                                    //console.log('user creation release' + db._freeConnections.indexOf(connection)); // -1

                                    connection.release();
                        
                                    //console.log('user creation release' + db._freeConnections.indexOf(connection)); // 0
                                });
                            });
                        });
                    });
                });
            }
        });
    });
}

function assignIcon (hatchDay, affectionLvl, isHatched)
{

    let icon;
    let timeToMature = 259200000;

    if (isHatched == 1)
    {
        hatchDay = hatchDay + ' 00:00:00';
        let dateHatched = new Date(hatchDay);
        let currentDate = new Date();
        let checkDate = currentDate - dateHatched;

        if (checkDate >= timeToMature)
        {
            icon = avatars.defaultIcon; //To be replaced with avatar generator handled in Avatars module.
        }
        else
        {
            icon = avatars.newbornIcon;
        }
    }
    else
    {
        console.log('switch happening');
        switch (true)
        {
            case affectionLvl == 0:
                icon = avatars.stage1Icon;
            break;

            case affectionLvl > 0 && affectionLvl < 4:
                icon = avatars.stage2Icon;
            break;

            case affectionLvl > 3 && affectionLvl < 9:
                icon = avatars.stage3Icon;
            break;

            case affectionLvl > 8 && affectionLvl < 14:
                icon = avatars.stage4Icon;
            break;

            case affectionLvl > 13 && affectionLvl < 15:
                icon = avatars.stage5Icon;
            break;

            case affectionLvl > 14:
                icon = avatars.newbornIcon;
            break;
        }
    }

    return icon;
}