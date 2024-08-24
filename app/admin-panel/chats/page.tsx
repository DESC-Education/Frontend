import ChatUser from "@/app/_components/ChatItem/ChatItem";
import styles from "./page.module.scss";
import classNames from "classnames";
import Link from "next/link";
import SelectionDots from "@/app/_components/SelectionDots/SelectionDots";


export default function Page() {
    return (
        <SelectionDots title="Выберите чат" />
    );
}