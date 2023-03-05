import {runDb} from "./repositories/db";
import {app} from "./appSettings";

const port = process.env.PORT || 5000

export const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()