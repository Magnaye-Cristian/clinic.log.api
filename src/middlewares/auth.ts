import jwt from "jsonwebtoken";
import process from "process";


const auth = (req: any, res: any, next: any) => {

    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        const privateKey = process.env.CLINIC_LOG_JWT_PRIVATE_KEY as string;
        const decoded = jwt.verify(token, privateKey);
        req.people = decoded;
        next();
    } catch (e) {
        console.log(e)
        res.status(400).send('Invalid token.')
    }
}
export default auth;