const Discord = require('discord.js');
const Avatars = require('./Avatars');

const weburl = 'https://hatchling.kinderguardians.io'

const avatars = Avatars.avatars;
const defaultIcon = avatars.defaultIcon;
const emptyslotIcon = avatars.emptyslotIcon;

exports.helpEmbed = new Discord.MessageEmbed()
.setColor('#00FFF0')
.setTitle('HATCHLING: An Eliksni Server Companion')
.setURL(weburl)
.setDescription('Velask, Guardian! I greet you in the Light.')
.setThumbnail(defaultIcon)
.addField('AVAILABLE COMMANDS', '`!h help`: This embed.\n'+
                                '`!h hi`: I\'ll say something!\n'+
                                '`!h pat`: Pat me! uUwUu\n'+
                                '`!h hatchlingCare`: Learn to care for your Hatchlings.');

exports.hatchlingCareEmbed = new Discord.MessageEmbed()
.setColor('#00FFF0')
.setTitle('HATCHLING CARE: How to interact with your Hatchlings')
.setURL(weburl)
.setDescription('This is a work in progress! :U')
.setThumbnail(defaultIcon)
.addField('AVAILABLE COMMANDS', '`!h profile`: View your profile card.\n'+
                                '`!h adopt [name]`: Adopt a Hatchling!\n'+
                                '`!h hatchlings`: View your Hatchlings.\n'+
                                '`!h show [name]`: View the named Hatchling.\n'+
                                '`!h show child[x]`: View a Hatchling by heirarchy.\n'+
                                '`!h rename [new name]`: Rename a hatchling.\n'+
                                '`!h surrender`: Rehome a hatchling.')
.addField('ADDITIONAL INFO', '-When naming, don\'t include [].\n'+
                             '-Renaming and Surrender will prompt you to React.\n'+
                             '-When promted to react, only YOUR reaction counts.\n'+
                             '-You have 10 seconds to react.\n'+
                             '-More commands coming soon!');

exports.generateEmbeds = function (userName, children, names, icons)
{

    let allFields = [
        {
            "name": `**${names[0]}**`,
            "value": `Child 1 of ${children}\n`,
            "inline": true
        },
        {
            "name": `**${names[1]}**`,
            "value": `Child 2 of ${children}\n`,
            "inline": true
        },
        {
            "name": "\u200B",
            "value": "\u200B",
        },
        {
            "name": `**${names[2]}**`,
            "value": `Child 3 of ${children}\n`,
            "inline": true
        },
        {
            "name": `**${names[3]}**`,
            "value": `Child 4 of ${children}\n`,
            "inline": true
        }
    ]

    let fields = allFields;

    switch (children)
    {
        case 3:
            fields = allFields.slice(0, 4);
        break;

        case 2:
            fields = allFields.slice(0, 2);
        break;

        case 1:
            fields = allFields.slice(0, 1);
        break;
    }

    let allEmbeds = {
        "embeds": [
            { 
                "color": "FF00FF",
                "url": weburl,
                "title": `**${userName}'s Hatchlings**`,
                "fields": fields,
                "image": {
                    "url": icons[0]
                }
            },
            {
                "url": weburl,
                "image": {
                    "url": icons[1]
                }
            },
            {
                "url": weburl,
                "image": {
                    "url": icons[2]
                }
            },
            {
                "url": weburl,
                "image": {
                    "url": icons[3]
                }
            }
        ]
    }

    let webhookEmbeds = allEmbeds;

    switch (children)
    {
        case 3:
            webhookEmbeds.embeds = allEmbeds.embeds.slice(0, 3);
            //add 1 spare slot square image icon
            webhookEmbeds.embeds.push({"url": weburl, "image": {"url": emptyslotIcon}});
        break;

        case 2:
            webhookEmbeds.embeds = allEmbeds.embeds.slice(0, 2);
            //add 2 spare slot square image icon
            for (let i = 0; i < 2; i++)
            {
                webhookEmbeds.embeds.push({"url": weburl, "image": {"url": emptyslotIcon}});
            }
        break;

        case 1:
            webhookEmbeds.embeds = allEmbeds.embeds.slice(0, 1);
            //add 3 spare slot square image icon
            for (let i = 0; i < 3; i++)
            {
                webhookEmbeds.embeds.push({"url": weburl, "image": {"url": emptyslotIcon}});
            }
        break;
    }

    return webhookEmbeds;
}

exports.generateHatchlingEmbed = function (userName, children, childName, childIcon, childSlot, dateAdopted, dateHatched, personality, affectionLevel)
{
    let embed = new Discord.MessageEmbed()
    .setColor('#00FFF0')
    .setTitle(childName)
    .setURL(weburl)
    .setDescription(`**${userName}**`)
    .setThumbnail(childIcon)
    .addField('**SUMMARY**', `Child ${childSlot} of ${children}\n**Adoption Date**: ${dateAdopted}\n**Hatchday**: ${dateHatched}\n**Personality**: ${personality}\n**Intimacy**: ${affectionLevel}`);

    return embed;
}

exports.generateProfileEmbed = function (msg, userName, children, lvl, exp, glimmer, ether, inventory)
{
    const singularVerbiage = 'Hatchling';
    const pluralVerbiage = 'Hatchling';
    let avatarURL = msg.author.avatarURL();

    let verbiage;

    if (children > 1)
    {
        verbiage = pluralVerbiage;
    }
    else
    {
        verbiage = singularVerbiage;
    }

    let embed = new Discord.MessageEmbed()
    .setColor('#00FFF0')
    .setTitle(userName)
    .setURL(weburl)
    .setDescription(`🥚 ${children} ${verbiage}`)
    .setThumbnail(avatarURL)
    .addField('**Guardian Information**', `**Level**: ${lvl}\n**EXP**: ${exp}\n**Glimmer**: ${glimmer}\n**Ether Supply**: ${ether}\n**Inventory**: ${inventory}`);

    return embed;
}

exports.generateRenameEmbed = function (userName, nameString)
{
    let embed = new Discord.MessageEmbed()
    .setColor('#00FFF0')
    .setTitle('RENAME A HATCHLING')
    .setURL(weburl)
    .setThumbnail('https://hatchling.kinderguardians.io/assets/hatchling_embed_thumb.gif')
    .addField(`**${userName}'s\nRENAMABLE HATCHLINGS**`, nameString)
    .addField('INSTRUCTIONS', 'Select the reaction corresponding to the hatchling you want to rename. Use the `!h hatchlingCare` command for more information.');

    return embed;
}

exports.generateSurrenderEmbed = function (userName, nameString)
{
    let embed = new Discord.MessageEmbed()
    .setColor('#00FFF0')
    .setTitle('SURRENDER A HATCHLING')
    .setURL(weburl)
    .setThumbnail('https://hatchling.kinderguardians.io/assets/hatchling_embed_thumb.gif')
    .addField(`**${userName}'s\nSURRENDERABLE HATCHLINGS**`, nameString)
    .addField('INSTRUCTIONS', 'Select the reaction corresponding to the hatchling you want to surrender. Use the `!h hatchlingCare` command for more information.');

    return embed;
}