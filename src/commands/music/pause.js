module.exports = {
  name: "pause",
  description: "pause the track",
  voiceChannel: true,
  musicCommand: true,
  enabled: client.config.enabledCommands.pause,

  execute({ inter, queue }) {
    if (!queue)
      return inter.reply({
        content: `No music currently playing ${inter.member}... try again ? ❌`,
        ephemeral: true,
      });

    if (queue.node.isPaused())
      return inter.reply({
        content: `The track is currently paused, ${inter.member}... try again ? ❌`,
        ephemeral: true,
      });

    const success = queue.node.pause();

    return inter.reply({
      content: success
        ? `Current music ${queue.currentTrack.title} paused ✅`
        : `Something went wrong ${inter.member}... try again ? ❌`,
    });
  },
};
