import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../store/authSlice';

const ErrorMessage = () => {
    const error = useSelector(state => state.auth.error);
    const dispatch = useDispatch();

    if (!error) return null;

    return (
        <div className="error-banner">
            <span className="error-text">{error}</span>
            <button className="error-close" onClick={() => dispatch(clearError())}>×</button>
        </div>
    );
};

export default ErrorMessage;