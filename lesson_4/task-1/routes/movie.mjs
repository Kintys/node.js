import { Router } from "express";
import MovieControllers from "../controllers/movie_controller.mjs";
import upload from "../utils/UploadFileManager.mjs";
import { render } from "ejs";

const router = Router();

router.get("/", MovieControllers.getMoviesList);

router.get("/add", MovieControllers.createForm);

router.get("/update/:id", MovieControllers.updateForm);

router.get("/:id", MovieControllers.getMovieDetails);

router.post("/", upload.single("img"), MovieControllers.addMovieToList);

router.post("/update/:id", upload.single("img"), MovieControllers.updateMovie);

router.delete("/delete", MovieControllers.deleteMovieFromList);
export default router;
