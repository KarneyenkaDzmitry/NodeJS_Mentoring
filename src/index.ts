import { service } from './service/service';
import * as dotenv from "dotenv";
dotenv.config();

const port: number = parseInt(process.env.SERVICE_PORT as string, 10) || 3000;

service.listen(port, () => {
    console.log(`The application is listening at http://localhost:${port}`)
});