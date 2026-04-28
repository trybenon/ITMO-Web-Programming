import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; 
import '../resourses/styles/RegisterPage.css';
import { setError } from '../store/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!login || !password || !confirmPass) {
            dispatch(setError("Пожалуйста, заполните все поля"));
            return;
        }

        if (password !== confirmPass) {
            dispatch(setError("Пароли не совпадают!"));
            return;
        }

        axios.post('http://localhost:8080/auth/register', { login, password })
            .then(response => {
                
                console.log("Регистрация успешна:", response.data);
                navigate('/login');
            })
            .catch(error => {
                
                dispatch(setError("Ошибка при регистрации: " + (error.response?.data?.message || error.message)));
            });
    };

    return (
        <div className="register-page-container">
            <div className="snow-overlay"></div>
            
            <header className="festive-header-reg">
                <div className="header-glass-reg">
                    <h1>Новый Год — Новый Аккаунт</h1>
                    <h3>С наступающим!</h3>

                </div>
            </header>

            <main className="register-main-wrapper">
                
                {/* --- ЛЕВАЯ КОЛОНКА: ЕЛКА ИЗ МАНДАРИНОВ --- */}
                <div className="side-decoration left-decor">
                    <div className="mandarin-tree">
                        {/* Верхушка */}
                        <span className="mandarin-item m-top">🍊</span>
                        
                        {/* 2 ряд */}
                        <span className="mandarin-item m-2-1">🍊</span>
                        <span className="mandarin-item m-2-2">🍊</span>
                        
                        {/* 3 ряд */}
                        <span className="mandarin-item m-3-1">🍊</span>
                        <span className="mandarin-item m-3-2">🍊</span>
                        <span className="mandarin-item m-3-3">🍊</span>
                        
                        {/* 4 ряд (низ) */}
                        <span className="mandarin-item m-4-1">🍊</span>
                        <span className="mandarin-item m-4-2">🍊</span>
                        <span className="mandarin-item m-4-3">🍊</span>
                        <span className="mandarin-item m-4-4">🍊</span>
                    </div>
                </div>

                {/* --- ЦЕНТР: ФОРМА --- */}
                <form className="register-card" onSubmit={handleRegister}>
                    <h2 className="card-title">Регистрация</h2>
                    
                    <div className="input-group">
                        <label>Придумайте логин</label>
                        <input 
                            type="text" 
                            value={login} 
                            onChange={(e) => setLogin(e.target.value)} 
                            placeholder="Логин"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Пароль</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Пароль"
                        />
                    </div>

                    <div className="input-group">
                        <label>Повторите пароль</label>
                        <input 
                            type="password" 
                            value={confirmPass} 
                            onChange={(e) => setConfirmPass(e.target.value)} 
                            placeholder="Пароль еще раз"
                            className={password && confirmPass && password !== confirmPass ? 'error-input' : ''}
                        />
                    </div>

                    <button type="submit" className="festive-button">
                        Создать аккаунт
                    </button>

                    <div className="login-link">
                        <span>Уже есть аккаунт? </span>
                        <Link to="/login">Войти</Link>
                    </div>
                </form>

                {/* --- ПРАВАЯ КОЛОНКА: ОБЫЧНАЯ ЕЛКА --- */}
                <div className="side-decoration right-decor">
                    <div className="simple-tree">
                        <div className="tree-layer top-layer"></div>
                        <div className="tree-layer mid-layer"></div>
                        <div className="tree-layer bot-layer"></div>
                        <div className="tree-stump"></div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default RegisterPage;