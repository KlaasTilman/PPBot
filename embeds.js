exports.commands = {
        embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        description: "PPBot is an AMAZING voice command bot with a few simple chat commands.\n\n Voice commands can only be used when you are in a voicechat.",
        fields: [{
            name: "Commands",
            value: "Send `!all` for all commands\n Send `!voicechat` for all voicechat commands \n Send `!chat` for all chat commands! \n Send `!voicechatcat` for all voice commands with categories! \n"
          },
          {
            name: "Randomizer",
            value: "Any of the categories from `!voicechat` can be randomized, send `!categories` for all randomizer categories commands!"
          },
        ],
        title: "Documentation",
        url: "https://github.com/KlaasTilman/DiscordPPBot",
        footer: {
            icon_url: "",
            text: "© Klaas Tilman",
        }
    }
}

exports.suggestioninstructions = {
    embed: {
    color: 3447003,
    author: {
        name: "",
        icon_url: ""
    },
    description: "You can send suggestions to be added to the bot.",
    fields: [{
        name: "Command",
        value: "Do a suggestion as follows \n!suggestion\nlink:<linkname>\ncommandname:<name>\ncategory:<category_name>\nnote:<extra info>"
      },
    ],
    footer: {
        icon_url: "",
        text: "© Klaas Tilman",
    }
}
}

exports.allFields = []

exports.allCommands = {embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        description: "The awesome bot Ping Pong!",
        title: "All amazing commands",
        fields: [],
        footer: {
            icon_url: "",
            text: "© Klaas Tilman",
        }
    }
}

exports.chatCommands = {embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        title: "All chat commands",
        fields: [],
        footer: {
            icon_url: "",
            text: "© Klaas Tilman",
        }
    }
}

exports.voiceCommands = {embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        title: "All voice commands",
        fields: [],
        footer: {
            icon_url: "",
            text: "© Klaas Tilman",
        }
    }
}

exports.alphaTest = {embed: {
    color: 3447003,
    author: {
        name: "",
        icon_url: ""
    },
    title: "All voice commands alphabetical",
    fields: [],
    footer: {
        icon_url: "",
        text: "© Klaas Tilman",
    }
}
}

exports.logging = {embed: {
    color: 3447003,
    author: {
        name: "",
        icon_url: ""
    },
    title: "Most used voice commands",
    fields: [],
    footer: {
        icon_url: "",
        text: "© Klaas Tilman",
    }
}
}

exports.suggestion = {
    embed: {
        color: 3447003,
        author: {
            name: "",
            icon_url: ""
        },
        description: "",
        fields: [],
        title: "Suggestion link",
        url: "",
        footer: {
            icon_url: "",
            text: "",
        }
    }
}