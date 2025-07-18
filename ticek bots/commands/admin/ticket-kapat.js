const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require('discord.js');
const config = require('../../config.json'); // konumuna göre düzelt

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-kapat')
    .setDescription('Açık olan ticket\'i kapatır.'),

  async execute(interaction) {
    const channel = interaction.channel;

    // Sadece ticket kanallarında çalışır
    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: 'Bu komut sadece ticket kanallarında kullanılabilir.', ephemeral: true });
    }

    const member = interaction.member;
    const ticketOwnerId = channel.topic; // ticket sahibinin ID'si channel.topic'te tutuluyor
    const hasStaffRole = member.roles.cache.has(config.roleStaffId);
    const isOwner = interaction.user.id === ticketOwnerId;

    // Ne yetkili, ne de sahibi değilse engelle
    if (!hasStaffRole && !isOwner) {
      return interaction.reply({ content: 'Bu ticket\'i kapatma yetkin yok.', ephemeral: true });
    }

    await interaction.reply('Ticket 5 saniye içinde kapatılıyor...');

    // Log kanalına bilgi gönder
    const logChannel = interaction.guild.channels.cache.get(config.logChannel);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle('🎟️ Ticket Kapatıldı')
        .setDescription(`Ticket: <#${channel.id}> kapatıldı.\nKapanış yapan: <@${interaction.user.id}>`)
        .setColor(0xff5555)
        .setTimestamp();
      logChannel.send({ embeds: [logEmbed] }).catch(console.error);
    }

    // Kanalı 5 saniye sonra sil
    setTimeout(() => {
      channel.delete().catch(console.error);
    }, 5000);
  }
};
