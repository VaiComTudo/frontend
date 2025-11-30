import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useUser();

    useEffect(() => {
        // Set a hardcoded user for testing
        const hardcodedUser = {
            id: "123e4567-e89b-12d3-a456-426614174000",
            birthdate: "1990-01-01",
            rating: 4.5,
            account: {
                email: "test@example.com",
                name: "Test User"
            }
        };
        
        setUser(hardcodedUser);
        navigate("/explore");
    }, [navigate, setUser]);

    return null;
}

export default Login