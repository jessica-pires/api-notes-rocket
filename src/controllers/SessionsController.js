const AppError = require("../utils/AppError");
const { hash,compare } = require("bcryptjs");
const connection = require('../database');
const { sign } = require("jsonwebtoken");
const authConfig = require("../configs/auth");

class SessionsController {
    async login(request, response) {
        const { email, password } = request.body;
    
        try {
            // Verificar se o usuário existe
            const user = await connection("users").where({ email }).first();
    
            if (!user) {
                throw new AppError("E-mail e/ou senha incorreta", 401);
            }
    
            // Verificar senha
            const passwordMatched = await compare(password, user.password);
            if (!passwordMatched) {
                throw new AppError("E-mail e/ou senha incorreta", 401);
            }
    
            // Gerar token JWT
            const { secret, expiresIn } = authConfig.jwt;
            const token = sign({}, secret, {
                subject: String(user.id),
                expiresIn
            });
            return response.json({ user, token });
    
        } catch (error) {
            console.error('Erro no login:', error);
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
            }
    
            return response.status(500).json({
                status: "error",
                message: "Internal server error"
            });
        }
    }
    
}

module.exports = SessionsController;