import { render } from "ejs";
import MoviesModule from "../modules/MoviesModule.mjs";

class MovieControllers {
    static getMoviesList(req, res) {
        const movieList = MoviesModule.loadMoviesList();
        res.render("movies/movie-list", {
            movies: movieList,
        });
    }
    static createForm(req, res) {
        res.render("movies/movie-form");
    }

    static getMovieDetails(req, res) {
        const id = req.params.id;
        const movie = MoviesModule.getMovieById(id);
        res.render("movies/movie-details", {
            movie,
        });
    }
    static addMovieToList(req, res) {
        if (!req.file || !req.body) {
            return res.status(400).send("No file uploaded.");
        }
        const movieData = MovieControllers.getNewMovieData(req);

        MoviesModule.addNewMovie(movieData);
        res.redirect("/movie");
    }

    static updateForm(req, res) {
        const id = req.params.id;
        const movie = MoviesModule.getMovieById(id);
        res.render("movies/movie-update", {
            movie,
        });
    }

    static updateMovie(req, res) {
        const id = req.params.id;
        const movieData = MovieControllers.getNewMovieData(req);
        MoviesModule.updateMovieData(id, movieData);
        res.redirect("/movie");
    }

    static getNewMovieData(req) {
        const { title, data, description } = req.body;
        const imageUrl = MovieControllers.getUrlImage(req);
        return {
            title,
            releaseDate: data,
            overview: description,
            poster_path: imageUrl,
        };
    }
    static getUrlImage(req) {
        const image = req.file;
        return `${req.protocol}://${req.get("host")}/uploads/${image.filename}`;
    }

    static deleteMovieFromList(req, res) {
        const id = req.body.id;
        MoviesModule.deleteMovieById(id);
        res.status(200).send("ok");
    }
}
export default MovieControllers;
