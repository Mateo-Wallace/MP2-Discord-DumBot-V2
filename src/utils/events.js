const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

const player = useMainPlayer();

player.events.on("error", (queue, error) => {
  console.log(`Error emitted from the queue ${error.message}`);
});

player.events.on("playerError", (queue, error) => {
  console.log(`Error emitted from the player ${error.message}`);
});

player.events.on("trackEnd", async (queue, track) => {
  if (!client.config.app.doubleSongError) {
    if (queue.tracks.length >= 1 && queue.tracks[0] !== track) {
      queue.insert(queue.tracks[0], 0);
    }
  }
});

player.events.on("playerPause", async (queue, track) => {});

player.events.on("playerStart", (queue, track) => {
  if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `Started playing ${track.title} in ${queue.metadata.channel.name} 🎧`,
      iconURL: track.requestedBy.avatarURL(),
    })
    .setColor("#13f857");

  const back = new ButtonBuilder()
    .setLabel("Back")
    .setCustomId(JSON.stringify({ ffb: "back" }))
    .setStyle("Primary");

  const skip = new ButtonBuilder()
    .setLabel("Skip")
    .setCustomId(JSON.stringify({ ffb: "skip" }))
    .setStyle("Primary");

  const resumepause = new ButtonBuilder()
    .setLabel("Resume & Pause")
    .setCustomId(JSON.stringify({ ffb: "resume&pause" }))
    .setStyle("Danger");

  const loop = new ButtonBuilder()
    .setLabel("Loop")
    .setCustomId(JSON.stringify({ ffb: "loop" }))
    .setStyle("Secondary");

  const queuebutton = new ButtonBuilder()
    .setLabel("Queue")
    .setCustomId(JSON.stringify({ ffb: "queue" }))
    .setStyle("Secondary");

  const row1 = new ActionRowBuilder().addComponents(
    back,
    loop,
    resumepause,
    queuebutton,
    skip
  );
  queue.metadata.channel.send({ embeds: [embed], components: [row1] });
});

player.events.on("audioTrackAdd", (queue, track) => {});

player.events.on("disconnect", (queue) => {
  queue.metadata.send(
    "I was manually disconnected from the voice channel, clearing queue... ❌"
  );
});

player.events.on("emptyChannel", (queue) => {
  queue.metadata.send(
    "Nobody is in the voice channel, leaving the voice channel... ❌"
  );
});

player.events.on("emptyQueue", (queue) => {
  queue.metadata.send("I finished reading the whole queue ✅");
});

player.events.on("audioTracksAdd", (queue, tracks) => {
  queue.metadata.send(`All the songs in playlist added into the queue ✅`);
});

player.events.on("connection", (queue) => {});
