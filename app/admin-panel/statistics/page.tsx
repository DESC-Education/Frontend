"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import styles from "./page.module.scss";
import Button from "@/app/_components/ui/Button/Button";



const registrationData = [
    { date: "01-08", companies: 10, students: 30 },
    { date: "02-08", companies: 15, students: 40 },
    { date: "03-08", companies: 5, students: 20 },
    { date: "04-08", companies: 20, students: 50 },
];

const taskData = [
    { date: "01-08", published: 5, taken: 3, completed: 2 },
    { date: "02-08", published: 10, taken: 7, completed: 6 },
    { date: "03-08", published: 8, taken: 6, completed: 4 },
    { date: "04-08", published: 15, taken: 10, completed: 9 },
];

const onlineData = [
    { date: "01-08", online: 50 },
    { date: "02-08", online: 60 },
    { date: "03-08", online: 40 },
    { date: "04-08", online: 70 },
];



export default function Page() {
    return (
        <div className='container'>
            <div className={styles.statisticsContainer}>
                <h1 className="text fz36 fw600">Статистика</h1>

                <section className={styles.chartSection}>

                    {/* Регистрация */}
                    <div className={styles.chartContainer}>
                        <h3 className="text fz24 fw500">Регистрация (Компаний и Студентов)</h3>
                        <div className={styles.datePicker}>
                            <label htmlFor="date" className="text fz16">От</label>
                            <input type="date" className={styles.input} placeholder="Выберите дату" />
                            <label htmlFor="date" className="text fz16">До</label>
                            <input type="date" className={styles.input} placeholder="Выберите дату" />
                            <Button type="primary" className={styles.button}>Показать</Button>
                        </div>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={registrationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="companies" stroke="#8884d8" />
                                <Line type="monotone" dataKey="students" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Задания */}
                    <div className={styles.chartContainer}>
                        <h3 className="text fz24 fw500">Задания (Опубликованные, Взятые, Выполненные)</h3>
                        <div className={styles.datePicker}>
                            <label htmlFor="date" className="text fz16">От</label>
                            <input type="date" className={styles.input} placeholder="Выберите дату" />
                            <label htmlFor="date" className="text fz16">До</label>
                            <input type="date" className={styles.input} placeholder="Выберите дату" />
                            <Button type="primary" className={styles.button}>Показать</Button>
                        </div>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={taskData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="published" fill="#8884d8" />
                                <Bar dataKey="taken" fill="#82ca9d" />
                                <Bar dataKey="completed" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Текущий онлайн */}
                    <div className={styles.chartContainer}>
                        <h3 className="text fz24 fw500">Онлайн за период</h3>
                        <div className={styles.datePicker}>
                            <label htmlFor="date" className="text fz16">От</label>
                            <input type="date" className={styles.input} placeholder="Выберите дату" />
                            <label htmlFor="date" className="text fz16">До</label>
                            <input type="date" className={styles.input} placeholder="Выберите дату" />
                            <Button type="primary" className={styles.button}>Показать</Button>
                        </div>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={onlineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="online" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </div>
    );
}