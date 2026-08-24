import Item from "../models/Item.js";

export const checkItemExists = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item || !item.householdId.equals(req.householdId)) {
      return res.status(404).json({ message: "Item not found" });
    }

    req.item = item;
    next();
  } catch (err) {
    console.error(`Check Item Exists Error : ${err}`);
    res.status(400).json({ message: "Failed to resolve item" });
  }
};

export const checkOwnership = (req, res, next) => {
  const isCreator = req.item.addedBy.equals(req.userId);
  const isAdmin = req.household.createdBy.equals(req.userId);

  if (!isCreator && !isAdmin) {
    return res.status(403).json({ message: "Not allowed to modify this item" });
  }

  next();
};
