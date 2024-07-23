import { router } from "../router";

const controller = require("../controllers/getData");

router.get("/getDoc", controller.getDoc);

module.exports = router;
