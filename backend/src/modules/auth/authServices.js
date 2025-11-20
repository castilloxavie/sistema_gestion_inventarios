import bcrypt  from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../../models/UserModels.js"
import dotenv from "dotenv"
dotenv.config()

class AuthServices {
    async register(data){
        const {nombre, apellido, email, password, rol = "vendedor"} = data

        //buscar si ya existe
        const userExist = await User.findOne({where: {email}})
        if(userExist) throw new Error(("El correo ya esta registrado"));

        //contraseña hashear
        const hashearPassword = await bcrypt.hash(password, 10)

        //crear un usuario
        const user = await User.create({
            nombre,
            apellido,
            email,
            password: hashearPassword,
            rol
        })
        return user
    }

    async login(data) {
        const{email, password} = data

        //busca el usuario
        const user = await User.findOne({where: {email}})
        if(!user) throw new Error("Usuario o Contraseña no encontrado")
        

        //valida la contraseña
        const isValidate = await bcrypt.compare(password, user.password)
        if(!isValidate) throw new Error("Usuario o Contraseña no encontrada")
        
        //generar token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rol: user.rol
            },
            process.env.SECURITY_TOKEN_JWT,
            {expiresIn: "1d"}
        )
        return {token, user}
    }
}

export default new AuthServices()