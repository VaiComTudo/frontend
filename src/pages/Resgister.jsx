import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/explore");
    }, [navigate]);
}

export default Register