const { EmbedBuilder } = require("discord.js");
const { GuildQueuePlayerNode } = require("discord-player");

module.exports = {
  name: "save",
  description: "save the current track!",
  voiceChannel: true,
  musicCommand: true,
  enabled: client.config.enabledCommands.save,

  async execute({ inter }) {
    const queue = player.nodes.get(inter.guildId);

    if (!queue)
      return inter.reply({
        content: `No music currently playing ${inter.member}... try again ? ❌`,
        ephemeral: true,
      });

    const track = queue.currentTrack;

    const GuildQueue = new GuildQueuePlayerNode(queue);

    const timestamp = GuildQueue.getTimestamp();
    const trackDuration =
      timestamp.progress == "Infinity" ? "infinity (live)" : track.duration;

    inter.member
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`:arrow_forward: ${track.title}`)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .addFields(
              {
                name: ":hourglass: Duration:",
                value: `\`${trackDuration}\``,
                inline: true,
              },
              {
                name: "Song by:",
                value: `\`${track.author}\``,
                inline: true,
              },
              { name: "Progress ", value: `${GuildQueue.createProgressBar()}` },
              { name: "Requested by ", value: `${track.requestedBy}` }
            )
            .setFooter({
              text: `from the server ${inter.member.guild.name}`,
              iconURL: inter.member.guild.iconURL({ dynamic: false }),
            })
            .setColor("Red"),
        ],
      })
      .then(() => {
        return inter.reply({
          content: `I have sent you the title of the music by private messages ✅`,
          ephemeral: true,
        });
      })
      .catch((error) => {
        return inter.reply({
          content: `Unable to send you a private message... try again ? ❌`,
          ephemeral: true,
        });
      });
  },
};
