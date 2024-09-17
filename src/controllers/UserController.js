const AppError = require("../utils/AppError");
const { hash,compare } = require("bcryptjs");
const connection = require('../database');
const { sign } = require("jsonwebtoken");
const authConfig = require("../configs/auth");

class UserController {
    async create(request, response) {
        const { name, email, password } = request.body;

        try{

            const checkUsersExists = await connection('users').where({ email }).first();
    
            // Verificando email existente
            if (checkUsersExists) {
                return response.status(400).json({ message: "Este email já está em uso" });
                // throw new AppError("Este email já está em uso");
            }
    
            // Criptografando senha
            const hashedPassword = await hash(password, 8);
    
            // Cadastrando usuário
            await connection('users').insert({
                name,
                email,
                password: hashedPassword
            });
    
            return response.status(201).json();
        }catch (error){
            console.error(error);
            return response.status(500).send({ error: 'Nao foi possivel cadastrAAR' });
        }
    }

    async login(request, response) {
        const { email, password } = request.body;
    
        try {
            // Verificar se o usuário existe
            const user = await connection("users").where({ email }).first();
    
            if (!user) {
                throw new AppError("E-mail e/ou senha incorreta", 401);
            }
    
            // Verificar a correspondência da senha
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
    
            // Retornar resposta com o usuário e token
            return response.json({ user, token });
    
        } catch (error) {
            console.error('Error in login method:', error); // Adicione logs para rastreamento
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
            }
            // Tratar outros erros
            return response.status(500).json({
                status: "error",
                message: "Internal server error"
            });
        }
    }
    

    async update(request, response) {

        try{
            const { name, email, password, old_password } = request.body;
            const user_id = request.user.id;

            // Capturando usuário da tabela
            const user = await connection('users').where({ id: user_id }).first();

            if (!user) {
                throw new AppError("Usuário não encontrado");
            }

            // Verificando se o email já está em uso
            const checkUsersExists = await connection('users').where({ email }).first();

            if (checkUsersExists && checkUsersExists.id !== user.id) {
                throw new AppError("Email já em uso!");
            }

            // Atualizando nome e email
            const updatedUser = {
                name: name ?? user.name,
                email: email ?? user.email
            };

            // Verificando senha
            if (password) {
                if (!old_password) {
                    throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
                }

                const checkOldPassword = await compare(old_password, user.password);

                if (!checkOldPassword) {
                    throw new AppError("A senha antiga não confere");
                }

                updatedUser.password = await hash(password, 8);
            }

            // Atualizando na tabela de usuários
            await connection('users')
                .where({ id: user_id })
                .update({
                    ...updatedUser,
                    updated_at: connection.fn.now()
                });

            return response.status(200).json();
        }catch (error){
            console.error(error);
            return response.status(500).send({ error: 'Nao foi possivel cadastrar' });
        }
    }
}

module.exports = UserController;
