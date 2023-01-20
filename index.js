const {
  Client,
  GatewayIntentBits,
  Collection,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType,
  codeBlock,
} = require("discord.js");
const { channel } = require("node:diagnostics_channel");
const fs = require("node:fs");
const path = require("node:path");
const { token, clientId, devServerId } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
console.log("created collection");
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
console.log("read command files");

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}
console.log("got command files");

var ticketsOpen = 0;

fs.readFile(
  "./data/ticketsOpen",
  "utf8",
  function readFileCallback(error, data) {
    if (error) {
      throw error;
    }

    ticketsOpen = Number(data)
})

client.once("ready", () => {
  console.log("the bot is ready with no errors yet");
  client.user.setPresence({
    activities: [
      { name: `${ticketsOpen} ticket(s).`, type: ActivityType.Listening },
    ],
  });
  setInterval(() => {
    client.user.setPresence({
      activities: [
        { name: `${ticketsOpen} ticket(s).`, type: ActivityType.Listening },
      ],
    });
  }, 10000);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log("slash command");
  } else if (interaction.isButton()) {
    if (interaction.customId == "closeTicket") {
      interaction.channel.delete();
      fs.readFile(
        "./data/ticketsOpen",
        "utf8",
        function readFileCallback(error, data) {
          if (error) {
            throw error;
          }

          data = Number(data)
          data -= 1
          data = data.toString()

          fs.writeFile("./data/ticketsOpen", data, "utf8", (error) => {
            if (error) {
              throw error;
            } else {
              console.log("Success!");
            }
          });
      })
      ticketsOpen--;
      console.log(ticketsOpen);
      await interaction.user.send(`Closed ${interaction.channel.name}.`);
    }
    console.log("button");
  }
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "openTicketForm") {
      let supportCategoryFile = fs.readFileSync(
        "./data/supportCategories.json",
        "utf8"
      );
      let supportRolesFile = fs.readFileSync(
        "./data/supportRoles.json",
        "utf8"
      );

      supportCategoryFile = JSON.parse(supportCategoryFile);
      supportRolesFile = JSON.parse(supportRolesFile);

      let ticketsCategoryId = supportCategoryFile[interaction.guild.id];
      let supportRoleId = supportRolesFile[interaction.guild.id];

      if (!ticketsCategoryId || !supportRoleId) {
        await interaction.reply(
          "The server administrator has not setup a ticket category or support role yet."
        );
        return;
      }

      //console.log(interaction.guild.channels.find(channel => channel.name === "ticket-" + interaction.user.id))
      if (
        interaction.guild.channels.cache.find(
          (channel) => channel.name === "ticket-" + interaction.user.id
        )
      ) {
        const embed = new EmbedBuilder().setDescription("**Error, you already have a ticket open.**").setColor("Red");
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      let randomId = interaction.user.id;
      let ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${randomId}`,
        type: ChannelType.GuildText,
        topic: `ticket-${randomId} opened by: ${interaction.user.tag}.`,
        parent: ticketsCategoryId,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
          {
            id: supportRoleId,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
        ],
      });
      fs.readFile(
        "./data/ticketsOpen",
        "utf8",
        function readFileCallback(error, data) {
          if (error) {
            throw error;
          }

          data = Number(data)
          data += 1
          data = data.toString()

          fs.writeFile("./data/ticketsOpen", data, "utf8", (error) => {
            if (error) {
              throw error;
            } else {
              console.log("Success!");
            }
          });
      })
      ticketsOpen++;
      console.log(ticketsOpen);
      const embed = new EmbedBuilder()
        .setTitle("New Ticket")
        .setColor("Green")
        .setDescription(
          `Opened by: ${interaction.user}\nTicket Info: ${codeBlock(
            interaction.fields.getTextInputValue("ticketInfo")
          )}`
        );
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("closeTicket")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger)
      );
      console.log("ticket opened");
      ticketChannel.send({ embeds: [embed], components: [row] });
      await interaction.reply({
        content: `Your ticket has been submitted (${ticketChannel}).`,
        ephemeral: true,
      });
    }
  }
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  result += characters.charAt(
    Math.floor(Math.random() * characters.length - 10)
  );
  length--;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
