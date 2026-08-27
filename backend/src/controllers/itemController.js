import Item from "../models/Item.js";
import { computeStatus } from "../utils/itemStatus.js";

export const createItem = async (req, res) => {
  try {
    const { name, category, quantity, expiryDate } = req.body;

    if (!name || !expiryDate) {
      return res.status(400).json({ message: "name and expiryDate are required" });
    }

    if (isNaN(new Date(expiryDate).getTime())) {
      return res.status(400).json({ message: "expiryDate is invalid" });
    }

    const item = await Item.create({
      householdId: req.householdId,
      addedBy: req.userId,
      name,
      category,
      quantity,
      expiryDate,
      status: computeStatus(expiryDate),
    });

    res.status(201).json({ item });
  } catch (err) {
    console.error(`Create Item Error : ${err}`);
    res.status(400).json({ message: "Failed to create item" });
  }
};

export const getItems = async (req, res) => {
  try {
    const { category, status, sort } = req.query;

    const query = { householdId: req.householdId };
    if (category) query.category = category;

    const allowedSorts = ["expiryDate", "-expiryDate"];
    const sortOption = allowedSorts.includes(sort) ? sort : "expiryDate";

    const items = await Item.find(query).sort(sortOption);

    const itemsWithStatus = items.map((item) => {
      const currentStatus =
        item.status === "used" || item.status === "wasted"
          ? item.status
          : computeStatus(item.expiryDate);

      return { ...item.toObject(), status: currentStatus };
    });

    const filtered = status
      ? itemsWithStatus.filter((item) => item.status === status)
      : itemsWithStatus;

    res.status(200).json({ items: filtered });
  } catch (err) {
    console.error(`Get Items Error : ${err}`);
    res.status(400).json({ message: "Failed to fetch items" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = req.item;

    if (item.status === "used" || item.status === "wasted") {
      return res.status(400).json({ message: "Cannot edit a used or wasted item" });
    }

    const { name, category, quantity, expiryDate } = req.body;

    if (expiryDate !== undefined && isNaN(new Date(expiryDate).getTime())) {
      return res.status(400).json({ message: "expiryDate is invalid" });
    }

    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;
    if (quantity !== undefined) item.quantity = quantity;
    if (expiryDate !== undefined) item.expiryDate = expiryDate;

    await item.save();

    res.status(200).json({ item });
  } catch (err) {
    console.error(`Update Item Error : ${err}`);
    res.status(400).json({ message: "Failed to update item" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const item = req.item;
    const { status } = req.body;

    if (status !== "used" && status !== "wasted") {
      return res.status(400).json({ message: "status must be 'used' or 'wasted'" });
    }

    if (item.status === "used" || item.status === "wasted") {
      return res.status(400).json({ message: "Item status is already final" });
    }

    item.status = status;
    await item.save();

    res.status(200).json({ item });
  } catch (err) {
    console.error(`Update Status Error : ${err}`);
    res.status(400).json({ message: "Failed to update item status" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await req.item.deleteOne();

    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    console.error(`Delete Item Error : ${err}`);
    res.status(400).json({ message: "Failed to delete item" });
  }
};
