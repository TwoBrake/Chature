const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Opens a ticket.")
    .setDMPermission(false),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("openTicketForm")
      .setTitle("Ticket Submission");
    const ticketInfo = new TextInputBuilder()
      .setCustomId("ticketInfo")
      .setLabel("Describe your reason for opening this ticket.")
      .setStyle(TextInputStyle.Paragraph);
    const actionRow = new ActionRowBuilder().addComponents(ticketInfo);
    modal.addComponents(actionRow);
    interaction.showModal(modal);
  },
};
