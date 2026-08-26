import Item from "../models/Item.js";
import Household from "../models/Household.js";
import { sendExpiryDigest } from "../utils/mailer.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const runExpiryDigest = async () => {
  const now = Date.now();

  const expiringItems = await Item.find({
    status: { $nin: ["used", "wasted"] },
    expiryDate: { $gte: new Date(now), $lte: new Date(now + MS_PER_DAY) },
  });

  if (expiringItems.length === 0) return;

  const itemsByHousehold = {};
  for (const item of expiringItems) {
    const householdId = item.householdId.toString();
    if (!itemsByHousehold[householdId]) itemsByHousehold[householdId] = [];
    itemsByHousehold[householdId].push(item);
  }

  for (const [householdId, items] of Object.entries(itemsByHousehold)) {
    const household = await Household.findById(householdId).populate(
      "members",
      "email"
    );

    for (const member of household.members) {
      await sendExpiryDigest(member.email, items);
    }
  }
};
