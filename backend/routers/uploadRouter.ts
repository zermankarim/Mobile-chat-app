import { uploadNewAvatar } from "../controllers/upload";
import { router } from "../router";

router.post(
  "/newAvatar",
  uploadNewAvatar
);

module.exports = router;
