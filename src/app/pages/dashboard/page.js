import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken'; 
const SECRET_KEY = 'your_secret_key';

export default async function Dashboard() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return (
            <div>
                <p>Access denied. Please login first.</p>
            </div>
        );
    }

    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);

       return (
            <div>
                <h1>Welcome to the Dashboard</h1>
                <p>Hello, {decodedToken.name}!</p>
            </div>
        );
    } catch (error) {
        return (
            <div>
                <p>Invalid or expired token. Please login again.</p>
            </div>
        );
    }
}
