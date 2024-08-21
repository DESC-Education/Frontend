import classNames from 'classnames';
import Accordion from '../_components/ui/Accordion/Accordion';
import styles from './page.module.scss';





const Page = () => {
    return (
        <div className={classNames(styles.container, "container")}>
            <div className={classNames(styles.title, "title")}>Вопросы и ответы</div>
            <div className={styles.accordions}>
                <Accordion index={1} title={"Какие услуги предоставляет веб-студия?"} content={"Timperdiet gravida scelerisque odio nunc. Eget felis, odio bibendum quis eget sit lorem donec diam. Volutpat sed orci turpis sit dolor est a pretium eget. Vitae turpis orci vel tellus cursus lorem vestibulum quis eu. Ut commodo, eget lorem venenatis urna."} />
                <Accordion index={2} title={"Как заказать услугу?"} content={"Timperdiet gravida scelerisque odio nunc. Eget felis, odio bibendum quis eget sit lorem donec diam. Volutpat sed orci turpis sit dolor est a pretium eget. Vitae turpis orci vel tellus cursus lorem vestibulum quis eu. Ut commodo, eget lorem venenatis urna."} />
                <Accordion index={3} title={"Как?"} content={"Timperdiet gravida scelerisque odio nunc. Eget felis, odio bibendum quis eget sit lorem donec diam. Volutpat sed orci turpis sit dolor est a pretium eget. Vitae turpis orci vel tellus cursus lorem vestibulum quis eu. Ut commodo, eget lorem venenatis urna."} />
            </div>
        </div>
    );
};

export default Page;
