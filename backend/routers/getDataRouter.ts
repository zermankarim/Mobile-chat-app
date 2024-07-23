import { router } from "../router";

const controller = require("../controllers/getData");

router.get("/getDoc", controller.getDoc);
router.get("/getDocs", controller.getDocs);

module.exports = router;
