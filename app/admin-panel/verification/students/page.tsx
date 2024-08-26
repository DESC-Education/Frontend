import SelectionDots from '@/app/_components/SelectionDots/SelectionDots';
import styles from './page.module.scss';


export default function StudentPage() {
    return (
        <div className={styles.selectPage}>
            <SelectionDots title="Выберите студента" />
        </div>
    );
}