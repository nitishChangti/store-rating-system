import "./bootstrap.js";
import { app } from "./app.js";
import connectDB from './db/index.js'
import config from "./config/config.js";
connectDB()
.then(()=>{
    app.on('error',(err)=>{
        console.error("Server error:", err);
    })
    app.listen(config.get('PORT'),()=>{
        console.log(
        `Server is running on port ${config.get("PORT")}`
      );
    })
})
.catch((error)=>{
    console.error("PostgreSQL DB connection failed:", error.message);
    process.exit(1);
})