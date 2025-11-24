import UserServices from "./userServices.js";

class UserController {
    
    async getAll(req, res){

        try {
            const users = await UserServices.getAll()
            console.log("Todos los usuarios:", users);
            res.json(users)

        } catch (error) {
            console.error("Error al obtener todos los usuarios:", error.message);
            res.status(400).json({
                error: error.message
            })
        }
    }


    async getById(req, res){

        try {
            const user = await UserServices.getById(req.params.id)
            console.log("Usuario encontrado por ID:", user);
            res.json(user)

        } catch (error) {
            console.error("Error al obtener usuario por ID:", error.message);
            res.status(400).json({
                error: error.message
            })
        }
    }


    async create(req, res){

        try {
            const user = await UserServices.create(req.body)
            console.log("Usuario creado correctamente:", user);
            res.json(user)

        } catch (error) {
            console.error("Error al crear usuario:", error.message);
            res.status(400).json({
                error: error.message
            })
        }
    }


    async update(req, res){

        try {
            const user = await UserServices.update(req.params.id, req.body)
            console.log("Usuario actualizado correctamente:", user);
            res.json(user)

        } catch (error) {
            console.error("Error al actualizar usuario:", error.message);
            res.status(400).json({
                error: error.message
            })
        }
    }


async delete(req, res){

        try {
            const user = await UserServices.delete(req.params.id)
            console.log("Usuario eliminado correctamente:", user);
            res.json(user)

        } catch (error) {
            console.error("Error al eliminar usuario:", error.message);
            res.status(400).json({
                error: error.message
            })
        }
    }
}

export default new UserController