import React, { useState, useEffect } from 'react';

const DashboardPage = () => {
    const [topDepartments, setTopDepartments] = useState([]);
    const [recentWorkers, setRecentWorkers] = useState([]);
    useEffect(() => {
        document.title = 'Дэшборд';
    }, []);
    useEffect(() => {
        const loadTopDepartments = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/top-departments');
                const data = await response.json();
                setTopDepartments(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const loadRecentWorkers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/recent-workers');
                const data = await response.json();
                setRecentWorkers(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        loadTopDepartments();
        loadRecentWorkers();
    }, []);

    return (
        <div>
            <h1>Дэшборд</h1>
            <div className="table-container">
                <h2>Топ-5 отделов по количеству сотрудников:</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Отдел</th>
                            <th>Количество сотрудников</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topDepartments.map((department) => (
                            <tr key={department.title}>
                                <td>{department.title}</td>
                                <td>{department.total_workers}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-container">
                <h2>5 последних добавленных сотрудников:</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Дата добавления</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentWorkers.map((worker) => (
                            <tr key={worker.id}>
                                <td>{worker.name}</td>
                                <td>{worker.surname}</td>
                                <td>{worker.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardPage;
