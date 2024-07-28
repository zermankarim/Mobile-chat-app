import path from "path";
import fs from "fs";
import { Chat, User } from "../models";

export const uploadNewAvatar = async (req, res, next) => {
  try {
    const base64Image = req.body.image;
    const uploadType: "avatar" | "message" = req.body.type;

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    let fileName: string;
    let uploadDir: string;
    let relativePath: string;

    if (uploadType === "avatar") {
      const userId = req.body.userId;
      fileName = new Date().toISOString() + "-avatar.jpg";
      uploadDir = path.resolve(__dirname, "..", "public", "avatars", userId);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      relativePath = `public/avatars/${userId}/${fileName}`;

      const user = await User.findOne({ _id: userId });
      user.avatars.push(relativePath);
      await user.save();
      return res.json({ success: true, data: user });
    }

    if (uploadType === "message") {
      const chatId = req.body.chatId;
      console.log(req.body);
      fileName = new Date().toISOString() + "-message.jpg";
      uploadDir = path.resolve(
        __dirname,
        "..",
        "public",
        "chat",
        "messages",
        chatId
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      relativePath = `public/chat/messages/${chatId}/${fileName}`;
    }

    fs.writeFile(relativePath, base64Data, "base64", (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.json({ success: false, message: err.message });
      } else {
        if (uploadType === "message") {
          res.json({ success: true, relativePath });
        }
      }
    });
  } catch (e) {
    console.error(`Error during saving avatar: ${e.message}`);
    return res.json({
      success: true,
      message: `Error during saving avatar: ${e.message}`,
    });
  }
};
