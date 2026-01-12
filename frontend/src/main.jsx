import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import './index.css'

import store from './store/store.js'
import AppRouter from './routes/AppRouter.jsx'
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <AppRouter/>
    </Provider>
)
