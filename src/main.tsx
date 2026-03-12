import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('MAIN SCRIPT EXECUTING');
ReactDOM.createRoot(document.getElementById('root')!).render(
  <div style={{ padding: '100px', background: 'blue', color: 'white', size: '50px' }}>
    REACT MOUNTED CORE SUCCESS!!
  </div>
)

