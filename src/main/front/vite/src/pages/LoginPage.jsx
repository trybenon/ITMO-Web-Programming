import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { Link } from 'react-router-dom'; 
import SnowmanClock from '../components/SnowmanClock';
import '../resourses/styles/LoginPage.css';
import { setError } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

     const handleSubmit = async (e) => {
        e.preventDefault();
        
    
        if (!login || !password) {
            dispatch(setError("Пожалуйста, введите логин и пароль"));
            return;
        }

        try {
            
            const response = await axios.post('http://localhost:8080/auth/login', {
                login: login,
                password: password
            });
            console.log("Login response:", response.data);
            console.log("Login successful for user:", login);
            
            const token = response.data.token; 
            const user = response.data.login;

            
            localStorage.setItem('jwt', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            dispatch(setCredentials({ login: user, token: token }));

            
            navigate('/main');

        } catch (error) {
            console.error("Login error:", error);
           
            let message = "Ошибка входа. Проверьте логин и пароль.";
            
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    
                    message = data;
                } else if (typeof data === 'object' && data.message) {
                   
                    message = data.message;
                } else if (typeof data === 'object' && data.error) {
                    
                    message = data.error;
                }
            }

            dispatch(setError(message));
        }
    };


    return (
        <div className="new-year-page">
            <div className="snow-overlay"></div>
            
            <header className="festive-header">
                <div className="header-glass">
                    <h1>Рыжаков Владислав Александрович</h1>
                    <p>P3223 | Вариант 3288</p>
                </div>
            </header>

            <main className="login-content">
                <div className="clock-wrapper">
                    <SnowmanClock />
                </div>
                
                <form className="login-card" onSubmit={handleSubmit}>
                    <h2 className="card-title">Вход в систему</h2>
                    
                    <div className="input-group">
                        <label>Логин</label>
                        <input 
                            type="text" 
                            value={login} 
                            onChange={(e) => setLogin(e.target.value)} 
                            placeholder="Ваш логин"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Пароль</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Ваш пароль"
                        />
                    </div>

                    <button type="submit" className="festive-button">
                        Войти
                    </button>

                    <div className="register-link">
                        <span>Нет аккаунта? </span>
                        <Link to="/register">Зарегистрироваться</Link>
                    </div>


                </form>
            </main>

            <footer className="mandarin-footer">
                <div className="mandarins-pile">
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                    <span className="mandarin">🍊</span>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;