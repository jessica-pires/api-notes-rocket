const connection = require("../database");

class NotesController {
    async create(request, response) {
        const { title, description, tags, links } = request.body;
        const user_id = request.user.id;

        try {
            // Inserir a nota
            const [notas_id] = await connection("notas").insert({
                title,
                description,
                user_id
            });

            // Preparar e inserir links associados
            if (links && links.length) {
                const linksInsert = links.map(link => ({
                    notas_id,
                    url: link
                }));
                await connection("links").insert(linksInsert);
            }

            // Preparar e inserir tags associadas
            if (tags && tags.length) {
                const tagsInsert = tags.map(name => ({
                    notas_id,
                    name,
                    user_id
                }));
                await connection("tags").insert(tagsInsert);
            }

            return response.status(201).json({ message: "Nota criada com sucesso" });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Erro ao criar a nota" });
        }
    }

    async show(request, response) {
        const { id } = request.params;
    
        // Obtendo a nota
        const note = await connection("notas").where({ id }).first();
    
        // Obtendo as tags relacionadas à nota
        const tags = await connection("tags").where({ notas_id: id }).orderBy("name");
    
        // Obtendo os links relacionados à nota
        const links = await connection("links").where({ notas_id: id }).orderBy("created_at");
    
        // Retornando a nota com suas tags e links associados
        return response.json({
            ...note,
            tags,
            links
        });
    }

    async index(request, response){
        const { title, filterTags } = request.query;
        const user_id = request.user.id
        

        if (!user_id) {
            return response.status(400).json({ error: 'user_id é necessário' });
        }

        let notas;

        if (filterTags && filterTags.length > 0) {
            notas = await connection("notas")
                .select([
                    "notas.id",
                    "notas.title",
                    "notas.user_id",
                ])
                .where("notas.user_id", user_id)
                .where('title', 'like', `%${title}%`)
                .innerJoin("tags", "notas.id", "tags.notas_id")
                .whereIn("tags.name", filterTags)
                .orderBy("notas.title");
        } else {
            notas = await connection("notas")
                .where({ user_id })
                .where('title', 'like', `%${title}%`)
                .orderBy("title");
        }

        const userTags = await connection("tags").where({ user_id });
        const notesWithTags = notas.map(note => {
            const noteTags = userTags.filter(tag => tag.notas_id === note.id);

            return {
                ...note,
                tags: noteTags
            };
        });

        return response.json(notesWithTags);

    }
    async delete(request, response) {
        const { id } = request.params;
    
        // Verifica se a nota 
        const note = await connection("notas").where({ id }).first();
    
        if (!note) {
            return response.status(404).json({ error: "Nota não encontrada." });
        }
        await connection("notas").where({ id }).delete();
        return response.json({ message: "Nota deletada com sucesso!" });
    }
    
    
}

module.exports = NotesController;
