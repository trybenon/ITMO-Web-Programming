import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import ErrorMessage from './components/ErrorMessage';
import './resourses/styles/ErrorMessage.css';
function App() {
    const isAuth = useSelector(state => !!state.auth.token);

    return (
 <div className="app-container">
                <ErrorMessage />
                <Routes>
                    <Route 
                        path="/login" 
                        element={!isAuth ? <LoginPage /> : <Navigate to="/main" replace />} 
                    />
                    <Route 
                        path="/register" 
                        element={!isAuth ? <RegisterPage /> : <Navigate to="/main" replace />} 
                    />
                    <Route 
                        path="/main" 
                        element={isAuth ? <MainPage /> : <Navigate to="/login" replace />} 
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
    );
}

export default App;