const Discord = require('discord.js');
const Response = require('./responseObjects.js');
const Embeds = require('./embeds.js');
const Private = require('./private.js');
const client = new Discord.Client();
var isReady = true;

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

function playVoiceCommand(channel, voiceChannelID, voiceChannel, audioFile) {
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
    } else {
        channel.send("Please wait for the current voice command to end.");
    }
}

function sendChatCommand(channel, chatMessage) {
    channel.send(chatMessage);
}

function sendImageCommand(channel, image) {
    channel.sendFile('./Image files/'+image);
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
});

client.on('message',message => {
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
    if (Response.voiceObject[messageLC]) {
        playVoiceCommand(message.channel, message.member.voiceChannelID, message.member.voiceChannel, Response.voiceObject[messageLC]);
    }
    if(Response.embeds[messageLC]) {
        sendEmbed(message.channel, Response.embeds[messageLC]);
    }
    if(messageLC.includes("ping pong")) {
        console.log("Bot was mentioned");
        message.channel.send("Say what?",{tts:true});
    }
});

client.login(Private.token);