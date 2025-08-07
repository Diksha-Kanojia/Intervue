import React from 'react';

export default function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#f8f8f8'
    }}>
      <div style={{ 
        backgroundColor: '#7B61FF',
        color: 'white',
        borderRadius: '20px',
        padding: '6px 16px',
        fontSize: '14px',
        marginBottom: '64px'
      }}>
        Intervue Poll
      </div>
      
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: 'black',
        letterSpacing: '-0.5px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Welcome to the Live Polling System
      </h1>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '16px',
        marginBottom: '24px',
        maxWidth: '100%',
        flexWrap: 'wrap'
      }}>
        <div style={{
          width: '300px',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'left',
          backgroundColor: 'white',
        }}>
          <div style={{ fontWeight: '700', marginBottom: '4px' }}>I'm a Student</div>
          <div style={{ fontSize: '14px', color: '#666666' }}>
            Answer questions, participate in polls, and see your results in real-time
          </div>
        </div>
        
        <div style={{
          width: '300px',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'left',
          backgroundColor: 'white',
        }}>
          <div style={{ fontWeight: '700', marginBottom: '4px' }}>I'm a Teacher</div>
          <div style={{ fontSize: '14px', color: '#666666' }}>
            Create polls, ask questions, and view student responses in real-time
          </div>
        </div>
      </div>
      
      <button style={{
        backgroundColor: '#7B61FF',
        color: 'white',
        height: '44px',
        width: '170px',
        borderRadius: '34px',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer'
      }}>
        Continue
      </button>
    </div>
  );
}
