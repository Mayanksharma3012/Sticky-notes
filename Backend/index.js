import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);


import dotenv from 'dotenv';
dotenv.config(); // ✅ MUST be the first line

import express from 'express';
import connectDB from './db/index.js';
const app = express()
const port = 3000


async function startServer(){
    try {
        await connectDB()
        
        app.get('/', (req, res) => { 
            res.send('Hello World!') 
        }) 
        
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
            
        }
    )
    } catch (error) {
        console.log('error in MongoDB : ')
    }
    
}

startServer()