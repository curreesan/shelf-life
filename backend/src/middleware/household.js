import User from "../models/User.js";
import Household from "../models/Household.js";

export const attachHouseholdToReqObj = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser.householdId) {
      return res.status(400).json({ message: "Not part of a household" });
    }

    const household = await Household.findById(currentUser.householdId);

    req.household = household;
    req.householdId = household._id;

    next();
  } catch (err) {
    console.error(`Attach Household Error : ${err}`);
    res.status(400).json({ message: "Failed to resolve household" });
  }
};
