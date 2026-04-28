import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/authSlice';
import {addPoint, clearPoints} from '../store/pointsSlice';
import Graph from '../components/InteractiveGraph'; 
import '../resourses/styles/MainPage.css';
import {setError} from '../store/authSlice';
import { setPoints } from '../store/pointsSlice';

import {Autocomplete} from 'react-toolbox/lib/autocomplete';
import {Input} from 'react-toolbox/lib/input';
import api from '../api/axios'; 
import {useNavigate} from 'react-router-dom';   


const MainPage = () => {
    const dispatch = useDispatch();
    const results = useSelector(state => state.points.results);
    const [x, setX] = useState('0.0');
    const [y, setY] = useState('');
    const [r, setR] = useState('1.0');
    const navigate = useNavigate();

    const xOptions = {'-2.0': '-2.0', '-1.5': '-1.5', '-1.0': '-1.0', '0.0': '0.0', '1.0': '1.0', '2.0': '2.0'};
    const rOptions = {'1.0': '1.0', '2.0': '2.0', '3.0': '3.0', '4.0': '4.0'};

    const fetchHistory = async () => {
        try {
            
            const response = await api.get('/api/allResults'); 
            dispatch(setPoints(response.data)); 
            
        } catch (error) {
            console.error(error);
            dispatch(setError("Ошибка загрузки истории"));
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                 dispatch(setError("Сессия истекла, пожалуйста войдите снова"));
                 dispatch(logout());
                 navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []); 


  
   const sendPoint = async (pX, pY, pR) => {
        const newPoint = { 
            x: parseFloat(pX), 
            y: parseFloat(pY), 
            r: parseFloat(pR)
           
        };

        try {
            const response = await api.post('/api/sendPoint', newPoint);
            dispatch(addPoint(response.data));

        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'Ошибка при отправке точки';
            dispatch(setError(errorMessage));
        }
    };

    const handleSend = () => {
        const yNum = parseFloat(y.replace(',', '.'));
        if (isNaN(yNum) || yNum < -3 || yNum > 3) {
            dispatch(setError("Y должен быть числом от -3 до 3"));
            return;
        }
        sendPoint(x, yNum, r);
    };

    const handleCanvasClick = (cx, cy) => {
        if (cy < -3 || cy > 3) {
             dispatch(setError(`Y (${cy.toFixed(2)}) вышел за пределы (-3...3)`));
             return;
        }
        sendPoint(cx, cy, r);
    };

    return (
        <div className="main-page-container">
            <div className="snow-overlay"></div>

            <header className="main-page-header">
                {/* Обертка для центрирования содержимого */}
                <div className="header-content">
                    <h2>Рыжаков В.А. | P3223</h2>
                    <button className="festive-button" onClick={() => dispatch(logout())}>Выйти</button>
                </div>
            </header>

            <main className="main-content">
                <div className="top-section">
                    <div className="glass-panel"> 
                         <Graph r={parseFloat(r)} points={results} onCanvasClick={handleCanvasClick} />
                    </div>

                    <div className="glass-panel form-card">
                        <Autocomplete 
                            className="festive-input"
                            label="Координата X" 
                            source={xOptions} 
                            value={x} 
                            onChange={setX} 
                            multiple={false}
                        />
                        <Input 
                            className="festive-input"
                            type="text" 
                            label="Координата Y (-3...3)" 
                            value={y} 
                            onChange={setY} 
                        />
                        <Autocomplete 
                            className="festive-input"
                            label="Радиус R" 
                            source={rOptions} 
                            value={r} 
                            onChange={setR} 
                            multiple={false}
                        />

                        <div className="button-group">
                            <button className="festive-button" onClick={handleSend}>Тыдыщ</button>
                            <button className="festive-button secondary" onClick={() => dispatch(clearPoints())}>Очистить</button>
                        </div>
                    </div>
                </div>

                <div className="glass-panel table-container">
                    <table className="results-table">
                        <thead>
                        <tr>
                            <th>X</th>
                            <th>Y</th>
                            <th>R</th>
                            <th>Результат</th>
                            <th>Время</th>
                            <th>Скрипт</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', opacity: 0.7 }}>Нет результатов</td></tr>
                        ) : (
                            results.map((res, index) => (
                                <tr key={res.id || index}>
                                    <td>{Number(res.x).toFixed(2)}</td>
                                    <td>{Number(res.y).toFixed(2)}</td>
                                    <td>{res.r}</td>
                                    <td className={res.success ? 'hit' : 'miss'}>{res.success ? 'ПОПАЛ' : 'ПРОМАХ'}</td>
                                    <td>{res.attemptTime}</td>
                                    <td>{(res.execTime)} мс</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default MainPage;