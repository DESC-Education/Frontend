import Image from "next/image";
import styles from "./Header.module.scss";
import Button from "../ui/Button/Button";
import AuthModal from "../modals/AuthModal/AuthModal";
import { useContext } from "react";
import { ModalContext } from "@/app/_context/ModalContext";

const Header = () => {
    const { showModal } = useContext(ModalContext);

    return (
        <div className={styles.header}>
            <Image
                src="/icons/headerLogo.svg"
                alt="Logo"
                width={125}
                height={53}
            />
            <nav>
                <div className={styles.navList}>
                    <Button
                        onClick={() =>
                            showModal({
                                content: (
                                    <AuthModal initModalState="login" />
                                ),
                            })
                        }
                        type="primary"
                    >
                        Вход
                    </Button>
                    <Button
                        onClick={() =>
                            showModal({
                                content: <AuthModal initModalState="reg" />,
                            })
                        }
                        type="secondary"
                    >
                        Регистрация
                    </Button>
                </div>
            </nav>
        </div>
    );

}

export default Header;
