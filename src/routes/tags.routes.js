const  { Router} = require("express");
const TagsController = require("../controllers/TagsController");
const authenticated = require("../middlewares/authenticated");

const tagRoutes = Router();

const tagsControllers = new TagsController();

tagRoutes.get("/", authenticated, tagsControllers.index);

module.exports  = tagRoutes;