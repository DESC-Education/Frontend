import styles from './page.module.scss';


export default function TaskPage() {


    const task = {
        id: "1",
        title: "Разработка сиси масиси",
        description: "Описание задания 1",
        deadline: "10.10.2022",
        createdat: "10.10.2022",
        catogoryId: "1",
        isVerified: false,
        isSuspicious: true,
        isVisible: true,
        files: [
            {
                id: "1",
                name: "Документ 1",
                path: "path",
                type: "pdf",
            },
            {
                id: "2",
                name: "Документ 2",
                path: "path",
                type: "pdf",
            },
        ],
    }


    return (
        <div className={styles.task}>
            <div>Описание таска</div>
        </div>
    );
}   