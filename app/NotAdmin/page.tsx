import React from 'react';

const NotAdminPage: React.FC = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.message}>You are not an admin</h1>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8d7da',
    },
    message: {
        color: '#721c24',
        fontSize: '24px',
        fontWeight: 'bold',
    },
};

export default NotAdminPage;