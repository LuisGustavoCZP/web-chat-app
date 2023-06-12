import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/main.css'
import defaultStyle from "./styles/themes/default.css?inline";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <style>
      {defaultStyle}
    </style>
    <App />
  </React.StrictMode>,
)
