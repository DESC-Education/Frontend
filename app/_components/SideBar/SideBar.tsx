import styles from './SideBar.module.scss';


export default function SideBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.search}>
                <input type="text" placeholder="Поиск" className="text" />
            </div>
            {children}
        </div>
    );
};