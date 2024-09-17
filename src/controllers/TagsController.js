const connection = require("../database")

class TagsController {
    async index(request, response){
        const user_id = request.user.id;

        const tags = await connection("tags")
            .select("name")
            .where({ user_id })
            .groupBy("name");       

        return response.json(tags)
    }
}


module.exports = TagsController;