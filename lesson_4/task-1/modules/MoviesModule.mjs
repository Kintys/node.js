import DataFileManager from "../utils/DataFileManager.mjs";
import setting from "../setting.mjs";
import { v4 as uuidv4 } from "uuid";
const movieData = new DataFileManager(setting.dataPath);

// При написанні модулів,доречно використовувати Агрегацію чи краще Композицію ?

class MoviesModule {
    static loadMoviesList() {
        try {
            return movieData.loadData();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static getMovieById(id) {
        try {
            return movieData.getItemById(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static addNewMovie(movie) {
        try {
            movieData.addItem({ ...movie, id: uuidv4() });
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static updateMovieData(id, updateProps) {
        try {
            movieData.updateItemById(id, updateProps);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static deleteMovieById(id) {
        try {
            movieData.deleteItemById(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
export default MoviesModule;
