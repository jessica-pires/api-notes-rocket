const path = require("path");

//biblioteca multer
const multer = require("multer");
const crypto = require("crypto");


//ARMAZENAMENTO DA IMAGEM temporaria
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");


//ARMAZENAMENTO DA IMAGEM PERMANENTE
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MULTER = {
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename(request,file, callback){
            const fileHash = crypto.randomBytes(10).toLocaleString("hex");//Gera um hash aleatório de 10 bytes, convertido para uma string hexadecimal. Isso cria um nome único para o arquivo.

            const fileName = `${fileHash}-${file.originalname}`;// O nome final do arquivo é composto pelo hash gerado e pelo nome original do arquivo, garantindo que o nome seja único e preservando o nome original.

            callback(null, fileName);

            // return callback(callback, fileName);
        }
    })
}

module.exports = {
    TMP_FOLDER,
    UPLOADS_FOLDER,
    MULTER
}