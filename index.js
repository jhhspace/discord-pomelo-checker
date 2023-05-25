const { Client, Intents } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENTS
    ]
});

const prefix = 'k!';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'name') {
        const name = args[0].toLowerCase();

        // Vulnerability fixes
        if (!name.match(/^[_\.A-Za-z0-9]+$/)) {
            await message.channel.send('Invalid username format. Please use alphanumeric characters, underscores, and periods.');
            return;
        }

        const url = `https://api.lixqa.de/v2/discord/pomelo-lookup/?username=${encodeURIComponent(name)}`;

        try {
            const response = await axios.get(url);
            const messageText = response.data.message;
            await message.channel.send(`${message.author}, the username you've asked for, __**${name}**__, is: **${messageText}**`);
        } catch (error) {
            console.error('Error:', error);
            await message.channel.send('An error occurred while checking the username.');
        }
    }
});

client.login('TOKEN');
