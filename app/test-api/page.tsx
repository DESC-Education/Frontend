"use client";

import { useState } from "react";

function TestApiPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testServerConnection = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: "test@test.com",
                    password: "test"
                })
            });
            
            const data = await response.json();
            setResult({
                status: response.status,
                statusText: response.statusText,
                data: data
            });
        } catch (err) {
            console.error("Server connection error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const testVacanciesEndpoint = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/vacancies/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            
            const data = await response.text();
            setResult({
                status: response.status,
                statusText: response.statusText,
                data: data
            });
        } catch (err) {
            console.error("Vacancies endpoint error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const testVacancyCreation = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/vacancies/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Test Vacancy",
                    description: "Test description",
                    requirements: "Test requirements",
                    responsibilities: "Test responsibilities",
                    salary_min: 50000,
                    salary_max: 80000,
                    salary_currency: "RUB",
                    location: "Moscow",
                    remote_work: false,
                    categoryId: "1"
                })
            });
            
            const data = await response.text();
            setResult({
                status: response.status,
                statusText: response.statusText,
                data: data
            });
        } catch (err) {
            console.error("Vacancy creation error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>API Connection Test (Local Backend)</h1>
            
            <div style={{ marginBottom: "20px" }}>
                <h2>Server Configuration</h2>
                <p><strong>Server URL:</strong> {process.env.NEXT_PUBLIC_SERVER_PATH}</p>
                <p><strong>WS Address:</strong> {process.env.NEXT_PUBLIC_WS_ADDRESS}</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <h2>Test Server Connection</h2>
                <button 
                    onClick={testServerConnection}
                    disabled={loading}
                    style={{ 
                        padding: "10px 20px", 
                        marginRight: "10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Testing..." : "Test Server Connection"}
                </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <h2>Test Vacancies Endpoint</h2>
                <button 
                    onClick={testVacanciesEndpoint}
                    disabled={loading}
                    style={{ 
                        padding: "10px 20px", 
                        marginRight: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Testing..." : "Test Vacancies Endpoint"}
                </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <h2>Test Vacancy Creation</h2>
                <button 
                    onClick={testVacancyCreation}
                    disabled={loading}
                    style={{ 
                        padding: "10px 20px", 
                        marginRight: "10px",
                        backgroundColor: "#ffc107",
                        color: "black",
                        border: "none",
                        borderRadius: "5px",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Testing..." : "Test Vacancy Creation"}
                </button>
            </div>

            {error && (
                <div style={{ 
                    padding: "15px", 
                    backgroundColor: "#f8d7da", 
                    border: "1px solid #f5c6cb", 
                    borderRadius: "5px",
                    color: "#721c24",
                    marginBottom: "20px"
                }}>
                    <h3>Error:</h3>
                    <pre>{error}</pre>
                </div>
            )}

            {result && (
                <div style={{ 
                    padding: "15px", 
                    backgroundColor: "#d4edda", 
                    border: "1px solid #c3e6cb", 
                    borderRadius: "5px",
                    color: "#155724"
                }}>
                    <h3>Result:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default TestApiPage;