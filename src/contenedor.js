const fs = require("fs");

class Contenedor {
    constructor(fileName, keys) {
        this._filename = fileName;
        this._keys = [...keys, "id"];
        this._readFileOrCreateNewOne();
    }

    _validateKeysExist(newData) {

        const objectKeys = Object.keys(newData);
        let exists = true;

        objectKeys.forEach((key) => {
            if (!this._keys.includes(key)) {
                exists = false;
            }
        })
        return exists;
    }

    async _readFileOrCreateNewOne() {
        try {
            await fs.promises.readFile(this._filename, "utf-8");
        } catch (error) {
            console.log(
                "erro al leer archivos"
            );
        }
    }

    async _createEmptyFile() {
        fs.writeFile(this._filename, "[]", (error) => {
            error
                ?
                console.log(error) :
                console.log("archivo creado");
        });
    }

    async getById(id) {
        id = Number(id);
        try {
            const data = await this.getData();
            const parsedData = JSON.parse(data);

            return parsedData.find((producto) => producto.id === id);
        } catch (error) {
            console.log(
                ` error al obtener el elemento por su id(${id})`
            );
        }
    }

    async deleteById(id) {
        try {
            id = Number(id);
            const data = await this.getData();
            const parsedData = JSON.parse(data);
            const objectIdToBeRemoved = parsedData.find(
                (producto) => producto.id === id
            );

            if (objectIdToBeRemoved) {
                const index = parsedData.indexOf(objectIdToBeRemoved);
                parsedData.splice(index, 1);
                await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
                return true;
            } else {
                console.log(`ID ${id} no esxiste`);
                return null;
            }
        } catch (error) {
            console.log(
                `error al intentar eliminar archivo con id(${id})`
            );
        }
    }

    async updateById(id, newData) {
        if (this._validateKeysExist(newData)) {
            try {
                id = Number(id);
                const data = await this.getData();
                const parsedData = JSON.parse(data);
                const objectIdToBeUpdated = parsedData.find(
                    (producto) => producto.id === id
                );
                if (objectIdToBeUpdated) {
                    const index = parsedData.indexOf(objectIdToBeUpdated);
                    const { title, price, description, code, image, stock } = newData;

                    parsedData[index]['title'] = title;
                    parsedData[index]['price'] = price;
                    parsedData[index]['description'] = description;
                    parsedData[index]['code'] = code;
                    parsedData[index]['image'] = image;
                    parsedData[index]['stock'] = stock;
                    await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
                    return true;
                } else {
                    console.log(`ID ${id} no existe`);
                    return null;
                }

            } catch (error) {
                `error al actualizar el producto (${id})`
            }
        } else {
            return false;
        }


    }

    async addToArrayById(id, objectToAdd) {
        if (this._validateKeysExist(objectToAdd)) {
            try {
                id = Number(id);
                const data = await this.getData();
                const parsedData = JSON.parse(data);
                const objectIdToBeUpdated = parsedData.find(
                    (producto) => producto.id === id
                );
                if (objectIdToBeUpdated) {
                    const index = parsedData.indexOf(objectIdToBeUpdated);
                    const valorActual = parsedData[index];
                    const currentProducts = valorActual['products']
                    currentProducts.push(objectToAdd.products)

                    await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
                    return true;
                } else {
                    console.log(`ID ${id} No existe`);
                    return false;
                }

            } catch (error) {
                `error al actualizar ID (${id})`
            }
        } else {
            return false;
        }
    }

    async removeFromArrayById(id, objectToRemoveId, keyName) {
        try {
            id = Number(id);
            const data = await this.getData();
            const parsedData = JSON.parse(data);

            const objectIdToBeUpdated = parsedData.find(
                (producto) => producto.id === id
            );

            if (objectIdToBeUpdated) {
                const index = parsedData.indexOf(objectIdToBeUpdated);

                const valorActual = parsedData[index][keyName];
                let indexToBeRemoved = -1;
                valorActual.forEach((element, indexE) => {
                    if (element.id == objectToRemoveId) {
                        indexToBeRemoved = indexE
                    }
                })
                const newArray = [...valorActual];

                if (indexToBeRemoved > -1) {
                    console.log(indexToBeRemoved)
                    newArray.splice(indexToBeRemoved, 1)
                }

                parsedData[index][keyName] = newArray;
                await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
                return true;
            } else {
                console.log(`ID ${id} no existe`);
                return false;
            }

        } catch (error) {
            `error en el ID (${id})`
        }

    }

    async save(object) {
        if (this._validateKeysExist(object)) {
            try {
                const allData = await this.getData();
                const parsedData = JSON.parse(allData);

                object.id = parsedData.length + 1;
                parsedData.push(object);

                await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
                return object.id;
            } catch (error) {
                console.log(
                    `error a guardar`
                );
            }
        } else {
            return false;
        }

    }

    async deleteAll() {
        try {
            await this._createEmptyFile();
        } catch (error) {
            console.log(
                `error al eliminar todos los productos`
            );
        }
    }

    async getData() {
        const data = await fs.promises.readFile(this._filename, "utf-8");
        return data;
    }

    async getAll() {
        const data = await this.getData();
        return JSON.parse(data);
    }
}

module.exports = Contenedor;