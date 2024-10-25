import fs from "fs";

class DataFileManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.unicode = "utf8";
    }

    saveData(dataArr) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(dataArr), this.unicode);
        } catch (error) {
            throw new Error(`Error saving data:${error.message}`);
        }
    }
    loadData() {
        try {
            const data = fs.readFileSync(this.filePath, this.unicode);
            return JSON.parse(data);
        } catch (error) {
            if (error.code === "ENOENT") {
                this.saveData([]);
                return [];
            } else {
                throw new Error(`Error loading data: ${error.message}`);
            }
        }
    }
    addItem(itemData) {
        try {
            if (!itemData) {
                throw new Error(`Item not found!`);
            }
            const data = this.loadData();
            data.push(itemData);
            this.saveData(data);
        } catch (error) {
            throw new Error(`Error while adding!`);
        }
    }
    getItemById(id) {
        try {
            if (!id) throw new Error("Id not found!");
            const data = this.loadData();
            const item = data.find((item) => item.id == id);
            if (!item) {
                throw new Error(`Item with id (${id}) not found`);
            }
            return item;
        } catch (error) {
            throw new Error(`Error searching for an object: ${error.message}`);
        }
    }
    updateItemById(id, updatedProperties) {
        try {
            if (!id || !updatedProperties) {
                throw new Error(`id(${id}) or item(${updatedProperties}) not found!`);
            }
            const data = this.loadData();
            const index = data.findIndex((item) => item.id == id);
            if (index !== -1) {
                data[index] = { ...data[index], ...updatedProperties };
                this.saveData(data);
                return true;
            } else {
                throw new Error(`Item with id ${id} not found`);
            }
        } catch (err) {
            throw new Error(`Error updating an object: ${err.message}`);
        }
    }
    deleteItemById(id) {
        try {
            if (!id) throw new Error("Id not found!");
            const data = this.loadData();
            const newData = data.filter((item) => item.id != id);
            if (newData.length === data.length) {
                throw new Error(`Item with id  ${id} not found`);
            }
            this.saveData(newData);
        } catch (err) {
            throw new Error(`Error deleting an object: ${err.message}`);
        }
    }
}
export default DataFileManager;
