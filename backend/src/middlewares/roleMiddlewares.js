export function roleMiddleware(rolesPermitidos = []){
    return(req, res, next) => {
        const rolUsuario = req.user.rol
        
        if(!rolesPermitidos.includes(rolUsuario)){
            console.log("Rol del usuario:", rolUsuario);
            return res.status(403).json({
                error: "No tienes permisos para acceder a este recurso"
            })
        }
        next()
    }
}