import { ApplicationCommandOptionType } from "discord.js";
import roll from "../../utils/repeatFunctions/roll.js";

export default {
  name: "roll",
  description: "Rolls dice based on user input",
  options: [
    {
      name: "dice",
      description: "The amount and type of dice you'd like to roll plus mods",
      type: ApplicationCommandOptionType.String,
    },
  ],
  enabled: client.config.enabledCommands.roll,

  async execute({ inter }) {
    await roll(inter, false);
  },
};
