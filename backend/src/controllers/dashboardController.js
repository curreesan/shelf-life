import Item from "../models/Item.js";
import Household from "../models/Household.js";
import { computeStatus } from "../utils/itemStatus.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const getStats = async (req, res) => {
  try {
    const items = await Item.find({ householdId: req.householdId });

    const counts = {
      fresh: 0,
      "expiring-soon": 0,
      expired: 0,
      used: 0,
      wasted: 0,
    };

    const perUser = {};

    for (const item of items) {
      const status =
        item.status === "used" || item.status === "wasted"
          ? item.status
          : computeStatus(item.expiryDate);

      counts[status]++;

      const userId = item.addedBy.toString();
      if (!perUser[userId]) perUser[userId] = { used: 0, wasted: 0 };
      if (status === "used") perUser[userId].used++;
      if (status === "wasted") perUser[userId].wasted++;
    }

    const total = items.length;
    const wasteScore = total ? (counts.used / total) * 100 : 0;

    const household = await Household.findById(req.householdId).populate(
      "members",
      "name email"
    );

    const leaderboard = household.members
      .map((member) => {
        const stats = perUser[member._id.toString()] || { used: 0, wasted: 0 };
        const decided = stats.used + stats.wasted;
        const score = decided ? (stats.used / decided) * 100 : 0;

        return {
          userId: member._id,
          name: member.name,
          used: stats.used,
          wasted: stats.wasted,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    res.status(200).json({ counts, wasteScore, leaderboard });
  } catch (err) {
    console.error(`Get Stats Error : ${err}`);
    res.status(400).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const getExpiring = async (req, res) => {
  try {
    const items = await Item.find({
      householdId: req.householdId,
      status: { $nin: ["used", "wasted"] },
    });

    const now = Date.now();
    const expiringSoon = items.filter((item) => {
      const hoursUntilExpiry = (new Date(item.expiryDate) - now) / (MS_PER_DAY / 24);
      return hoursUntilExpiry >= 0 && hoursUntilExpiry <= 24;
    });

    res.status(200).json({ items: expiringSoon });
  } catch (err) {
    console.error(`Get Expiring Error : ${err}`);
    res.status(400).json({ message: "Failed to fetch expiring items" });
  }
};
