const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const SteamAPI = require('steamapi');
const steam = new SteamAPI(config.steamtoken);

client.on('ready', () => {
  console.log("I am online!")
});

//NEW MEMBER
client.on('guildMemberAdd', member => {
    console.log('User' + member.user.tag + 'has joined the server!');
    var role = member.guild.roles.find('name', 'Members');
    member.addRole(role);
    member.send("Welcome to the server, you can type !help to get a list of commands to use the Bot for, alternatively read the instructions in the Welcome channel for access to game specific channels!");
    member.guild.channel.get("421989895020609539").send(member + " has just joined!").catch(error => console.log("Channel not found."));
  });

client.on('message', async message => { //ALL COMMANDS IN HERE
    if(message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase(); 

    if(command === "say") {
      if(!message.member.roles.some(r =>["Admin"].includes(r.name)))
      return message.reply("Sorry, you don't have permission to use this command!")
        const sayMessage = args.join(" ");
        message.channel.send(sayMessage);
        message.delete().catch(O_o=>{});
    }

    if(command === "dm") {
      if(!message.member.roles.some(r =>["Admin"].includes(r.name)))
      return message.reply("Sorry, you don't have permission to use this command!")
        const sayMessage = args.slice(1).join(" ");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        member.send(sayMessage);
        message.delete().catch(O_o=>{});
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
      message.delete();
          const embed = new Discord.RichEmbed();
            embed.setAuthor(client.user.username, client.user.displayAvatarURL);
            embed.setTitle("Bot Commands");
            embed.setDescription("A list of commands for use with the bot");
            embed.setThumbnail(client.user.displayAvatarURL);
            embed.addField("!invite", "Display the invite link for this server to send to your friends.")
            embed.addField("!psnstatus", "Check the status of the PlayStation Network.");
            embed.addField("!ping", "Will check the latency between the bot and the API.");
            embed.addField("!steam (username)", "Return information on the Steam user.")
            embed.setColor('ff3ff5');
            embed.setTimestamp(Date.now());
          const embedAdmin = new Discord.RichEmbed();
            embedAdmin.setAuthor(client.user.username, client.user.displayAvatarURL);
            embedAdmin.setTitle("Bot Commands");
            embedAdmin.setDescription("Full list of commands for use with the bot including admin restricted commands.");
            embedAdmin.setThumbnail(client.user.displayAvatarURL);
            embedAdmin.addField("!announce Title; Body; URL; Link to image", "Creates an announcement. Make sure that all of the arguments are seperated by a semi-colon and THEN a space. You can choose to omit certain parameters but there still needs to be a semi-colon and a space. *e.g. This is the Title; This is the body; This is the URL; This is the image* **OR** *This is the Title; ; This is the URL would display an announcement with just a clickable title with no image and no text in the body.*")
            embedAdmin.addField("!dm @user", "Send a DM to the tagged user as the bot.")
            embedAdmin.addField("!kick", "Kick the tagged user from the server. You can type a reason afterwards.")
            embedAdmin.addField("!invite", "Display the invite link for this server to send to your friends.")
            embedAdmin.addField("!purge <2-100>", "Delete the specified amount of messages from the channel.")
            embedAdmin.addField("!steam (username)", "Return information on the Steam user.")
            embedAdmin.addField("!ping", "Will check the latency between the bot and the API.");
            embedAdmin.addField("!psnstatus", "Check the status of the PlayStation Network.");
            embedAdmin.addField("!say", "Make the bot say what you type afterwards.")
            embedAdmin.setColor('ff3ff5');
            embedAdmin.setTimestamp(Date.now());
        if(!message.member.roles.some(r=>["Admin"].includes(r.name)))
        return message.channel.send(embed);

        message.channel.send(embed);
        message.member.send(embedAdmin);
        await message.reply("I can see that you're admin. Please check your messages for additional commands as well as the ones below.");

    }

    if(command === "invite") {
      message.delete();
      const invite = "https://discord.gg/GrQgQTS"
      const embed = new Discord.RichEmbed();

      embed.setAuthor(message.member.user.username, message.member.user.displayAvatarURL);
      embed.setThumbnail(client.user.displayAvatarURL);
      embed.addField("Copy the below:", "Join me in Games Chat: " + invite);
      embed.setTimestamp(Date.now());
      embed.setColor("7289DA")

      message.channel.send({embed});
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
      message.delete();
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

  if (command === "steam") {
    message.delete();
    let steamid = args[0]
    const embed = new Discord.RichEmbed();
    steam.resolve('https://steamcommunity.com/id/' + steamid)
    .then(id => steam.getUserSummary(id))
    .then(summary => { 

      console.log(summary);
        embed.setDescription("Steam info for " + args[0]);
        embed.setAuthor(summary.realName + " (" + summary.nickname + ")", summary.avatar.small);
        embed.setThumbnail("https://www.macupdate.com/images/icons256/33972.png");
        embed.addField("Steam Username: ", summary.nickname);
        embed.addField("URL", summary.url);
        embed.addField("Currently Playing ", summary.gameExtraInfo)
        embed.setImage(summary.avatar.medium);
        embed.setColor("00adee")

        message.channel.send(embed);
    }).catch(error => message.channel.send(steamid + (" cannot be found. Make sure you are checking a username and not a nickname and try again."))
    
    )}

});

//DERRRR


//ANNOUNCE
client.on('message', async message => { 
  if(message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase(); 
  if(command === "announce") {
    if(!message.member.roles.some(r =>["Admin"].includes(r.name)))
      return message.reply("Sorry, you don't have permission to use this command!")
      const afterCommand = args.join(" ");
      const splitAgain = afterCommand.split("; ");
      const title = splitAgain[0];
      const body = splitAgain[1];
      const imgurl = splitAgain[3];
      const link = splitAgain[2];
      const embed = new Discord.RichEmbed();
        message.delete();
        embed.setAuthor(client.user.username, client.user.displayAvatarURL);
        embed.setThumbnail("https://www.pngrepo.com/download/244901/announcement-shout.png")
        embed.setTitle(title); //1
        embed.setDescription(body); //2
        embed.setURL(link); //3
        embed.setColor("ff0000");
        embed.setTimestamp(Date.now());
        embed.setFooter("Announced by: " + message.member.user.username, message.member.user.displayAvatarURL)
        embed.setImage(imgurl); //4
      message.channel.send(embed).catch(error => message.channel.send("Parameters were wrong, try again."))
  }
});

//ROLE ADD/REMOVE REACTION
 client.on('raw', event => {
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

                                                    //ROLE ADD/REMOVE REACTION                       TEST SERVER
                                                    client.on('raw', event => {
                                                      const eventName = event.t;
                                                      if(eventName === 'MESSAGE_REACTION_ADD')
                                                      {
                                                          if(event.d.message_id === '589452503897341966')
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
                                                        if(event.d.message_id === '589452503897341966')
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