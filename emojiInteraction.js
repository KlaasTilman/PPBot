exports.processEmoji = processEmoji;
const Connection = require('./connection.js');
const Response = require('./responseObjects.js');
const textChannelInteraction = require('./textChannelInteraction.js');

const CHAT_COMMAND = 0;
const VOICE_COMMAND = 1;
const IMAGE_COMMAND = 2;
const EMBED_COMMAND = 3;
const RANDOM_COMMAND = 4;
const VOLUME_COMMAND = 5;
const INSTRUCTION_COMMAND = 6;
const EMOJI_COMMAND = 7;

async function processEmoji(reaction, user, client) {
    message = reaction.message;
    emoji = reaction.emoji.name;
    let test = await message.fetch();
    console.log(test.content);
    if (message.content.includes(emoji)) {
        message_splitted = message.content.split(" ");
        for (var i = 0; i < message_splitted.length; i = i + 2) {
            var emoji_message = message_splitted[i];
            if (emoji == emoji_message) {
                var text_message = "!" + message_splitted[i+1];
                var voice_channel = message.guild.members.get(user.id).voiceChannel;

                var message_object = textChannelInteraction.getMessageType(message, client, text_message.toLowerCase());

                // Voice command
                if (voice_channel) {
                    switch (message_object.type) {
                        case VOICE_COMMAND:
                            await Connection.handleFile(Response.voiceObject[text_message]['file'], message, voice_channel, message.guild);
                            break;
                        case INSTRUCTION_COMMAND:
                            console.log('instructing');
                            Connection.handleInstructions(message, message_object.response, null);
                            break;
                    }
                }
            }
        }
    }
}

