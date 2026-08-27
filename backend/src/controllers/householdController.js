import Household from "../models/Household.js";
import User from "../models/User.js";
import Item from "../models/Item.js";

const generateInviteCode = () => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

export const createHousehold = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    const currentUser = await User.findById(userId);

    if (currentUser.householdId) {
      return res.status(400).json({ message: "Already part of a household" });
    }

    let household;
    let attempts = 0;

    while (!household) {
      try {
        household = await Household.create({
          name,
          inviteCode: generateInviteCode(),
          members: [userId],
          createdBy: userId,
        });
      } catch (err) {
        if (err.code === 11000 && attempts < 10) {
          attempts++;
          continue;
        }
        throw err;
      }
    }

    currentUser.householdId = household._id;
    await currentUser.save();

    res.status(201).json({ household });
  } catch (err) {
    console.error(`Create Household Error : ${err}`);
    res.status(400).json({ message: "Failed to create household" });
  }
};

export const joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.userId;

    const currentUser = await User.findById(userId);

    if (currentUser.householdId) {
      return res.status(400).json({ message: "Already part of a household" });
    }

    const household = await Household.findOne({
      inviteCode: inviteCode.toUpperCase(),
    });

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    household.members.push(userId);
    await household.save();

    currentUser.householdId = household._id;
    await currentUser.save();

    res.status(200).json({ household });
  } catch (err) {
    console.error(`Join Household Error : ${err}`);
    res.status(400).json({ message: "Failed to join household" });
  }
};

export const getMyHousehold = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser.householdId) {
      return res.status(404).json({ message: "Not part of a household" });
    }

    const household = await Household.findById(currentUser.householdId);

    res.status(200).json({ household });
  } catch (err) {
    console.error(`Get Household Error : ${err}`);
    res.status(400).json({ message: "Failed to fetch household" });
  }
};

export const leaveHousehold = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser.householdId) {
      return res.status(400).json({ message: "Not part of a household" });
    }

    const household = await Household.findById(currentUser.householdId);

    const remainingMembers = household.members.filter(
      (memberId) => !memberId.equals(req.userId)
    );

    currentUser.householdId = null;
    await currentUser.save();

    if (remainingMembers.length === 0) {
      await Item.deleteMany({ householdId: household._id });
      await household.deleteOne();

      return res.status(200).json({ action: "deleted", message: "Household deleted" });
    }

    household.members = remainingMembers;

    if (household.createdBy.equals(req.userId)) {
      household.createdBy = remainingMembers[0];
    }

    await household.save();

    res.status(200).json({
      action: "left",
      message: "Left household",
      newAdmin: household.createdBy,
    });
  } catch (err) {
    console.error(`Leave Household Error : ${err}`);
    res.status(400).json({ message: "Failed to leave household" });
  }
};

export const getMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const household = await Household.findById(id).populate(
      "members",
      "name email"
    );

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    const isMember = household.members.some((member) =>
      member._id.equals(req.userId)
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not a member of this household" });
    }

    res.status(200).json({ members: household.members });
  } catch (err) {
    console.error(`Get Members Error : ${err}`);
    res.status(400).json({ message: "Failed to fetch members" });
  }
};
