import { date } from "zod";
import styles from "./page.module.scss";
import OrderCard from "@/app/_components/OrderCard/OrderCard";
import { ICompany } from "@/app/_types";


const histories = [{
    date: "15.12.2024",
    orders: { title: "Заказ1", description: "Описание заказа на Flutter и Firebase но с примерами в обоих языках и еще технических документах", deadline: "10.03.2024", reminingTime: "2 дня", company: { isVerified: true, name: "Компания1", logoImg: { id: "1", name: "logo1", path: "/images/userImage1.png", type: "image/png" } } as ICompany, isViewed: false }
},
{
    date: "15.12.2024",
    orders: { title: "Заказ2", description: "Описание заказа", deadline: "10.03.2024", reminingTime: "2 дня", company: { isVerified: true, name: "Компания2", logoImg: { id: "2", name: "logo2", path: "/images/userImage2.png", type: "image/png" } } as ICompany, isViewed: false }
},
]

export default function Home() {
    return (
        <div className={styles.container}>
            {histories.map((history, index) => (
                <OrderCard
                    key={index}
                    title={history.orders.title}
                    description={history.orders.description}
                    deadline={history.orders.deadline}
                    reminingTime={history.orders.reminingTime}
                    company={history.orders.company}
                    isViewed={history.orders.isViewed}
                />
            ))}
        </div>
    );
}