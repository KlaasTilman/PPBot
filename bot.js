const Discord = require('discord.js');
const Response = require('./responseObjects.js');
const Embeds = require('./embeds.js');
const Private = require('./private.js');
const Handling = require('./handling.js');
const client = new Discord.Client();

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
  let randomVoiceCommand = ["!hellothere", "!jeff", "!flip", "!klokhuis", "!ohhoi", "!yaboi", "!heyboys"];
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  if(oldUserChannel === undefined && newUserChannel !== undefined && newMember.user.bot===false) {
      if (getToday()=='Wednesday') {
          await Handling.handleFile(Response.voiceObject["!wednesday"]["file"], null, newMember.voiceChannel, newMember.guild);
      } else if (newMember.user.username==="Klaas") {
            let arrayName = randomVoiceCommand;
            arrayName.push("!klaas");
            var rand = arrayName[Math.floor(Math.random() * randomVoiceCommand.length)];
            await Handling.handleFile(Response.voiceObject[rand]["file"], null, newMember.voiceChannel, newMember.guild);
      } else if (newMember.user.username==="Meduro") {
            let arrayName = randomVoiceCommand;
            arrayName.push("!eric");
            var rand = arrayName[Math.floor(Math.random() * randomVoiceCommand.length)];
            await Handling.handleFile(Response.voiceObject[rand]["file"], null, newMember.voiceChannel, newMember.guild);
      } else if (newMember.user.username==="sperd") {
            let arrayName = randomVoiceCommand;
            arrayName.push("!sjoerd");
            var rand = arrayName[Math.floor(Math.random() * randomVoiceCommand.length)];
            await Handling.handleFile(Response.voiceObject[rand]["file"], null, newMember.voiceChannel, newMember.guild);
      } else if (newMember.user.username==="Kizerain") {
            let arrayName = randomVoiceCommand;
            arrayName.push("!wout");
            var rand = arrayName[Math.floor(Math.random() * randomVoiceCommand.length)];
            await Handling.handleFile(Response.voiceObject[rand]["file"], null, newMember.voiceChannel, newMember.guild);
      } else {
          var rand = randomVoiceCommand[Math.floor(Math.random() * randomVoiceCommand.length)];
          await Handling.handleFile(Response.voiceObject[rand]["file"], null, newMember.voiceChannel, newMember.guild);
      }
  } else if(newUserChannel === undefined && newMember.user.bot===false){
      // User leaves a voice channel
  } else if(newUserChannel!=oldUserChannel && newMember.user.bot===false) {
      // User changes voice channel 
  }

})
/* All listeners above */

/* Basic functions */
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
            message.channel.sendMessage('(Idiot). Usage: !say [message to say].');
        } else {
            message.channel.sendMessage(args.join(" ").substring(5),{tts:false});
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

/* Basic functions above */

var categoriesString = {
    "recentlyadded": "Recently added 🆕",
    "reaction": "Reaction 😯",
    "gamen": "Gamen :video_game:",
    "motivation": "Motivation 💪",
    "sad": "Sad 😭",
    "meme": "Meme",
    "funny": "Funny 😂",
}

var categories = {
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

/* Data values above */

/** Initializing and resetting */

function resetEmbeds() {
    Embeds.chatCommands['embed']['fields']=[];
    Embeds.voiceCommands['embed']['fields']=[];
}

function initialise() {
    Embeds.allCommands['embed']['fields']=Embeds.allFields;
    var name;
    // Initialising all voice commands
    for (var i=0; i<Embeds.allFields.length; i++) {
        name=Embeds.allFields[i]['name'];
        if (name==="Simple response commands") {
            break;
        }
        Embeds.voiceCommands['embed']['fields'].push(Embeds.allFields[i]);
    }
    // Intialising all chat commands
    for (var i=7; i<Embeds.allFields.length; i++) {
        Embeds.chatCommands['embed']['fields'].push(Embeds.allFields[i]);
    }
}

function makeResponseArrays() {
    var voiceObjectKeys=Object.keys(Response.voiceObject);
    for (var i=0; i<voiceObjectKeys.length; i++) {
        let currentVoiceKey=voiceObjectKeys[i];
        if (i>voiceObjectKeys.length-15) {
                categories["Recently added 🆕"].push(" "+currentVoiceKey.substring(1));
        }
        for (var j=0; j<Response.voiceObject[currentVoiceKey]['categories'].length; j++) {
            if (i==0) {
                categories[Response.voiceObject[currentVoiceKey]['categories'][j]].push(currentVoiceKey.substring(1));
            } else {
                categories[Response.voiceObject[currentVoiceKey]['categories'][j]].push(" "+currentVoiceKey.substring(1));
            }
        }
        for (var j=0; j<Response.voiceObject[currentVoiceKey]['categoriesFortnite'].length; j++) {
            fortniteCategories[Response.voiceObject[currentVoiceKey]['categoriesFortnite'][j]].push(currentVoiceKey);
        }
    }
}

function initialiseAllEmbeds() {
    var categoriesKeys=Object.keys(categories);
    for (var i=0; i<categoriesKeys.length; i++) {
        Embeds.allFields.push(
            {
                name: categoriesKeys[i],
                value: categories[categoriesKeys[i]].reverse().toString()
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

/** Initializing and resetting above */

/* Handling input */

client.on('ready', () => {
    console.log('The awesome bot made by Klaas Tilman is now online! Woahahoah');
    client.user.setActivity('!commands', { type: 'PLAYING' });
    makeResponseArrays();
    resetEmbeds();
    initialiseAllEmbeds();
    initialise();

    channel = client.channels.get('456913907068698647');
    guild = client.guilds.get('456913906414125065')
    setTimeout(function(){ 
        play12OClock(channel, guild);
        var dayMillseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){ // repeat this every 24 hours
            play12OClock(channel, guild);
        }, dayMillseconds)
    }, leftTo12OClock()) 
});

function leftTo12OClock(){
    var d = new Date();
    return (-d + d.setHours(0,0,0,0));
}

async function play12OClock(channel, guild) {
    await Handling.handleFile(Response.voiceObject["!12oclock"]["file"], null, channel, guild);
} 

// Get the channel via ID let channel = client.channels.get('456913907068698647'); await Handling.handleFile(Response.voiceObject["!wednesday"]["file"], null, channel, newMember.guild);

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
        sendChatCommand(message.channel, Response.responseObject[messageLC]);
    }
    // Image commands
    if (Response.imageObject[messageLC]) {
        sendImageCommand(message.channel, Response.imageObject[messageLC]);
    }
    // Voice commands
    if (Response.voiceObject[messageLC] || messageLC==="!skip" || messageLC==="!stop" || messageLC==="!queue" || messageLC==="!np" || messageLC==="!pause" || messageLC==="!resume" || messageLC==="!volume") {
        if (Response.voiceObject[messageLC]!=undefined) {
            Handling.handleVoiceCommand(message, Response.voiceObject[messageLC]["file"], messageLC, null);
        } else {
            Handling.handleVoiceCommand(message, Response.voiceObject[messageLC], messageLC, null);
        }
    } else if (messageLC.startsWith('!volume')) {
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
        Handling.handleVoiceCommand(message, Response.voiceObject[messageLC], "!volume", volume);
    }
    // Emoji responds
    if (Response.emojiObject[messageLC]) {
        responseWithEmoji(message, Response.emojiObject[messageLC]);
    }
    // Send embeds
    if(Response.embeds[messageLC]) {
        sendEmbed(message.channel, Response.embeds[messageLC]);
    }

    // Randomizer

    var withoutFirstLetter=messageLC.substr(1);
    if (fortniteCategories[withoutFirstLetter]) {
        var randomItem = fortniteCategories[withoutFirstLetter][Math.floor(Math.random()*fortniteCategories[withoutFirstLetter].length)]
        Handling.handleVoiceCommand(message, Response.voiceObject[randomItem]["file"], randomItem); 
    } else if (categoriesString[withoutFirstLetter]) {
        var randomItem = categories[categoriesString[withoutFirstLetter]][Math.floor(Math.random()*categories[categoriesString[withoutFirstLetter]].length)]
        randomItem="!"+randomItem.replace(/ /g,'');
        Handling.handleVoiceCommand(message, Response.voiceObject[randomItem]["file"], randomItem); 
    }

});

client.login(Private.token);
