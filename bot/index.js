const Discord = require('discord.js');
const mysql = require('mysql');
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
	database: mysql_db
});

/* db.connect(function(err){
	if(err) throw err;
	console.log('Connected to Database: ' + mysql_db + '!');
}); */

//TRYING SOMETHING
/* db.on('error', err =>
{
	if (err.code == 'PROTOCOL_CONNECTION_LOST')
	{
		console.log('disconnect_handler - make it up!')
		//disconnect_handler();
		db.connect(function(conerr){
			if(conerr) throw conerr;
			console.log('Connected to Database: ' + mysql_db + '!');
		});
	}
	else
	{
		throw err;
	}
}); */
//////////////////

const client = new Discord.Client();

//Data//
const commands = Commands.commands;
const utils = Utils.utils;

//Event Listeners//

client.on('ready', () =>
{
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg =>
{
	const guild = msg.guild;
	const member = msg.member;

	if (msg.member)
	{
		const userID = msg.member.user.id;
		const userName = msg.member.user.username;
		console.log(`message posted ${guild.name}: ${member.user.tag}`);

		if (msg.content.substring(0, 2) == '!h')
		{
			let args = msg.content.substring(3).split(' ');
			let cmd = args[0];
			args = args.splice(1);
	
			switch(cmd)
			{
				case 'test':
					commands.testEmbed(msg);
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
				//!h adopt HatchlingName
				/////
				case 'adopt':
					commands.adoptHatchling(db, msg, userID, userName);
				break;
				/////
				//!h showHatchlings
				/////
				case 'showHatchlings':
					commands.showHatchlings(db, msg, userID, userName);
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
