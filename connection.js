exports.handleInstructions=handleInstructions;
exports.handleVoiceCommand=handleVoiceCommand;
exports.logVoiceCommand=logVoiceCommand;
exports.handleFile=handleFile;
exports.play=play;

const fs = require("fs")

const queue = new Map();

function logVoiceCommand(command) {
	command = command.substr(1);
	let rawdata = fs.readFileSync("./Logging/logging.json");
	let loggingJSON = JSON.parse(rawdata);
	
	if (!loggingJSON[command]) {
		loggingJSON[command] = 1;
	} else {
		loggingJSON[command] = loggingJSON[command] + 1;
	}

	fs.writeFile("./Logging/logging.json", JSON.stringify(loggingJSON), (error) => {"Couldn't write to ./logging.json" + error});
}

async function handleInstructions(msg, command, volume) {
	//if (msg.author.bot) return undefined;
	const serverQueue = queue.get(msg.guild.id);
	if (command === '!skip') {
		if (!msg.member.voice.channel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === '!stop') {
		if (!msg.member.voice.channel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === '!volume') {
		if (!msg.member.voice.channel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
        if (volume===null) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
        switch(volume) {
            case "lower":
                volume=serverQueue.volume-1;
                break;
            case "higher": 
                volume=serverQueue.volume+1;
                break;
            case "half":
                volume=serverQueue.volume/2;
                break;
            case "twice":
                volume=serverQueue.volume*2;
                break;
		}
		if (!isNaN(volume)) {
			if (volume<0) {
				volume=1;
			} else if (volume>10) {
				volume=10;
			}
			serverQueue.volume = volume;
			serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 5);
			return msg.channel.send(`I set the volume to: **${volume}**`);
		} else {
			return msg.reply('Hey mister that\'s not a valid number! Please input a number or valid command and stop hacking!')
		}
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
}

/* Function to handle the voice command 
First argument is the message, second the audioFile to be played, third the command issued and fourth the volume to be set */
async function handleVoiceCommand(msg, audioFile) { // eslint-disable-line
	if (msg.author.bot) return undefined;
	const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(msg.client.user);
	if (!permissions.has('CONNECT')) {
		return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
	}
	if (!permissions.has('SPEAK')) {
		return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
	}
	await handleFile(audioFile, msg, voiceChannel);
	return undefined;
}

async function handleFile(song, msg, voiceChannel, guild) {
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
		console.log(queueConstruct.songs + " | " + new Date().toLocaleTimeString())
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
		console.log(serverQueue.songs + " | " + new Date().toLocaleTimeString())
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
	var songtest = './Voice files/'+song;
	console.log(fs.existsSync(songtest));
	const dispatcher=serverQueue.connection.play('./Voice files/'+song);
	dispatcher.on("finish", end => {
		serverQueue.songs.shift();
		console.log(serverQueue.songs[0]);
		play(guild, serverQueue.songs[0])
	});
	dispatcher.on('error', error => console.log(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	//serverQueue.textChannel.send(`🎶 Start playing: **${song}**`);
}