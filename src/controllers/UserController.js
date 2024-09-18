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
