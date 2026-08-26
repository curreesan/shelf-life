import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendExpiryDigest = async (to, items) => {
  const itemLines = items
    .map((item) => `- ${item.name} (expires ${new Date(item.expiryDate).toLocaleString()})`)
    .join("\n");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "ShelfLife: items expiring within 24 hours",
    text: `The following items are expiring soon:\n\n${itemLines}`,
  });
};
