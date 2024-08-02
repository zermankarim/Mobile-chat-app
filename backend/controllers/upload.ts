import path from "path";
import fs from "fs";
import { User } from "../models";

export const uploadNewAvatar = async (req, res, next) => {
  try {
    const base64Image = req.body.image;
    if (!base64Image) {
      return res
        .status(400)
        .json({ success: false, message: "No image provided" });
    }

    const uploadType: "avatar" | "message" = req.body.type;
    const uploadPath =
      uploadType === "avatar"
        ? path.resolve(__dirname, "..", "public", "avatars", req.body.userId)
        : path.resolve(
            __dirname,
            "..",
            "public",
            "chat",
            "messages",
            req.body.chatId
          );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileName =
      new Date().toISOString() +
      (uploadType === "avatar" ? "-avatar.jpg" : "-message.jpg");
    const relativePath = `public/${
      uploadType === "avatar"
        ? `avatars/${req.body.userId}/${fileName}`
        : `chat/messages/${req.body.chatId}/${fileName}`
    }`;

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    fs.writeFile(relativePath, base64Data, "base64", async (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error saving file" });
      }

      if (uploadType === "avatar") {
        const userId = req.body.userId;
        const user = await User.findOne({ _id: userId });
        if (!user)
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        user.avatars.push(relativePath);
        await user.save();
        return res.json({ success: true, data: user });
      } else if (uploadType === "message") {
        return res.json({ success: true, relativePath });
      }
    });
  } catch (e) {
    console.error(`Error during saving file: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: `Error during saving file: ${e.message}`,
    });
  }
};
