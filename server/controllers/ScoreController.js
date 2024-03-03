import { Score } from "../models/index.js";

class ScoreController {
  static calculatePoints = (position) => {
    switch (position) {
      case 1:
        return 10;
      case 2:
        return 8;
      case 3:
        return 5;
      case 4:
        return 3;
      default:
        return 0;
    }
  };

  static assignPoints = async (eventId) => {
    try {
      const eventScores = await Score.findAll({ where: { eventId } });
      const sortedScores = eventScores.sort((a, b) => b.value - a.value);

      sortedScores.forEach(async (score, index) => {
        const points = ScoreController.calculatePoints(index + 1);
        await score.update({ points });
      });

      return sortedScores;
    } catch (error) {
      console.error("Error assigning points:", error);
      throw new Error("Failed to assign points");
    }
  };
}

export default ScoreController;
