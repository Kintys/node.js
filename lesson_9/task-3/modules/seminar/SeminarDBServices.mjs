import MongooseCRUDManager from "../MongooseCRUDManager.mjs";
import Seminar from "./Seminar.mjs";

class SeminarDBServices extends MongooseCRUDManager {}

export default new SeminarDBServices(Seminar);
