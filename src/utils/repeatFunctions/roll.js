import roll from '@mateo-wallace/rpg-dice-js';

export default async (inter, hidden) => {
  try {
    let userInput = inter.options.getString('dice');
    userInput = userInput ? userInput : '';
    // short format roll
    const r = roll(userInput, { isBoldCrit: true });

    if (r.ok) {
      await inter.reply({
        content: `${inter.user} :game_die: ${
          r.input ? '\n **Input**: ' + r.input + ' \n' : '\n'
        } **Result**: ${r.result} \n **Total**: ${
          r.total
        }     **Crit Total**: ${r.totalCrit}`,
        ephemeral: hidden ? true : false,
      });
    } else {
      await inter.reply({
        content: `Invalid input executing ${inter.commandName}`,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
    await inter.reply({
      content: `FATAL ERROR executing ${inter.commandName}`,
      ephemeral: true,
    });
  }
};
