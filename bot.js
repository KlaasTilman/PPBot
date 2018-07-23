const Discord = require('discord.js');
const Response = require('./responseObjects.js');
const Embeds = require('./embeds.js');
const Private = require('./private.js');
const client = new Discord.Client();
var isReady = true;
var doneInitializing = false;

const queue = new Map();

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('warn', console.warn);

client.on('error', console.error);

////////////////

async function playVoiceCommand(msg, audioFile, command) { // eslint-disable-line
	if (msg.author.bot) return undefined;
	const serverQueue = queue.get(msg.guild.id);
	const voiceChannel = msg.member.voiceChannel;
	if (command === '!skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === '!stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	/*} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`I set the volume to: **${args[1]}**`);*/
	} else if (command === '!np') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0]}**`);
	} else if (command === '!queue') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song}`).join('\n')}
**Now playing:** ${serverQueue.songs[0]}
		`);
	} else if (command === '!pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === '!resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	}
    if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(msg.client.user);
	if (!permissions.has('CONNECT')) {
		return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
	}
	if (!permissions.has('SPEAK')) {
		return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
	}
	await handleVideo(audioFile, msg, voiceChannel);
	return undefined;
}

async function handleVideo(song, msg, voiceChannel, guild) {
    var serverQueue;
    if (msg) {
        serverQueue = queue.get(msg.guild.id);
    } else {
        serverQueue = queue.get(guild.id);
    }
	if (!serverQueue) {
		const queueConstruct = {
			//textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
        if (msg) {
		    queue.set(msg.guild.id, queueConstruct);
        } else {
            queue.set(guild.id, queueConstruct);
        }

		queueConstruct.songs.push(song);
		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
            if (msg) {
			    play(msg.guild, queueConstruct.songs[0]);
            } else {
                play(guild, queueConstruct.songs[0]);
            }
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
            if (msg) {
			    queue.delete(msg.guild.id);
            } else {
                queue.delete(guild.id);
            }
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		//return msg.channel.send(`✅ **${song}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	
	const dispatcher=serverQueue.connection.playFile('./Voice files/'+song);
	dispatcher.on("end", end => {
		serverQueue.songs.shift();
		play(guild, serverQueue.songs[0])
	});
	dispatcher.on('error', error => console.log(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	//serverQueue.textChannel.send(`🎶 Start playing: **${song}**`);
}

function resetEmbeds() {
    Embeds.chatCommands['embed']['fields']=[];
    Embeds.voiceCommands['embed']['fields']=[];
}

//////////
function initialise() {
    Embeds.allCommands['embed']['fields']=Embeds.allFields
    var name;
    for (var i=0; i<Embeds.allFields.length; i++) {
        name=Embeds.allFields[i]['name'];
        if (name==="Simple response commands") {
            break;
        }
        Embeds.voiceCommands['embed']['fields'].push(Embeds.allFields[i]);
    }
    for (var i=7; i<Embeds.allFields.length; i++) {
        Embeds.chatCommands['embed']['fields'].push(Embeds.allFields[i]);
    }
}

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  if(oldUserChannel === undefined && newUserChannel !== undefined && newMember.user.bot===false) {
      if (newMember.user.username==="Klaas") {
          await handleVideo(Response.voiceObject["!klaas"], null, newMember.voiceChannel, newMember.guild);
      } else if (newMember.user.username==="sperd") {
          await handleVideo(Response.voiceObject["!sjoerd"], null, newMember.voiceChannel, newMember.guild);
      } else if (newMember.user.username==="Kizerain") {
          await handleVideo(Response.voiceObject["!wout"], null, newMember.voiceChannel, newMember.guild);
      } else if (newUserChannel.name==="General Kenobi") {
          await handleVideo(Response.voiceObject["!hellothere"], null, newMember.voiceChannel, newMember.guild);
      }
  } else if(newUserChannel === undefined && newMember.user.bot===false){
      // User leaves a voice channel
  } else if(newUserChannel!=oldUserChannel && newMember.user.bot===false) {
      // User changes voice channel 
  }
})

function commandSup(str, msg){
    return msg.content.toLowerCase().startsWith("sup " + str);
}

function commandSay(str, msg){
    return msg.content.toLowerCase().startsWith("!" + str);
}


function ttsBot(message, args) {
    if(commandSay("say",message)) {
        if(args.length===1) {
            message.channel.sendMessage('(Idiot). Usage: !say [message to say].');
        } else {
            message.channel.sendMessage(args.join(" ").substring(5),{tts:true});
        }
    }
}

/*function playVoiceCommand(channel, voiceChannelID, voiceChannel, audioFile) {
    if (isReady) {
        if (voiceChannelID==null) {
            channel.sendMessage('You have to be in a voice chat to use this command.')
        } else if (isReady) {
            isReady=false;
            voiceChannel.join().then(connection =>{
                const dispatcher=connection.playFile('./Voice files/'+audioFile);
                dispatcher.on("end", end => {voiceChannel.leave();
                isReady=true;});
            }).catch(err => console.log(err));
        } 
    } else if (channel!=null) {
        console.log("dit?");
        channel.send("Please wait for the current voice command to end.");
    }
} */

function sendChatCommand(channel, chatMessage) {
    channel.send(chatMessage);
}

function sendImageCommand(channel, image) {
    channel.sendFile('./Image files/'+image);
}

function responseWithEmoji(message, emojiCode) {
    message.react(client.emojis.get(emojiCode))
    .catch(console.error);
}

function initializeEmbedFields(embed) {
    embed['embed']['author']['name']=client.user.username;
    embed['embed']['author']['icon_url']=client.user.avatarURL;
    embed['embed']['footer']['icon_url']=client.user.avatarURL;
}

function sendEmbed(channel, embed) {
    initializeEmbedFields(embed);
    channel.send(embed);
}

client.on('ready', () => {
    console.log('The awesome bot made by Klaas Tilman is now online! Woahahoah');
    client.user.setActivity('!commands', { type: 'PLAYING' });
    resetEmbeds();
    initialise();
});

client.on('message',async message => {
    var args = message.content.split(/[ ]+/);
    ttsBot(message,args);
    var messageLC=message.content.toLowerCase();
    // Text commands
    if (Response.responseObject[messageLC] && message.author.username!='Ping Pong') {
        sendChatCommand(message.channel, Response.responseObject[messageLC]);
    }
    // Image commands
    if (Response.imageObject[messageLC]) {
        sendImageCommand(message.channel, Response.imageObject[messageLC]);
    }
    // Voice commands
    if (Response.voiceObject[messageLC] || messageLC==="!skip" || messageLC==="!stop" || messageLC==="!queue" || messageLC==="!np" || messageLC==="!pause" || messageLC==="!resume") {
        playVoiceCommand(message, Response.voiceObject[messageLC], messageLC);
    }
    // Emoji responds
    if (Response.emojiObject[messageLC]) {
        responseWithEmoji(message, Response.emojiObject[messageLC]);
    }
    // Send embeds
    if(Response.embeds[messageLC]) {
        sendEmbed(message.channel, Response.embeds[messageLC]);
    }
    if(messageLC.includes("ping pong")) {
        console.log("Bot was mentioned");
        message.channel.send("Say what?",{tts:true});
    }
});

client.login(Private.token);
