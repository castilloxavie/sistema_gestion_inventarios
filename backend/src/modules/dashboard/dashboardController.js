import DashBoardServices from "./dashboardServices.js"

class DashboardController {
    async getStart(req, res) {
        try {
            const data = await DashBoardServices.getStarts()
            console.log("data: ", data);
            return res.json(data)

        } catch (error) {
            console.log("error: ", error);
            return res.status(500).json({
                error: "error al obtener la estadistica",
                detalle: error.message
            })
        }
    }
}

export default new DashboardController()
