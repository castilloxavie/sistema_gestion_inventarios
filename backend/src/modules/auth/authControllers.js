import authServices from "./authServices.js";

class AuthController {

    async register(req, res) {
        try {
            //crear usuario correctamente
            const user = await authServices.register(req.body)
            console.log("Usuario creado correctamente");
            const { password, ...userWithoutPassword } = user.toJSON();
            return res.status(201).json({
                message: "Usuario creado correctamente",
                user: userWithoutPassword
            })

        } catch (error) {
            console.log("Error al crear el Usuario", error.message);
            return res.status(400).json({
                message: error.message
            })
        }
    }

    async login(req, res){
        try {
            //validar el login
            const { token, user } = await authServices.login(req.body)
            console.log("Usuario Logueado correctamente");
            const { password, ...userWithoutPassword } = user.toJSON();
            return res.status(200).json({
                data: { token, user: userWithoutPassword }
            })


        } catch (error) {
            console.error("Error al procesar el login", error.message);
            return res.status(400).json({
                message: error.message
            })
        }
    }
}

export default new AuthController()