const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENTS
  ],
});

const prefix = 'k!';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'name') {
    if (args.length === 0) {
      await message.channel.send({
        content: 'Please provide a username.... Else how the fuck am I supposed to check?',
      });
      return;
    }

    const name = args[0].toLowerCase();

    // Vulnerability fixes
    if (!name.match(/^[_\.A-Za-z0-9]+$/)) {
      await message.channel.send({
        content: 'Invalid username format. Please use alphanumeric characters, underscores, and periods.',
      });
      return;
    }

    const url = `https://api.lixqa.de/v3/discord/pomelo/${encodeURIComponent(name)}`;

    try {
      const response = await axios.get(url);
      const status = response.data.data.check.status;
      let statusMessage = '';

      switch (status) {
        case 0:
          statusMessage = 'Check was not sent to Discord because your name did not pass the validator.';
          break;
        case 1:
          statusMessage = 'Failed to send check to Discord or Discord returned an invalid response.';
          break;
        case 2:
          statusMessage = 'Available.';
          break;
        case 3:
          statusMessage = 'Taken or Reserved.';
          break;
        case 4:
          statusMessage = 'Taken.';
          break;
        case 5:
          statusMessage = 'Reserved.';
          break;
        case 6:
          statusMessage = 'Your username is taken by.';
          break;
        default:
          statusMessage = 'Invalid Input.';
      }

      const result = new MessageEmbed()
        .setTitle('Pomelo Result')
        .setColor('#F8C8DC')
        .setDescription(`${message.author}, the username you've asked for, __**${name}**__, is: **${statusMessage}**`)
        .setFooter('Thanks to Lixqa for the API Access! • OwO • Made with 💓 by jhhspace');

      await message.channel.send({ embeds: [result] });
    } catch (error) {
      console.error('Error:', error);
      await message.channel.send({ content: 'An error occurred while checking the username.' });
    }
  }
});

client.login('TOKEN');
