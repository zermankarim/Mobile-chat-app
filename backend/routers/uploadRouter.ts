import { uploadNewAvatar } from "../controllers/upload";
import { router } from "../router";
const upload = require("../middleware/file");

router.post("/newAvatar", upload.single("avatar"), uploadNewAvatar);

module.exports = router;
