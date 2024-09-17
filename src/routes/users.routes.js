const  { Router} = require("express");
const multer = require("multer");

const authenticated = require("../middlewares/authenticated")
const uploadConfig = require("../configs/upload");

const UsersControllers = require("../controllers/UserController");
const AvatarUserController = require("../controllers/AvatarUserController");



const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER)



const usersControllers = new UsersControllers();
const avatarUserController = new AvatarUserController();

usersRoutes.post('/', usersControllers.create);
usersRoutes.put('/', authenticated, usersControllers.update);
usersRoutes.patch('/avatar',authenticated, upload.single("avatar"), avatarUserController.update);

module.exports  = usersRoutes;