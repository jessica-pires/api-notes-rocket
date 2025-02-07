require("dotenv/config");
require("express-async-errors");
const express = require('express');
const AppError = require('./src/utils/AppError')
const app = express();
const routes = require("./src/routes/");
const cors = require('cors')

const uploadConfig = require('./src/configs/upload')
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER) )

app.use(cors());
app.use(routes);


app.use((error, request, response, next ) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }
    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    })

})
const PORT = process.env.PORT || 3333;
app.listen( PORT, () => console.log(`Server is runing on Port ${PORT}`));