const fs = require('fs')
const Discord = require('discord.js')
const AWS = require('aws-sdk')
const moment = require('moment')
const schedule = require('node-schedule')
const dbPut = require('./utilities/dbPut')

require('dotenv').config()

const client = new Discord.Client()
client.commands = new Discord.Collection()

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' })

const prefix = process.env.PREFIX

const commandFiles = fs
    .readdirSync('./commands')
    .filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

const cooldowns = new Discord.Collection()

client.once('ready', async () => {
    console.log('Ready!')
    // digging time
    const guild = await client.guilds.get(process.env.SERVER_ID) // get Xandy Discord Server
    const listedChannels = []
    guild.channels.forEach(channel => {
        if (
            channel.type === 'text' &&
            channel.permissionsFor(client.user).has('VIEW_CHANNEL')
        )
            listedChannels.push(channel.name)
    })
    schedule.scheduleJob({ hour: 00, minute: 00 }, async () => {
        const currentTime = moment.utc()
        const startHour = Math.floor(Math.random() * 24)

        const digStartTime = currentTime.clone().add(startHour, 'hours')
        const digEndTime = currentTime.clone().add(startHour + 1, 'hours')
        const newDigTime = {
            TableName: 'Events',
            Item: {
                id: digStartTime.toString(),
                type: 'dig',
                startTime: digStartTime.unix(),
                endTime: digEndTime.unix(),
                public: false,
            },
        }
        await dbPut(newDigTime, docClient)
    })
})

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            cmd => cmd.aliases && cmd.aliases.includes(commandName)
        )

    if (!command) return

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply("I can't execute that command inside DMs!")
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${
                command.usage
            }\``
        }

        return message.channel.send(reply)
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(message.author.id)) {
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000
            return message.reply(
                `please wait ${timeLeft.toFixed(
                    1
                )} more second(s) before reusing the \`${
                    command.name
                }\` command.`
            )
        }
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

    try {
        command.execute(message, args, docClient)
    } catch (error) {
        console.error(error)
        message.reply('there was an error trying to execute that command!')
    }
})

client.login()

process.on('unhandledRejection', error =>
    console.error('Uncaught Promise Rejection', error)
)
