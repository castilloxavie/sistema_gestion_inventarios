import bcrypt from "bcryptjs";
import { User } from "../../models/UserModels.js";

class UserServices {

    //obtener todos los usuarios
    async getAll () {
        
        return await User.findAll({
            attributes: {exclude: ["password"]}
        })
    }

    //obtener un usuario por id
    async getById (id) {
        return await User.findByPk(id, {
            attributes: {exclude: ["password"]}
        })
    }

    //crear usuario
    async create(data){
        const{nombre, apellido, email, password, rol} = data

        const isExsist = await User.findOne({where: {email}})
        if(isExsist) throw new Error("El correo ya existe registrado con este correo")

        // Encriptar contraseña por seguridad
        const hashearPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            nombre,
            apellido,
            email,
            password: hashearPassword,
            rol
        })
        console.log("Usuario creado correctamente");
        return user
    }

    //actualizar usuario
    async update(id, data){

        const user = await User.findByPk(id)
        if(!user) throw new Error("Usuario no encontrado para actualizar")

        await user.update(data)
        console.log("Usuario actualizado correctamente");
        return user
    }

    //eliminar usuario
    async delete(id){

        const user = await User.findByPk(id)
        if(!user) throw new Error("Usuario no en cntrado para eliminar")

        await user.destroy()
        console.log("Usuario eliminado correctamente");
        return user
    }
}

export default new UserServices()
