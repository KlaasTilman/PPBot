exports.processMessage = processMessage;
const Connection = require('./connection.js');
const Response = require('./responseObjects.js');
const startUpInteraction = require('./startUpInteraction');

var messages_to_delete = [];

const CHAT_COMMAND = 0;
const VOICE_COMMAND = 1;
const IMAGE_COMMAND = 2;
const EMBED_COMMAND = 3;
const RANDOM_COMMAND = 4;
const VOLUME_COMMAND = 5;
const INSTRUCTION_COMMAND = 6;
const EMOJI_COMMAND = 7;

/* Data values */
exports.categoriesString = {
    "top10": "Top 10",
    "recentlyadded": "Recently added 🆕",
    "reaction": "Reaction 😯",
    "gamen": "Gamen :video_game:",
    "motivation": "Motivation 💪",
    "sad": "Sad 😭",
    "meme": "Meme",
    "funny": "Funny 😂",
}

exports.categories = {
    "Top 10": ["test"],
    "Recently added 🆕": [],
    "Reaction 😯": [],
    "Gamen :video_game:": [],
    "Motivation 💪": [],
    "Sad 😭": [],
    "Meme": [],
    "Funny 😂": [],
};

exports.fortniteCategories = {
    "beforematch": [],
    "afterlose": [],
    "afterwin": []
};

function processMessage(client, message) {
    var messageObject = getMessageType(message, client);
    /*if (message.author.username==="sperd") {
        message.react("🎉");
        message.react("🎈");
        message.react("🎊");
        message.react("😃");
        message.react("2⃣");
        message.react("1⃣");
    } */

    if (message.author.username == 'PPBot') {
        //messages_to_delete.push(message);
    }

    /** TEMP CODE */
    var emojiNumbers = [
        '1️⃣',
        '2️⃣',
        '3️⃣',
        '4️⃣',
        '5️⃣'
    ]

    if (getMessageLowerCase(message) == 'testing') {
        var voice_commands = startUpInteraction.allVoiceCommands;
        var i,j,temp_array,chunk=5;
        for (i = 0, j=voice_commands.length; i<j; i+=chunk) {
            temp_array = voice_commands.slice(i, i+chunk);
            testingMessage = "";
            for (k = 0; k < temp_array.length; k++) {
                testingMessage += emojiNumbers[k];
                testingMessage += " ";
                testingMessage += temp_array[k];
                testingMessage += " ";
            }
            sendMessage(message.channel, testingMessage);
        }
    }

    if (getMessageLowerCase(message).startsWith(emojiNumbers[0])) {
        for (var i = 0; i<emojiNumbers.length; i++) {
            responseWithEmoji(message, emojiNumbers[i]);
        }
    }

    /** TEMP CODE */

    // Text commands
    if (messageObject != null) {
        if (messageObject.type != EMOJI_COMMAND) {
            messages_to_delete.push(message);
        }
        console.log(messageObject);
        switch (messageObject.type) {
            case CHAT_COMMAND:
                sendMessage(message.channel, messageObject.response);
                break;
            case VOICE_COMMAND:
                Connection.handleVoiceCommand(message, messageObject.response);
                break;
            case VOLUME_COMMAND:
                Connection.handleInstructions(message, "!volume", messageObject.response);
                break;
            case INSTRUCTION_COMMAND:
                Connection.handleInstructions(message, messageObject.response, null);
                break;
            case IMAGE_COMMAND:
                sendImage(message.channel, messageObject.response);
                break;
            case EMBED_COMMAND:
                sendEmbed(client, message.channel, messageObject.response);
                break;
            case RANDOM_COMMAND:
                Connection.handleVoiceCommand(message, messageObject.response); 
                break;
            case EMOJI_COMMAND:
                responseWithEmoji(message, messageObject.response);
                break;
        }
    }

    var deleting = debounce(deleteMessages, 20000, false);
    deleting();
}

function getMessageType(message, client) {
    message_lower_case = getMessageLowerCase(message);
    message_without_first_letter = message_lower_case.substr(1);
    if(Response.responseObject[message_lower_case] && message.author.username != 'PPBot') {
        return {
            type: CHAT_COMMAND,
            response: Response.responseObject[message_lower_case]
        };
    } else if (Response.imageObject[message_lower_case]) {
        return {
            type: IMAGE_COMMAND,
            response: './Image files/'+Response.imageObject[message_lower_case]
        };
    } else if (Response.voiceObject[message_lower_case]) {
        return {
            type: VOICE_COMMAND,
            response: Response.voiceObject[message_lower_case]['file']
        };
    } else if (message_lower_case==="!skip" || message_lower_case==="!stop" || message_lower_case==="!queue" 
                || message_lower_case==="!np" || message_lower_case==="!pause" || message_lower_case==="!resume" || message_lower_case==="!volume") {
        return {
            type: INSTRUCTION_COMMAND,
            response: message_lower_case
        }
    } else if (message_lower_case.startsWith('!volume')) {
        var volumeMessage=message_lower_case.split(/[ ]+/);
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
        return {
            type: VOLUME_COMMAND,
            response: volume
        }
    } else if (Response.embeds[message_lower_case]) {
        if (message_lower_case == "!mostused") {
            startUpInteraction.initializeDataAndEmbeds();
        }
        return {
            type: EMBED_COMMAND,
            response: Response.embeds[message_lower_case]
        };
    } else if (exports.fortniteCategories[message_without_first_letter]) {
        var randomItem = exports.fortniteCategories[message_without_first_letter][Math.floor(Math.random()*exports.fortniteCategories[message_without_first_letter].length)];
        return {
            type: RANDOM_COMMAND,
            response: Response.voiceObject[randomItem]['file']
        }
    } else if (exports.categoriesString[message_without_first_letter]) {
        var randomItem = exports.categories[exports.categoriesString[message_without_first_letter]]
                            [Math.floor(Math.random()*exports.categories[exports.categoriesString[message_without_first_letter]].length)]
        randomItem="!"+randomItem.replace(/ /g,'');
        return {
            type: RANDOM_COMMAND,
            response: Response.voiceObject[randomItem]['file']
        }
    } else if (message.mentions.users.array().length > 0 || message.mentions.roles.array().length > 0 || message.mentions.everyone) {
        return {
            type: EMOJI_COMMAND,
            response: client.emojis.get(Response.emojiObject["PingReee"])
        };
    } else if (Response.emojiObject[message_lower_case]) {
        return {
            type: EMOJI_COMMAND,
            response: client.emojis.get(Response.emojiObject[message_lower_case])
        };
    }
    return null;
}

function getMessageLowerCase(message) {
    return message.content.toLowerCase();
}

function sendMessage(channel, message) {
    channel.send(message);
}

function sendImage(channel, image) {
    channel.sendFile(image);
}

function responseWithEmoji(message, emoji) {
    message.react(emoji)
        .catch(console.error);
}

function sendEmbed(client, channel, embed) {
    initializeEmbedFields(client, embed);
    channel.send(embed);
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

function initializeEmbedFields(client, embed) {
    embed['embed']['author']['name']=client.user.username;
    embed['embed']['author']['icon_url']=client.user.avatarURL;
    embed['embed']['footer']['icon_url']=client.user.avatarURL;
}