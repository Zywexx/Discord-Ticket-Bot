const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Colors,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');
const transcript = require('discord-html-transcripts');
const config = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if (!interaction.isButton()) return;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('claim').setLabel('Claim').setEmoji('📩').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('close').setLabel('Close').setEmoji('🗑').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('transcript').setLabel('Transcript').setEmoji('📁').setStyle(ButtonStyle.Primary)
        );

        try {
            const category = config.parent;
            const roleStaff = interaction.guild.roles.cache.get(config.roleStaffId);
            const logChannel = client.channels.cache.get(config.logChannel);

            if (!roleStaff) {
                return interaction.reply({
                    content: ":x: Destek yetkili rolü bulunamadı. Lütfen `config.json` dosyasındaki `roleStaffId` bilgisini kontrol edin.",
                    ephemeral: true
                });
            }

            if (interaction.customId === "close") {
                if (!interaction.channel.name.startsWith('ticket-')) {
                    return interaction.reply({
                        content: ":x: Bu komut sadece ticket kanallarında kullanılabilir.",
                        ephemeral: true
                    });
                }

                const transcriptFile = await transcript.createTranscript(interaction.channel);
                await logChannel.send({
                    embeds: [new EmbedBuilder()
                        .setDescription(`📁 Ticket kapatıldı: ${interaction.channel.name}`)
                        .setFooter({ text: "Ticket Support" })
                        .setColor(Colors.Blurple)
                    ],
                    files: [transcriptFile]
                });
                await interaction.channel.delete();

            } else if (interaction.customId === "claim") {
                if (!interaction.channel.name.startsWith('ticket-')) {
                    return interaction.reply({
                        content: ":x: Bu komut sadece ticket kanallarında kullanılabilir.",
                        ephemeral: true
                    });
                }

                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`🎫 Ticket ${interaction.user} tarafından alındı`)
                        .setFooter({ text: "Ticket Support" })
                        .setColor(Colors.Blurple)
                    ]
                });

            } else if (interaction.customId === "transcript") {
                if (!interaction.channel.name.startsWith('ticket-')) {
                    return interaction.reply({
                        content: ":x: Bu komut sadece ticket kanallarında kullanılabilir.",
                        ephemeral: true
                    });
                }

                const transcriptFile = await transcript.createTranscript(interaction.channel);
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription('📁 Transkript oluşturuldu')
                        .setFooter({ text: "Ticket Support" })
                        .setColor(Colors.Blurple)
                    ],
                    ephemeral: true
                });
                await logChannel.send({
                    embeds: [new EmbedBuilder()
                        .setDescription(`📁 Ticket transkripti: ${interaction.channel.name}`)
                        .setFooter({ text: "Ticket Support" })
                        .setColor(Colors.Blurple)
                    ],
                    files: [transcriptFile]
                });

            } else if (["staff", "answer", "other"].includes(interaction.customId)) {
                const existingChannel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id && c.name.startsWith('ticket-'));
                if (existingChannel) {
                    return interaction.reply({
                        content: `:x: Zaten açık bir ticket'ınız var: <#${existingChannel.id}>`,
                        ephemeral: true
                    });
                }

                const channelName = `ticket-${interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g, '')}`.slice(0, 100);
                
                const embedInfo = {
                    staff: {
                        title: "Yetkili Talebi",
                        description: "Lütfen talebinizi ayrıntılı şekilde belirtin, yetkili en doğru yanıtı verebilmesi için."
                    },
                    answer: {
                        title: "Soru-Cevap",
                        description: "Lütfen sorunuzu detaylı şekilde yazın ki yetkili size en doğru şekilde yardımcı olabilsin."
                    },
                    other: {
                        title: "Destek Talebi",
                        description: "Lütfen yaşadığınız sorunu detaylı şekilde açıklayın, yetkili size en doğru şekilde yardımcı olacaktır."
                    }
                }[interaction.customId];

                const channel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: category,
                    topic: interaction.user.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        },
                        {
                            id: roleStaff.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        }
                    ]
                });

                await channel.send({
                    content: `${interaction.user}`,
                    embeds: [new EmbedBuilder()
                        .setTitle(embedInfo.title)
                        .setDescription(embedInfo.description)
                        .setFooter({ text: "Ticket Support" })
                        .setColor(Colors.Blurple)
                    ],
                    components: [row]
                });

                await interaction.reply({
                    content: `✅ Ticket'ınız başarıyla açıldı: <#${channel.id}>`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Ticket sisteminde hata:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: ':x: Ticket işlemi sırasında bir hata oluştu.',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: ':x: Ticket işlemi sırasında bir hata oluştu.',
                    ephemeral: true
                });
            }
        }
    }
};