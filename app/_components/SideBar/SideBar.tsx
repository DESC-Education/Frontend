import styles from './SideBar.module.scss';


export default function SideBar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.sidebar}>
            {children}
        </div>
    );
};