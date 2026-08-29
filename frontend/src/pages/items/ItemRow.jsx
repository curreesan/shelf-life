import { useState } from "react";

const CATEGORIES = ["produce", "dairy", "meat", "pantry", "frozen", "other"];

export function ItemRow({ item, onDelete, onMarkStatus, onSave, isActioning }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [quantity, setQuantity] = useState(item.quantity);
  const [expiryDate, setExpiryDate] = useState(item.expiryDate.slice(0, 10));

  const isFinal = item.status === "used" || item.status === "wasted";

  const handleSave = async () => {
    await onSave(item._id, { name, category, quantity, expiryDate });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setExpiryDate(item.expiryDate.slice(0, 10));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr>
        <td>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </td>
        <td>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </td>
        <td>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </td>
        <td>{item.status}</td>
        <td>
          <button disabled={isActioning} onClick={handleSave}>
            Save
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>{item.quantity}</td>
      <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
      <td className={`status status-${item.status}`}>{item.status}</td>
      <td>
        {!isFinal && (
          <>
            <button disabled={isActioning} onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button
              disabled={isActioning}
              onClick={() => onMarkStatus(item._id, "used")}
            >
              Mark Used
            </button>
            <button
              disabled={isActioning}
              onClick={() => onMarkStatus(item._id, "wasted")}
            >
              Mark Wasted
            </button>
          </>
        )}
        <button disabled={isActioning} onClick={() => onDelete(item._id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
