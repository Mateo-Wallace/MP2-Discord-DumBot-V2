import { useHistory } from "discord-player";

export default async (inter, queue) => {
  const history = useHistory(inter.guildId);

  if (!queue || !queue.node.isPlaying()) {
    return inter.reply({
      content: `No music currently playing ${inter.member}... try again? ❌`,
      ephemeral: true,
    });
  }

  if (history.isEmpty()) {
    return inter.reply({
      content: `There was no music played before ${inter.member}... try again? ❌`,
      ephemeral: true,
    });
  }

  await history.previous();

  inter.reply({ content: `Playing the **previous** track ✅` });
};
