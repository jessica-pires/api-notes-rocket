const  { Router} = require("express");
const notesRoutes = Router();

const authenticated = require('../middlewares/authenticated');

const NotesController = require("../controllers/NotesController");
const notesController = new NotesController();
notesRoutes.use(authenticated);


notesRoutes.get("/",  notesController.index);
notesRoutes.post("/", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete('/:id', notesController.delete);

module.exports  = notesRoutes;