"use client";

import { useState } from "react";
import { 
    getVacancies, 
    createVacancy, 
    getVacancyById, 
    updateVacancy, 
    deleteVacancy,
    getCompanyVacancies,
    applyToVacancy,
    getVacancyApplications,
    getApplicationById,
    evaluateApplication,
    getStudentApplications,
    IVacancy
} from "../_http/API/vacancyApi";

function TestVacanciesApiPage() {
    const [results, setResults] = useState<any>({});
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const testEndpoint = async (name: string, testFunction: () => Promise<any>) => {
        setLoading(name);
        setError(null);
        
        try {
            const result = await testFunction();
            setResults((prev: any) => ({
                ...prev,
                [name]: result
            }));
        } catch (err) {
            setError(`${name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(null);
        }
    };

    const testGetVacancies = () => testEndpoint('getVacancies', () => getVacancies());
    
    const testCreateVacancy = () => testEndpoint('createVacancy', () => 
        createVacancy({
            title: "Тестовая вакансия",
            description: "Описание тестовой вакансии",
            requirements: "Требования к кандидату",
            responsibilities: "Обязанности",
            salary_min: 50000,
            salary_max: 80000,
            salary_currency: "RUB",
            location: "Москва",
            remote_work: false,
            categoryId: "1"
        })
    );

    const testGetVacancyById = () => testEndpoint('getVacancyById', () => 
        getVacancyById("1")
    );

    const testUpdateVacancy = () => testEndpoint('updateVacancy', () => 
        updateVacancy("1", {
            title: "Обновленная тестовая вакансия"
        })
    );

    const testDeleteVacancy = () => testEndpoint('deleteVacancy', () => 
        deleteVacancy("1")
    );

    const testGetCompanyVacancies = () => testEndpoint('getCompanyVacancies', () => 
        getCompanyVacancies()
    );

    const testApplyToVacancy = () => testEndpoint('applyToVacancy', () => 
        applyToVacancy({
            vacancyId: "1",
            cover_letter: "Тестовое сопроводительное письмо",
            expected_salary: 60000,
            available_from: "2024-01-01"
        })
    );

    const testGetVacancyApplications = () => testEndpoint('getVacancyApplications', () => 
        getVacancyApplications("1")
    );

    const testGetApplicationById = () => testEndpoint('getApplicationById', () => 
        getApplicationById("1")
    );

    const testEvaluateApplication = () => testEndpoint('evaluateApplication', () => 
        evaluateApplication("1", {
            status: "accepted",
            comment: "Тестовый комментарий"
        })
    );

    const testGetStudentApplications = () => testEndpoint('getStudentApplications', () => 
        getStudentApplications()
    );

    const testAllEndpoints = async () => {
        setLoading('all');
        setError(null);
        setResults({});

        const tests = [
            { name: 'getVacancies', func: testGetVacancies },
            { name: 'createVacancy', func: testCreateVacancy },
            { name: 'getVacancyById', func: testGetVacancyById },
            { name: 'updateVacancy', func: testUpdateVacancy },
            { name: 'deleteVacancy', func: testDeleteVacancy },
            { name: 'getCompanyVacancies', func: testGetCompanyVacancies },
            { name: 'applyToVacancy', func: testApplyToVacancy },
            { name: 'getVacancyApplications', func: testGetVacancyApplications },
            { name: 'getApplicationById', func: testGetApplicationById },
            { name: 'evaluateApplication', func: testEvaluateApplication },
            { name: 'getStudentApplications', func: testGetStudentApplications }
        ];

        for (const test of tests) {
            try {
                const result = await test.func();
                setResults((prev: any) => ({
                    ...prev,
                    [test.name]: result
                }));
            } catch (err) {
                setResults((prev: any) => ({
                    ...prev,
                    [test.name]: { error: err instanceof Error ? err.message : 'Unknown error' }
                }));
            }
        }
        setLoading(null);
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return '#10b981';
        if (status >= 400 && status < 500) return '#f59e0b';
        if (status >= 500) return '#ef4444';
        return '#6b7280';
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1>Тестирование API вакансий</h1>
            <p><strong>Базовый URL:</strong> {process.env.NEXT_PUBLIC_SERVER_PATH}</p>
            
            <div style={{ marginBottom: "20px" }}>
                <button 
                    onClick={testAllEndpoints}
                    disabled={loading === 'all'}
                    style={{ 
                        padding: "12px 24px", 
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: loading === 'all' ? "not-allowed" : "pointer",
                        marginRight: "10px"
                    }}
                >
                    {loading === 'all' ? "Тестирование..." : "Тестировать все эндпоинты"}
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                {/* GET /api/v1/vacancies/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>GET /api/v1/vacancies/</h3>
                    <p>Получение списка вакансий</p>
                    <button 
                        onClick={testGetVacancies}
                        disabled={loading === 'getVacancies'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'getVacancies' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'getVacancies' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.getVacancies && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.getVacancies.status || 0), fontWeight: "bold" }}>
                                Статус: {results.getVacancies.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.getVacancies.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* POST /api/v1/vacancies/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>POST /api/v1/vacancies/</h3>
                    <p>Создание новой вакансии (требует авторизации)</p>
                    <button 
                        onClick={testCreateVacancy}
                        disabled={loading === 'createVacancy'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'createVacancy' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'createVacancy' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.createVacancy && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.createVacancy.status || 0), fontWeight: "bold" }}>
                                Статус: {results.createVacancy.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.createVacancy.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* GET /api/v1/vacancies/vacancy/{id}/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>GET /api/v1/vacancies/vacancy/{"{id}"}/</h3>
                    <p>Получение деталей вакансии</p>
                    <button 
                        onClick={testGetVacancyById}
                        disabled={loading === 'getVacancyById'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'getVacancyById' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'getVacancyById' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.getVacancyById && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.getVacancyById.status || 0), fontWeight: "bold" }}>
                                Статус: {results.getVacancyById.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.getVacancyById.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* PATCH /api/v1/vacancies/vacancy/{id}/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>PATCH /api/v1/vacancies/vacancy/{"{id}"}/</h3>
                    <p>Обновление вакансии (требует авторизации)</p>
                    <button 
                        onClick={testUpdateVacancy}
                        disabled={loading === 'updateVacancy'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#f59e0b",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'updateVacancy' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'updateVacancy' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.updateVacancy && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.updateVacancy.status || 0), fontWeight: "bold" }}>
                                Статус: {results.updateVacancy.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.updateVacancy.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* DELETE /api/v1/vacancies/vacancy/{id}/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>DELETE /api/v1/vacancies/vacancy/{"{id}"}/</h3>
                    <p>Удаление вакансии (требует авторизации)</p>
                    <button 
                        onClick={testDeleteVacancy}
                        disabled={loading === 'deleteVacancy'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'deleteVacancy' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'deleteVacancy' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.deleteVacancy && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.deleteVacancy.status || 0), fontWeight: "bold" }}>
                                Статус: {results.deleteVacancy.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.deleteVacancy.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* GET /api/v1/vacancies/my/company/vacancies/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>GET /api/v1/vacancies/my/company/vacancies/</h3>
                    <p>Вакансии компании (требует авторизации)</p>
                    <button 
                        onClick={testGetCompanyVacancies}
                        disabled={loading === 'getCompanyVacancies'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#8b5cf6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'getCompanyVacancies' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'getCompanyVacancies' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.getCompanyVacancies && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.getCompanyVacancies.status || 0), fontWeight: "bold" }}>
                                Статус: {results.getCompanyVacancies.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.getCompanyVacancies.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* POST /api/v1/vacancies/application/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>POST /api/v1/vacancies/application/</h3>
                    <p>Подача заявки на вакансию (требует авторизации)</p>
                    <button 
                        onClick={testApplyToVacancy}
                        disabled={loading === 'applyToVacancy'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#06b6d4",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'applyToVacancy' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'applyToVacancy' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.applyToVacancy && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.applyToVacancy.status || 0), fontWeight: "bold" }}>
                                Статус: {results.applyToVacancy.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.applyToVacancy.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* GET /api/v1/vacancies/application-list/{id}/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>GET /api/v1/vacancies/application-list/{"{id}"}/</h3>
                    <p>Заявки на вакансию (требует авторизации)</p>
                    <button 
                        onClick={testGetVacancyApplications}
                        disabled={loading === 'getVacancyApplications'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#84cc16",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'getVacancyApplications' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'getVacancyApplications' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.getVacancyApplications && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.getVacancyApplications.status || 0), fontWeight: "bold" }}>
                                Статус: {results.getVacancyApplications.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.getVacancyApplications.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* GET /api/v1/vacancies/application/{id}/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>GET /api/v1/vacancies/application/{"{id}"}/</h3>
                    <p>Детали заявки (требует авторизации)</p>
                    <button 
                        onClick={testGetApplicationById}
                        disabled={loading === 'getApplicationById'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#f97316",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'getApplicationById' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'getApplicationById' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.getApplicationById && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.getApplicationById.status || 0), fontWeight: "bold" }}>
                                Статус: {results.getApplicationById.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.getApplicationById.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* POST /api/v1/vacancies/application/evaluate/{id}/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>POST /api/v1/vacancies/application/evaluate/{"{id}"}/</h3>
                    <p>Оценка заявки (требует авторизации)</p>
                    <button 
                        onClick={testEvaluateApplication}
                        disabled={loading === 'evaluateApplication'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#ec4899",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'evaluateApplication' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'evaluateApplication' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.evaluateApplication && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.evaluateApplication.status || 0), fontWeight: "bold" }}>
                                Статус: {results.evaluateApplication.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.evaluateApplication.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>

                {/* GET /api/v1/vacancies/my/student/applications/ */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
                    <h3>GET /api/v1/vacancies/my/student/applications/</h3>
                    <p>Заявки студента (требует авторизации)</p>
                    <button 
                        onClick={testGetStudentApplications}
                        disabled={loading === 'getStudentApplications'}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#14b8a6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading === 'getStudentApplications' ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading === 'getStudentApplications' ? "Тестирование..." : "Тест"}
                    </button>
                    {results.getStudentApplications && (
                        <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                            <div style={{ color: getStatusColor(results.getStudentApplications.status || 0), fontWeight: "bold" }}>
                                Статус: {results.getStudentApplications.status}
                            </div>
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {results.getStudentApplications.message || "Успешно"}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div style={{ 
                    marginTop: "20px",
                    padding: "15px", 
                    backgroundColor: "#fef2f2", 
                    border: "1px solid #fecaca", 
                    borderRadius: "8px",
                    color: "#dc2626"
                }}>
                    <h3>Ошибка:</h3>
                    <pre>{error}</pre>
                </div>
            )}

            <div style={{ marginTop: "20px" }}>
                <h3>Результаты тестирования:</h3>
                <div style={{ 
                    padding: "15px", 
                    backgroundColor: "#f8fafc", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "8px",
                    fontSize: "14px"
                }}>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}

export default TestVacanciesApiPage; 