import { useEffect } from 'react';

export default function ToastContainer({ toasts }) {
    return (
        <div id="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} />
            ))}
        </div>
    );
}

function Toast({ message, type }) {
    return <div className={`toast ${type}`}>{message}</div>;
}
