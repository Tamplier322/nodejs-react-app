import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    useEffect(() => {
        document.title = 'Главная';
    }, []);
    const [workers, setWorkers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [dataType, setDataType] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const loadWorkers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/worker');
            const data = await response.json();
            setWorkers(data);
            setDataType('workers');
            setDataLoaded(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const loadDepartments = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/department');
            const data = await response.json();

            const enrichedDepartments = data.map(async (department) => {
                const response = await fetch(`http://localhost:8000/api/worker/${department.head}`);
                const workerData = await response.json();
                const head = `${workerData.name} ${workerData.surname}`;

                const hasWorkersResponse = await fetch(`http://localhost:8000/api/department/${department.id}/has-workers`);
                const { hasWorkers } = await hasWorkersResponse.json();

                const departmentWorkersResponse = await fetch(`http://localhost:8000/api/department/${department.id}/workers`);
                const departmentWorkersData = await departmentWorkersResponse.json();

                return {
                    ...department,
                    head: head,
                    hasWorkers: hasWorkers,
                    workers: departmentWorkersData,
                };
            });

            const resolvedDepartments = await Promise.all(enrichedDepartments);
            setDepartments(resolvedDepartments);
            setDataType('departments');
            setDataLoaded(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleWorkersButtonClick = () => {
        loadWorkers();
    };

    const handleDepartmentsButtonClick = () => {
        loadDepartments();
    };

    const handleSortById = () => {
        if (dataType === 'workers') {
            const sortedWorkers = [...workers].sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.id - b.id;
                } else {
                    return b.id - a.id;
                }
            });
            setWorkers(sortedWorkers);
        } else if (dataType === 'departments') {
            const sortedDepartments = [...departments].sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.id - b.id;
                } else {
                    return b.id - a.id;
                }
            });
            setDepartments(sortedDepartments);
        }

        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const deleteWorker = async (workerId) => {
        try {
            const isDepartmentHeadResponse = await fetch(`http://localhost:8000/api/worker/${workerId}/check-head`);
            const { isDepartmentHead } = await isDepartmentHeadResponse.json();

            if (isDepartmentHead) {
                alert('Этот сотрудник является руководителем отдела. Удаление невозможно пока не назначен другой руководитель.');
                return;
            }

            const response = await fetch(`http://localhost:8000/api/worker/${workerId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedWorkers = workers.filter((worker) => worker.id !== workerId);
                setWorkers(updatedWorkers);
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteDepartment = async (departmentId) => {
        try {
            const hasWorkersResponse = await fetch(`http://localhost:8000/api/department/${departmentId}/has-workers`);
            const { hasWorkers } = await hasWorkersResponse.json();

            if (hasWorkers) {
                alert('Невозможно удалить отдел, так как в нем есть сотрудники.');
                return;
            }

            const response = await fetch(`http://localhost:8000/api/department/${departmentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedDepartments = departments.filter((department) => department.id !== departmentId);
                setDepartments(updatedDepartments);
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteWorker = async (workerId) => {
        if (window.confirm('Вы уверены, что хотите удалить сотрудника?')) {
            await deleteWorker(workerId);
        }
    };

    const handleDeleteDepartment = async (departmentId) => {
        if (window.confirm('Вы уверены, что хотите удалить отдел?')) {
            await deleteDepartment(departmentId);
        }
    };

    const handleAddWorker = () => {
        setModalOpen(true);
        setModalType('addWorker');
    };

    const handleAddDepartment = () => {
        setModalOpen(true);
        setModalType('addDepartment');
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setModalType(null);
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (modalType === 'addWorker') {
                const response = await fetch('http://localhost:8000/api/worker', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const newWorker = await response.json();
                    setWorkers([...workers, newWorker]);
                    setModalOpen(false);
                } else {
                    console.error('Error:', response.status);
                }
            } else if (modalType === 'addDepartment') {
                const response = await fetch('http://localhost:8000/api/department', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const newDepartment = await response.json();
                    setDepartments([...departments, newDepartment]);
                    setModalOpen(false);
                } else {
                    console.error('Error:', response.status);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <h1>Список работников и отделов</h1>
            <div className="buttons-container">
                <button className="button" onClick={handleWorkersButtonClick}>Загрузить сотрудников</button>
                <button className="button" onClick={handleDepartmentsButtonClick}>Загрузить отделы</button>
                <button className="button" onClick={handleAddWorker}>Добавить сотрудника</button>
                <button className="button" onClick={handleAddDepartment}>Добавить отдел</button>
            </div>

            {dataLoaded && (
                <div className="output-field">
                    {dataType === 'workers' && (
                        <div>
                            <h2>Список работников</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th onClick={handleSortById}>ID</th>
                                        <th>Имя</th>
                                        <th>Фамилия</th>
                                        <th>Отдел</th>
                                        <th>Дата</th>
                                        <th>Действие</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workers.map((worker) => (
                                        <tr key={worker.id}>
                                            <td>{worker.id}</td>
                                            <td>{worker.name}</td>
                                            <td>{worker.surname}</td>
                                            <td>{worker.department}</td>
                                            <td>{worker.date}</td>
                                            <td>
                                                <button onClick={() => handleDeleteWorker(worker.id)}>
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {dataType === 'departments' && (
                        <div>
                            <h2>Список отделов</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th onClick={handleSortById}>ID</th>
                                        <th>Название</th>
                                        <th>Дата</th>
                                        <th>Описание</th>
                                        <th>Руководитель</th>
                                        <th>Сотрудники</th>
                                        <th>Действие</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map((department) => (
                                        <tr key={department.id}>
                                            <td>{department.id}</td>
                                            <td>{department.title}</td>
                                            <td>{department.date}</td>
                                            <td>{department.description}</td>
                                            <td>{department.head}</td>
                                            <td>
                                                {department.workers.map((worker, index) => (
                                                    <span key={worker.id}>
                                                        {`${worker.name} ${worker.surname}`}
                                                        {index !== department.workers.length - 1 && (', ')}
                                                    </span>
                                                ))}
                                            </td>
                                            <td>
                                                <button onClick={() => handleDeleteDepartment(department.id)}>Удалить</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}

                </div>
            )}

            {modalOpen && (
                <Modal
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                    modalType={modalType}
                />
            )}
        </div>
    );
};

const Modal = ({ onClose, onSubmit, modalType }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [department, setDepartment] = useState('');
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [head, setHead] = useState('');

    const handleSubmit = () => {
        if (modalType === 'addWorker') {
            onSubmit({ name, surname, department, date });
        } else if (modalType === 'addDepartment') {
            onSubmit({ title, date, description, head });
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>{modalType === 'addWorker' ? 'Добавить сотрудника' : 'Добавить отдел'}</h2>
                {modalType === 'addWorker' && (
                    <form>
                        <label>
                            Имя:
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>
                            Фамилия:
                            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
                        </label>
                        <label>
                            Отдел:
                            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
                        </label>
                        <label>
                            Дата:
                            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
                        </label>
                    </form>
                )}
                {modalType === 'addDepartment' && (
                    <form>
                        <label>
                            Название:
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        <label>
                            Дата:
                            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
                        </label>
                        <label>
                            Описание:
                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </label>
                        <label>
                            Руководитель:
                            <input type="text" value={head} onChange={(e) => setHead(e.target.value)} />
                        </label>
                    </form>
                )}
                <button type="button" onClick={handleSubmit}>
                    Добавить
                </button>
            </div>
        </div>
    );
};

export default App;