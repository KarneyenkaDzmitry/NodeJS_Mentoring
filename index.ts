import { service } from './src/service/service';
import * as dotenv from "dotenv";
dotenv.config();
/**
 *  App Configuration
 */
const port: number = parseInt(process.env.SERVICE_PORT as string, 10) || 3000;

/**
 * Server Activation
 */
service.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});