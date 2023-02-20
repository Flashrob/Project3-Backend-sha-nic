const express = require("express");
const router = express.Router();

class UserRouter {
  constructor(userController, express) {
    this.controller = userController;
    this.express = express;
  }

  routes = () => {
    let router = this.express.Router();
    router.get("/", this.controller.getAllUsers.bind(this.controller));
    router.get("/:userId", this.controller.getOne.bind(this.controller));
    router.post("/", this.controller.addOne.bind(this.controller));
    // router.post("/:userId/address", )
    // can include a router to create an addressß
    return router;
  };
}

module.exports = UserRouter;
