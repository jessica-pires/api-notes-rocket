const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {

    //metodo responsavel por mover o arquivo de uma pasta temp para uma permanente
    async saveFile(file){
        await fs.promises.rename(
            path.resolve(uploadConfig.TMP_FOLDER, file),
            path.resolve(uploadConfig.UPLOADS_FOLDER, file)
        )

        return file;
    }

    //delete
    async deleteFile(file) {
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);
        try{
            await fs.promises.stat(filePath);

        }catch {
            return;

        }

        await fs.promises.unlink(filePath)
    }

}

module.exports = DiskStorage;