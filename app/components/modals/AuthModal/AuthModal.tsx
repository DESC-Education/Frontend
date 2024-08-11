import { useState } from "react";

const AuthModal = () => {
    const [modalState, setModalState] = useState<
        "reg_client" | "reg_company" | "login" | "code"
    >("reg_client");
    return (
        <div>
            <p>AuthModal</p>
        </div>
    );
};

export default AuthModal;
