import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/argon-dashboard.css';
import './assets/css/nucleo-icons.css'; // Importa los iconos de Nucleo
import './assets/css/nucleo-svg.css'; // Importa los iconos de Nucleo SVG
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
