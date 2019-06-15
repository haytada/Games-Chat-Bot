const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.on('ready', () => {
  console.log("I am online!")
});

client.on('guildMemberAdd', member => {
    console.log('User' + member.user.tag + 'has joined the server!');
    var role = member.guild.roles.find('name', 'Members');
    member.addRole(role);
  });

client.on('message', async message => { //ALL COMMANDS IN HERE
    if(message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase(); 

    if(command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send(sayMessage);
    }

    if(command === "ping") {
        message.channel.send("Pong!") 
         }

    if(command === "purge") {
        const deleteCount = parseInt(args[0], 10);
            if(!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to purge");
            const fetched = await message.channel.fetchMessages({limit: deleteCount});
            message.channel.bulkDelete(fetched)
            .catch(error => message.reply("Couldn't delete messages because of: ${error}"));
    }

    if(command === "help") {
        message.reply("```Bot Commands:\n\n!say - Make the bot say what you type afterwards.\n!ping - Make the bot say Pong!\n!purge 2-100 - Delete specified number of messages.```")
    }

    if(command === "kick") {
        if(!message.member.roles.some(r=>["Administrator", "BOT"].includes(r.name)))
        return message.reply("Sorry, you don't have permission to use this!");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member)
            return message.reply("Please mention a valid member of this server");
        if(!member)
            return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
        await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    }
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content.includes ("der")) {
    message.channel.send("derrrrrrrrrr")
  }
 });

client.on('raw', event => {
    console.log(event);
    const eventName = event.t;
    if(eventName === 'MESSAGE_REACTION_ADD')
    {
        if(event.d.message_id === '589456666764771360')
        {
          var reactionChannel = client.channels.get(event.d.channel_id);
          if(reactionChannel.messages.has(event.d.message_id))
            return;
          else {
            reactionChannel.fetchMessage(event.d.message_id)
            .then(msg => {
              var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
              var user = client.users.get(event.d.user_id);
              client.emit('messageReactionAdd', msgReaction, user);
            })
            .catch(err => console.log(err));
          }
        }
    }
    else if(eventName === "MESSAGE_REACTION_REMOVE")
    {
      if(event.d.message_id === '589456666764771360')
     {
      var reactionChannel = client.channels.get(event.d.channel_id);
      if(reactionChannel.messages.has(event.d.message_id))
          return;
      else {
        reactionChannel.fetchMessage(event.d.message_id)
        .then(msg => {
          var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
          var user = client.users.get(event.d.user_id);
          client.emit('messageReactionRemove', msgReaction, user);
        })
        .catch(err => console.log(err));
      }
     }

    }
});

client.on('messageReactionAdd', (messageReaction, user) => {
    
    var roleName = messageReaction.emoji.name;
    var role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());

    if(role)
    {
      var member = messageReaction.message.guild.members.find(member => member.id === user.id);
      if(member)
      {
        member.addRole(role.id);
        console.log("Success. Added role.");
      }
    }
 });

client.on('messageReactionRemove', (messageReaction, user) => {

  var roleName = messageReaction.emoji.name;
  var role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
  if(role)
  {
    var member = messageReaction.message.guild.members.find(member => member.id === user.id);
    if(member)
    {
      member.removeRole(role.id);
      console.log("Success. Removed role.");
    }
  }

});

client.login(config.token)