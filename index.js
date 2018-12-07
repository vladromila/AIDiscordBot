const Discord = require('discord.js');
const botConfig = require('./botConfig.json');
const YTDL = require('ytdl-core');

const bot = new Discord.Client({ disableEveryone: true })

bot.on("ready", async () => {
    console.log(`${bot.user.username} is now online!`);
    bot.user.setActivity("developed by Vlad Romila!");
})
let servers = {}
function play(connection, message) {
    let server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], { filter: 'audioonly' }));
    servers[message.guild.id].queue.shift();
    servers[message.guild.id].dispatcher.on("end", () => {
        if (servers[message.guild.id].queue.length>0)
            play(connection, message)
        else {
            console.log('Am fost aici!!!!!!!!!!!')
            connection.disconnect();
        }
    })
}
bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let prefix = botConfig.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    command.trim();
    if (command.indexOf(`${prefix}`) > -1) {
        switch (command) {
            case `${prefix}hello`:
                {
                    return message.channel.send(`Salut ${message.author}`);
                }
            case `${prefix}hi`:
                {
                    return message.channel.send(`Hi!`);
                }
            case `${prefix}medve`:
                {
                    return message.channel.send(`Medve e ${messageArray[1]}`);
                }
            case `${prefix}add`:
                {
                    var server = servers[message.guild.id];
                    return server.queue.push(messageArray[1]);
                }
            case `${prefix}play`:
                {
                    if (!messageArray[1])
                        return message.channel.send(`Introduceti un link bun`);
                    if (!message.member.voiceChannel)
                        return message.channel.send(`Pentru a da play la o melodie trebuie sa fii intr-un canal!`);
                    if (!servers[message.guild.id])
                        servers[message.guild.id] = {
                            queue: []
                        }
                    var server = servers[message.guild.id]
                    server.queue.push(messageArray[1]);
                        return message.member.voiceChannel.join().then(connection => {
                            if(!message.member.voiceChannel.connection.dispatcher)
                            play(connection, message)
                        })
                    
                }
            case `${prefix}leave`:
                {
                    return message.member.voiceChannel.leave();
                }
            case `${prefix}pause`:
                {
                    return message.member.voiceChannel.connection.dispatcher.pause();
                }
            case `${prefix}resume`:
                {
                    return message.member.voiceChannel.connection.dispatcher.resume();
                }
            default:
                return message.channel.send('Comanda Invalida');
        }
    }
})
bot.login(botConfig.token);