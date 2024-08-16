"use client"

import { useState } from 'react';
import styles from './page.module.scss';
import Button from '../_components/ui/Button/Button';
import Input from '../_components/ui/Input/Input';
import { set } from 'zod';
import Select from '../_components/ui/Select/Select';
import SelectSearch from 'react-select-search';
import OrderCard from '../_components/OrderCard/OrderCard';

export default function JobExchangePage() {

    const [selectedFilters, setSelectedFilters] = useState<string[]>(["Веб-разработка", "Мобильная разработка", "Искусственный интеллект", "Базы данных", "Безопасность информации"]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["JavaScript", "Python", "Java", "C++", "C#"]);




    return (
        <div className={styles.container}>
            <h2 className='title fz48'>Биржа заданий</h2>
            <div className={styles.mainContainer}>
                <aside className={styles.sidebar}>
                    <div className={styles.filters}>
                        <h3 className='title'>Фильтры</h3>
                        <div className={styles.filterGroup}>
                            <h4 className='text gray fz20'>Технологии</h4>
                            {selectedFilters.map((filter) => (
                                <label className={styles.filterLabel}>
                                    <Input
                                        type="checkbox"
                                    />
                                    <p className='text fw500 fz20'>{filter}</p>
                                </label>
                            ))}
                        </div>
                        <div className={styles.filterGroup}>
                            <h4 className='text gray fz20'>Языки программирования</h4>
                            {selectedLanguages.map((language) => (
                                <label className={styles.filterLabel}>
                                    <Input
                                        type="checkbox"
                                    />
                                    <p className='text fw500 fz20'>{language}</p>
                                </label>
                            ))}
                        </div>
                        <div className={styles.buttons}>
                            <Button type="secondary" className={styles.applyButton}>Применить</Button>
                            <Button type="primary" className={styles.clearButton}>Очистить</Button>
                        </div>
                    </div>
                </aside>
                <main className={styles.mainContent}>
                    <div className={styles.topPanel}>

                        <div className={styles.sorting}>
                            <span className='title'>Сортировка:</span>
                            <SelectSearch options={[{ value: 'Рекомендации', name: 'Рекомендации' }, { value: 'Популярность', name: 'Популярность' }, { value: 'Дата подачи', name: 'Дата подачи' }]} />
                        </div>
                    </div>
                    <div className={styles.taskList}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className={styles.taskCard}>
                                <div className={styles.taskHeader}>
                                    <div className={styles.companyInfo}>
                                        <div className={styles.companyLogo}></div>
                                        <h4 className={styles.taskTitle}>Скомпилировать проект на Flutter под iOS</h4>
                                    </div>
                                    <span className={styles.taskStatus}>Просмотрено</span>
                                </div>
                                <div className={styles.taskDescription}>
                                    <p>
                                        Добрый день! Есть исходники проекта на Flutter. Нужно просто скомпилировать
                                        из этого приложение...{" "}
                                        <span className={styles.showMore}>Показать полностью</span>
                                    </p>
                                </div>
                                <div className={styles.taskFooter}>
                                    <span className={styles.deadline}>Срок выполнения: 3 дня</span>
                                    <span className={styles.timeLeft}>осталось 2 дн. 8 ч.</span>
                                    <button className={styles.proposeButton}>Предложить решение</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

        </div>
    );
}