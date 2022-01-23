const Discord = require('discord.js');
const mysql = require('mysql2');
const Emojis = require('./Emojis');
const Dialogue = require('./Dialogue');
const Commands = require('./Commands');
const Utils = require('./Utils');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const mysql_host = process.env.MYSQL_HOST;
const mysql_user = process.env.MYSQL_USER;
const mysql_auth = process.env.MYSQL_AUTH;
const mysql_db = process.env.MYSQL_DATABASE;

const db = mysql.createPool({
    connectionLimit: 10,
	host: mysql_host,
	user: mysql_user,
	password: mysql_auth,
	database: mysql_db,
	queueLimit: 0,
	charset: 'utf8mb4_general_ci',
});

const client = new Discord.Client();

//Data//
const commands = Commands.commands;
const emojis = Emojis.emojis;
const utils = Utils.utils;

//Event Listeners//

client.on('ready', () =>
{
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg =>
{
	const guild = msg.guild;

	if (msg.author == '845707305215066133')
	{
		console.log(`Hatchling Bot posted ${guild.name}`);
	}

	if (msg.member)
	{
		const userID = msg.member.user.id;
		const userName = msg.member.user.username;
		const userTag = msg.member.user.tag;

		if (msg.content.substring(0, 2) == '!h')
		{
			console.log(`message posted ${guild.name}: ${userTag}`);

			let args = msg.content.substring(3).split(' ');
			let cmd = args[0];
			args = args.splice(1);
	
			switch(cmd)
			{
				case 'test':
					commands.test(db, msg);
				break;

				case 'test2':
					commands.test2(db, msg);
				break;
				/////
				//!h help
				/////
				case 'help':
					commands.help(msg);
				break;
				/////
				//!h hatchlingCare
				/////
				case 'hatchlingCare':
					commands.hatchlingCare(msg);
				break;
				/////
				//!h hi
				/////
				case 'hi':
					commands.sayHi(msg, client);
				break;
				/////
				//!h pat
				/////
				case 'pat':
					commands.patTheBaby(msg, client);
				break;
				/////
				//!h profile
				/////
				case 'profile':
					commands.showProfile(db, msg, userID, userName, userTag);
				break;
				/////
				//!h adopt HatchlingName
				/////
				case 'adopt':
					commands.adoptHatchling(db, msg, userID, userName, userTag);
				break;
				/////
				//!h showHatchlings
				/////
				case 'showHatchlings':
					msg.channel.send('showHatchlings is deprecated. Please use `!h hatchlings` instead.');
				break;
				/////
				//!h hatchlings
				/////
				case 'hatchlings':
					commands.showHatchlings(db, msg, userID, userName);
				break;
				/////
				//!h show HatchlingName || childx
				/////
				case 'show':
					commands.showHatchlingInfo(db, msg, userID, userName);
				break;
				/////
				//!h rename HatchlingName
				/////
				case 'rename':
					commands.renameHatchling(db, msg, userID, userName);
				break;
				/////
				//!h surrender
				/////
				case 'surrender':
					commands.surrenderHatchling(db, msg, userID, userName);
				break;
				/////
				//!h xur
				/////
				case 'xur':
					let todaysDate = utils.getCurrentDate();
					msg.channel.send('Have you seen Xur? Use `!h setXur location` so others can find him!');
				break;
				/////
				//!h setXur
				/////
				case 'setXur':
					Console.log('Someday, we\'ll find Xur!');
				break;
			}
		}
		else if (msg.content === '!dune')
		{
			/////
			//!dune
			/////
			const duneDate = new Date(2021, 9, 22);
			let diff = utils.getTimeDifference(duneDate);
			let days = diff.days;
			let hours = diff.hours;
			let minutes = diff.minutes;
			let seconds = diff.seconds;

			let emoji = utils.getEmoji(emojis[11].id, client);
			let message = `**${days}** Days, **${hours}** Hours, **${minutes}** Minutes, **${seconds}** Seconds, until **DUNE**! ${emoji}`;

			msg.channel.send(message);
		}
				
	}
	else
	{
		if (msg.webhookID)
		{
			console.log(`message posted ${guild.name}: webhook`);
		}
		else
		{
			console.log(`message posted ${guild.name}: unknown`);
		}


	}
});

client.on('guildMemberAdd', member =>
{
	console.log('Member added');

	commands.welcome(member, client);
});

client.on('guildMemberRemove', function(member)
{
    const guild = member.guild;

    console.log(`a member leaves/kicked ${guild.name}: ${member.user.tag}`);
});

client.login(token);
