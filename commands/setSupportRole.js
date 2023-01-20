const fs = require("node:fs");

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  InteractionResponse,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setsupportrole")
    .setDescription("Sets the ticket support role.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("the role to set the ticket support")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.options.getRole("role").name === "@everyone") {
      const errorEmbed = new EmbedBuilder()
        .setDescription(
          "**Error, you cannot set everyone as the support ticket role.**"
        )
        .setColor("Red");
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    } else {
      fs.readFile(
        "./data/supportRoles.json",
        "utf8",
        function readFileCallback(error, data) {
          if (error) {
            throw error;
          }

          var object = JSON.parse(data);
          let toAdd = interaction.options.getRole("role");
          let guild = interaction.guild.id;

          object[guild] = toAdd.id;
          //object.roles.push({"<id>": toAdd});

          var json = JSON.stringify(object, null, 2);

          fs.writeFile("./data/supportRoles.json", json, "utf8", (error) => {
            if (error) {
              throw error;
            } else {
              console.log("Success!");
            }
          });
        }
      );
      const embed = new EmbedBuilder()
        .setDescription(
          `**Successfully set ${interaction.options.getRole(
            "role"
          )} as the support role.**`
        )
        .setColor("Green");
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
