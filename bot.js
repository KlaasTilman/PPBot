const Discord = require('discord.js');
const Private = require('./private.js');
const voiceChannelInteraction = require('./voiceChannelInteraction.js');
const textChannelInteraction = require('./textChannelInteraction.js');
const startUpInteraction = require('./startUpInteraction.js');
const emojiInteraction = require('./emojiInteraction.js');

const client = new Discord.Client();

/* All listeners */

/* Disconnect listener */
client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

/* Reconnect listener */
client.on('reconnecting', () => console.log('I am reconnecting now!'));

/* Warning listener */
client.on('warn', console.warn);

/* Error listener */
client.on('error', console.error);

client.on('message', message=> {
    if (message.isMentioned(client.user)) {
    message.reply('Hello there! Simply sent `!pp` `!commands` or `!help` for some more information :smiley:!');
}
});

/* Voicestate update listener */
client.on('voiceStateUpdate', async (oldMember, newMember) => {
    voiceChannelInteraction.interactWithVoiceChannel(oldMember, newMember);
})

/* Start up listener */
client.on('ready', () => {
    startUpInteraction.initializeBot(client);
});

/* Emoji reaction listener */
client.on("messageReactionAdd", function(messageReaction, user){
    console.log(`a reaction is added to a message`);
    emojiInteraction.processEmoji(messageReaction, user);
});

/* Message sent listener */
client.on('message',async message => {
    textChannelInteraction.processMessage(client, message);
});

client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});

client.login(Private.token);
