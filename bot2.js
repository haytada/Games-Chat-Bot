const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.on('ready', () => {
  console.log("I am online!")
});

//NEW MEMBER
client.on('guildMemberAdd', member => {
    console.log('User' + member.user.tag + 'has joined the server!');
    var role = member.guild.roles.find('name', 'Members');
    member.addRole(role);
    member.send("Welcome to the server, you can type !help to get a list of commands to use the Bot for, alternatively read the instructions in the Welcome channel for access to game specific channels!");
  });

client.on('message', async message => { //ALL COMMANDS IN HERE
    if(message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase(); 

    if(command === "say") {
      if(!message.member.roles.some(r =>["Admin"].includes(r.name)))
      return message.reply("Sorry, you don't have permission to use this command!")
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send(sayMessage);
    }

    if(command === "ping") {
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    if(command === "purge") {
      if(!message.member.roles.some(r =>["Admin"].includes(r.name)))
      return message.reply("Sorry, you don't have permission to use this command!")
        const deleteCount = parseInt(args[0], 10);
            if(!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to purge");
            const fetched = await message.channel.fetchMessages({limit: deleteCount});
            message.channel.bulkDelete(fetched)
            .catch(error => message.reply("Couldn't delete messages because of: ${error}"));
    }

    if(command === "help") {
        message.reply("```Bot Commands:\n\n!ping - Check the latency of the bot and the API.\n!psnstatus - Check the status of the PlayStation Network.```")
    }

    if(command === "kick") {
        if(!message.member.roles.some(r=>["Admin"].includes(r.name)))
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

    if (command === "psnstatus") {
      var getJSON = require('get-json')
      const m = await message.channel.send("Pulling PlayStation Network status, please wait...");
      getJSON("https://status.playstation.com/data/statuses/region/SCEE/GB/statusIndicator.json").then(function(response) {
          var status;
          switch(response.statusType) {
              case "OK": status = "Online"; break;
              default: status = response.statusType; break;
          }
          m.edit("PlayStation Network Status: **" + status + "**.");
      }).catch(function(error) {
          m.edit("Unable to pull PlayStation Network Status.").then(msg => msg.delete(10000));
      });
      return;
  }

});

//DERRR
client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content.includes ("der")) {
    message.channel.send("derrrrrrrrrr")
  }
 });

//ROLE ADD/REMOVE REACTION
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
        member.addRole(role.id)
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

//ACTIVITY
const activities_list = [
  "Rocket League",
  "Cyberpunk 2077", 
  "Rust",
  "Rainbow Six Siege",
  "Star Wars Jedi: Fallen Order",
  "The Last of Us Part II",
  "Death Stranding",
  "DOOM Eternal",
  "Borderlands 3",
  "Gears 5",
  "FIFA 20"
  ]; 

client.on('ready', () => {
  setInterval(() => {
      const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); 
      client.user.setActivity(activities_list[index]);
  }, 120000);
});

client.login(config.token)