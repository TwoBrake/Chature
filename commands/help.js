const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays the help message."),

  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setTitle("Command Information")
        .setDescription(
          `Prefix: **/**\n\nHelp - Displays this message.\nOpen - Begins the open ticket prompt.\nSetsupportrole - Sets the role that will have access to the tickets.\nSetsupportcategory - Sets the category that tickets will be sent to upon opening.`
        )
        .setColor("Blue");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (e) {
      console.log(err);
      const errorEmbed = new EmbedBuilder()
        .setTitle("An error has occured, please try again.")
        .setColor("Red");
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
