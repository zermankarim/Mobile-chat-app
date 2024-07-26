import path from "path";
import fs from "fs";
import { User } from "../models";

export const uploadNewAvatar = async (req, res, next) => {
  try {
    const base64Image = req.body.image;
    const userId = req.body.userId;

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const fileName = new Date().toISOString() + "-avatar.jpg";

    const avatarsDir = path.resolve(
      __dirname,
      "..",
      "public",
      "avatars",
      userId
    );
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }

    const relativePath = `public/avatars/${userId}/${fileName}`;

    fs.writeFile(relativePath, base64Data, "base64", (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return res.json({ success: false, message: err.message });
      }
    });

    const user = await User.findOne({ _id: userId });
    user.avatars.push(relativePath);
    await user.save();
    console.log(user)
    return res.json({ success: true, data: user });
  } catch (e) {
    console.error(`Error during saving avatar: ${e.message}`);
    return res.json({
      success: true,
      message: `Error during saving avatar: ${e.message}`,
    });
  }
};
