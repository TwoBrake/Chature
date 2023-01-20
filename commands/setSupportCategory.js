const fs = require("node:fs");

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  Guild,
  CategoryChannel,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setsupportcategory")
    .setDescription("Sets the ticket support category.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription("the category to set the ticket support")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.options.getChannel("category").type === 4) {
      fs.readFile(
        "./data/supportCategories.json",
        "utf8",
        function readFileCallback(error, data) {
          if (error) {
            throw error;
          }

          var object = JSON.parse(data);
          let toAdd = interaction.options.getChannel("category");
          let guild = interaction.guild.id;

          object[guild] = toAdd.id;
          //object.roles.push({"<id>": toAdd});

          var json = JSON.stringify(object, null, 2);

          fs.writeFile(
            "./data/supportCategories.json",
            json,
            "utf8",
            (error) => {
              if (error) {
                throw error;
              } else {
                console.log("Success!");
              }
            }
          );
        }
      );
      const embed = new EmbedBuilder()
        .setDescription(
          `**Successfully set ${interaction.options.getChannel(
            "category"
          )} to your ticket channel.**`
        )
        .setColor("Green");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setDescription("Error, you selected an object that is not a category.")
        .setColor("Red");
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
