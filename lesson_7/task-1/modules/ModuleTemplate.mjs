// import { v4 as uuidv4 } from "uuid";
// import DataFileManager from "../utils/DataFileManager.mjs";
// class ModuleTemplate {
//     constructor(moduleTitle = `Data`, dataPath) {
//         this.moduleTitle = moduleTitle;
//         this.data = new DataFileManager(dataPath);

//         // Можливо виглядає погано, думаю як це покращити....

//         this[`load${this.moduleTitle}List`] = this.loadList.bind(this);
//         this[`addNew${this.moduleTitle}ToList`] = this.addToList.bind(this);
//         this[`get${this.moduleTitle}ById`] = this.getById.bind(this);
//         this[`update${this.moduleTitle}Data`] = this.updateData.bind(this);
//         this[`delete${this.moduleTitle}ById`] = this.deleteById.bind(this);
//     }
//     loadList() {
//         try {
//             return this.data.loadData();
//         } catch (err) {
//             throw new Error(err.message);
//         }
//     }

//     addToList(carData) {
//         try {
//             this.data.addItem({ id: uuidv4(), ...carData });
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }

//     getById(id) {
//         try {
//             return this.data.getItemById(id);
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }

//     updateData(id, updateProps) {
//         try {
//             this.data.updateItemById(id, updateProps);
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }

//     deleteById(id) {
//         try {
//             this.data.deleteItemById(id);
//         } catch (error) {
//             throw new Error(error.message);
//         }
//     }
// }
// export default ModuleTemplate;
