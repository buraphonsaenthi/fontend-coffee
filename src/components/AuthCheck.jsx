import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function YourComponent() {
    const navigate = useNavigate();

    useEffect(() => {
        // เช็คว่ามี token ใน localStorage หรือไม่
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/enter");
        }
    }, [navigate]);

    return null;
}

export default YourComponent;
