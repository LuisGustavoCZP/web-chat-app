import React, {Fragment} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/main.css'
import defaultStyle from "./styles/themes/default.css?inline";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  //<React.StrictMode>
    <Fragment>
      <style>
        {defaultStyle}
      </style>
      <App />
    </Fragment>
  //</React.StrictMode>,
)
