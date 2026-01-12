import express from 'express'
const app = express();

import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authRouter } from './routes/auth.routes.js';
import {adminRouter} from './routes/admin.routes.js';
import {ratingRouter} from './routes/rating.routes.js';
import { storeOwnerRouter } from './routes/storeOwner.routes.js';

app.use(cors({
    origin:[
        'http://localhost:5173'
    ],
    methods:['POST','GET','PUT'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('',authRouter)
app.use('/admin', adminRouter)
app.use('',ratingRouter)
app.use('/store-owner',storeOwnerRouter)
export {app}