const Discord = require('discord.js');
const Response = require('./responseObjects.js');
const Embeds = require('./embeds.js');
const Private = require('./private.js');
const Handling = require('./handling.js');
const fs = require("fs")

const client = new Discord.Client();

var no_u = undefined;
var messages_to_delete = [];

/* All listeners */
client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('warn', console.warn);

client.on('error', console.error);

client.on('message', message=> {
    if (message.isMentioned(client.user)) {
    message.reply('Hello there! Simply sent `!pp` `!commands` or `!help` for some more information :smiley:!');
}
});

/* Function that executes voice command when someone enters the a voice channel */
client.on('voiceStateUpdate', async (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel
    if(oldUserChannel === undefined && newUserChannel !== undefined && newMember.user.bot===false) {
        if (getToday()=='Wednesday') {
            await Handling.handleFile(Response.voiceObject["!wednesday"]["file"], null, newMember.voiceChannel, newMember.guild);
        }

        var newMemberUsername = newMember.user.username;
        var voiceCommand = Response.joinVoiceChatResponse[newMemberUsername] ? Response.joinVoiceChatResponse[newMemberUsername] : Response.joinVoiceChatResponse["default"]

        if (Response.joinVoiceChatResponse[newMemberUsername]) {
            await Handling.handleFile(Response.voiceObject[voiceCommand]["file"], null, newMember.voiceChannel, newMember.guild);
        } else {
            await Handling.handleFile(Response.voiceObject[voiceCommand]["file"], null, newMember.voiceChannel, newMember.guild);
        }
    } else if(newUserChannel === undefined && newMember.user.bot===false){
        // User leaves a voice channel
    } else if(newUserChannel!=oldUserChannel && newMember.user.bot===false) {
        // User changes voice channel 
    }
})

/* Basic functions */
// Get the current day
function getToday(){
    let today = new Date();
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Friday'];
    return days[today.getDay()-1];
}

function commandSay(str, msg){
    return msg.content.toLowerCase().startsWith("!" + str);
}

function ttsBot(message, args) {
    if(commandSay("say",message)) {
        if(args.length===1) {
            message.channel.send('(Idiot). Usage: !say [message to say].');
        } else {
            message.channel.send(args.join(" ").substring(5),{tts:false});
        }
    }
}

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

function sendEmbed(channel, embed) {
    initializeEmbedFields(embed);
    channel.send(embed);
}

/* Data values */
var categoriesString = {
    "top10": "Top 10",
    "recentlyadded": "Recently added 🆕",
    "reaction": "Reaction 😯",
    "gamen": "Gamen :video_game:",
    "motivation": "Motivation 💪",
    "sad": "Sad 😭",
    "meme": "Meme",
    "funny": "Funny 😂",
}

var categories = {
    "Top 10": ["test"],
    "Recently added 🆕": [],
    "Reaction 😯": [],
    "Gamen :video_game:": [],
    "Motivation 💪": [],
    "Sad 😭": [],
    "Meme": [],
    "Funny 😂": [],
};

var fortniteCategories = {
    "beforematch": [],
    "afterlose": [],
    "afterwin": []
};

var allVoiceCommands = [];

/** Initializing and resetting */
function makeResponseArrays() {
    var voiceObjectKeys=Object.keys(Response.voiceObject);
    for (var i=0; i<voiceObjectKeys.length; i++) {
        let currentVoiceKey=voiceObjectKeys[i];
        allVoiceCommands.push(currentVoiceKey.substring(1));
        // Add 15 last added commands
        if (i>voiceObjectKeys.length-15) {
                categories["Recently added 🆕"].push(" "+currentVoiceKey.substring(1));
        }
        // Push all voice commands
        for (var j=0; j<Response.voiceObject[currentVoiceKey]['categories'].length; j++) {
            if (i==0) {
                categories[Response.voiceObject[currentVoiceKey]['categories'][j]].push(currentVoiceKey.substring(1));
            } else {
                categories[Response.voiceObject[currentVoiceKey]['categories'][j]].push(" "+currentVoiceKey.substring(1));
            }
        }
        // Push all fortnite related voice commands
        for (var j=0; j<Response.voiceObject[currentVoiceKey]['categoriesFortnite'].length; j++) {
            fortniteCategories[Response.voiceObject[currentVoiceKey]['categoriesFortnite'][j]].push(currentVoiceKey);
        }
    }
}

function setAllEmbeds() {
    var categoriesKeys=Object.keys(categories);
    for (var i=0; i<categoriesKeys.length; i++) {
        Embeds.allFields.push(
            {
                name: categoriesKeys[i],
                value: categories[categoriesKeys[i]].reverse().toString(),
            }
        );
    }
    Embeds.allFields.push({
        name: "Simple response commands",
        value: "ayy, wat, lol, ping, pong, pief, paf, sup, regret, dab, nigga, really nigga"
    })
    Embeds.allFields.push(
    {
        name: "Bot",
        value: "test, help, commands, all, voicechat, chat, fortnite"
    })
    Embeds.allFields.push(
    {
        name: "Images/Gifs",
        value: "niceshot, regret, nigga, hackerman, hihi, hihi met"
    })
}

function initializeEmbedFields(embed) {
    embed['embed']['author']['name']=client.user.username;
    embed['embed']['author']['icon_url']=client.user.avatarURL;
    embed['embed']['footer']['icon_url']=client.user.avatarURL;
}

// Reset all embeds to an empty array
function resetEmbeds() {
    Embeds.chatCommands['embed']['fields']=[];
    Embeds.voiceCommands['embed']['fields']=[];
}

// Add all commands to the embeds
function setSpecificEmbeds() {
    Embeds.allCommands['embed']['fields']=Embeds.allFields;
    var name;
    // Setting all voice commands
    for (var i=0; i<Embeds.allFields.length; i++) {
        name=Embeds.allFields[i]['name'];
        if (name==="Simple response commands") {
            break;
        }
        Embeds.voiceCommands['embed']['fields'].push(Embeds.allFields[i]);
    }
    // Setting all chat commands
    for (var i=7; i<Embeds.allFields.length; i++) {
        Embeds.chatCommands['embed']['fields'].push(Embeds.allFields[i]);
    }
    // Setting alphabetical categories 
    setAlphabeticalEmbed();
}

function setAlphabeticalEmbed() {
    allVoiceCommandsSorted = allVoiceCommands.sort();
    var currentCharacter;
    var currentString = "";
    for (var i=0; i<allVoiceCommandsSorted.length; i++) {
        if (currentString != "" 
            && (currentCharacter != allVoiceCommandsSorted[i].charAt(0))
            && allVoiceCommandsSorted[i].charAt(0).match(/[a-z]/i)
        ) {
            Embeds.alphaTest['embed']['fields'].push(
                {
                    name: currentCharacter,
                    value: currentString,
                    inline: true
                }
            );
            currentString = "";
        }
        currentCharacter = allVoiceCommandsSorted[i].charAt(0);

        if (currentString == "") {
            currentString += allVoiceCommandsSorted[i].toString();
        } else {
            currentString += ", " + allVoiceCommandsSorted[i].toString();
        }
    };
}

function updateLoggingEmbed() {
    // Get the logging data
    let loggingRaw = fs.readFileSync("./Logging/logging.json");

    // Convert to usable JSON
    let loggingJSON = JSON.parse(loggingRaw);

    // Convert to sorted array
    var sortedArray = [];
    for (var i in loggingJSON) {
        sortedArray.push([loggingJSON[i], i])
    }
    sortedArray.sort(function (a, b) {
        if (a[0] > b[0]) {
            return -1;
        }
        if (b[0] > a[0]) {
            return 1;
        }
        return 0;
    })

    var commandsString = "";
    var top10 = [];

    for (var i=0; i<30; i++) {
        commandsString += sortedArray[i][1] + " " + sortedArray[i][0] + "\n";
        if (i < 10) {
            top10.push(" " + sortedArray[i][1]);
        }
    }
    if (commandsString === "") {
        commandsString = "No commands used yet";
    }
    
    Embeds.logging['embed']['fields'] = [];
    Embeds.logging['embed']['fields'].push({
            name: "Commands",
            value: commandsString
        });
    categories["Top 10"] = top10.reverse();
}

/* Handling input */
client.on('ready', () => {
    console.log('The awesome bot made by Klaas Tilman is now online! Woahahoah');
    client.user.setActivity('!commands', { type: 'PLAYING' });
    makeResponseArrays();
    updateLoggingEmbed();
    resetEmbeds();
    setAllEmbeds();
    setSpecificEmbeds();

    channel = client.channels.get('456913907068698647');
    guild = client.guilds.get('456913906414125065');

    // 12oclock
    setTimeout(function(){ 
        playClock(channel, guild, "12oclock");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "12oclock");
        }, dayMillseconds)
    }, leftToTime(24,0,0,0)) 

    // 9oclock
    setTimeout(function(){ 
        playClock(channel, guild, "9oclock");
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            playClock(channel, guild, "9oclock");
        }, dayMillseconds)
    }, leftToTime(21,0,0,0)) 
});

// Calculate time left to a certain time
function leftToTime(hours, minutes, seconds, milliseconds){
    var d = new Date();
    var x = -d + d.setHours(hours,minutes,seconds,milliseconds);
    return (x);
}

// Play a file in a channel in a guild
async function playClock(channel, guild, fileName) {
    await Handling.handleFile(Response.voiceObject["!"+fileName]["file"], null, channel, guild);
} 

function deleteMessages() {
    for (var i=0; i<messages_to_delete.length; i++) {
        messages_to_delete[i].delete(1000);
    }
    messages_to_delete = [];
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
        var context = this, args = arguments;
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

client.on('message',async message => {
    var args = message.content.split(/[ ]+/);
    ttsBot(message,args);
    var messageLC=message.content.toLowerCase();
    /*if (message.author.username==="sperd") {
        message.react("🎉");
        message.react("🎈");
        message.react("🎊");
        message.react("😃");
        message.react("2⃣");
        message.react("1⃣");
    } */
    // Text commands
    if (Response.responseObject[messageLC] && message.author.username!='Ping Pong') {
        messages_to_delete.push(message);
        sendChatCommand(message.channel, Response.responseObject[messageLC]);
    }
    // Image commands
    if (Response.imageObject[messageLC]) {
        messages_to_delete.push(message);
        sendImageCommand(message.channel, Response.imageObject[messageLC]);
    }
    if (messageLC=="no u") {
        if (no_u == undefined) {
            no_u = message.author.username;
        } else if (no_u!=undefined && message.author.username!=no_u) {
            messages_to_delete.push(message);
            sendChatCommand(message.channel, Response.responseObject["double no u"]);
            no_u = undefined;
        } 
    } else {
        no_u = undefined;
    }
    // Voice commands
    if (Response.voiceObject[messageLC]) {
        messages_to_delete.push(message);
        Handling.handleVoiceCommand(message, Response.voiceObject[messageLC]["file"], messageLC, null);
        Handling.logVoiceCommand(messageLC);
    } else if (messageLC==="!skip" || messageLC==="!stop" || messageLC==="!queue" || messageLC==="!np" || messageLC==="!pause" || messageLC==="!resume" || messageLC==="!volume") {
        messages_to_delete.push(message);
        Handling.handleInstructions(message, messageLC, null);
    } else if (messageLC.startsWith('!volume')) {
        messages_to_delete.push(message);
        var volumeMessage=messageLC.split(/[ ]+/);
        var volume;
        if (volumeMessage.length!=1) {
            switch(volumeMessage[1]) {
                case "lower":
                    volume=volumeMessage[1];
                    break;
                case "higher": 
                    volume=volumeMessage[1];
                    break;
                case "half":
                    volume=volumeMessage[1];
                    break;
                case "twice":
                    volume=volumeMessage[1];
                    break;
                default:
                    volume=parseInt(volumeMessage[1]);
            }
        }
        Handling.handleInstructions(message, "!volume", volume);
    }
    // Emoji responds
    if (message.mentions.users.array().length > 0 || message.mentions.roles.array().length > 0 || message.mentions.everyone) {
        responseWithEmoji(message, Response.emojiObject["PingReee"]);
    }
    if (Response.emojiObject[messageLC]) {
        responseWithEmoji(message, Response.emojiObject[messageLC]);
    }
    // Send embeds
    if(Response.embeds[messageLC]) {
        messages_to_delete.push(message);
        if (messageLC == "!mostused") {
            makeResponseArrays();
            updateLoggingEmbed();
            resetEmbeds();
            setAllEmbeds();
            setSpecificEmbeds();
        }  
        sendEmbed(message.channel, Response.embeds[messageLC]);
    }

    // Randomizer
    var withoutFirstLetter=messageLC.substr(1);
    if (fortniteCategories[withoutFirstLetter]) {
        messages_to_delete.push(message);
        var randomItem = fortniteCategories[withoutFirstLetter][Math.floor(Math.random()*fortniteCategories[withoutFirstLetter].length)]
        Handling.handleVoiceCommand(message, Response.voiceObject[randomItem]["file"], randomItem); 
    } else if (categoriesString[withoutFirstLetter]) {
        messages_to_delete.push(message);
        var randomItem = categories[categoriesString[withoutFirstLetter]][Math.floor(Math.random()*categories[categoriesString[withoutFirstLetter]].length)]
        randomItem="!"+randomItem.replace(/ /g,'');
        Handling.handleVoiceCommand(message, Response.voiceObject[randomItem]["file"], randomItem); 
    }
    var deleting = debounce(deleteMessages, 20000, false);
    deleting();
});

client.login(Private.token);
