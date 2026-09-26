const express=require("express")
const urlRoute=require('./routes/url')
const { connectToMongoDB}=require('./connect')
const  URL=require('./models/url')
const cors = require("cors");
require("dotenv").config();
const urlRouter = require("./routes/url");




const app=express()


const allowedOrigins = [
   process.env.FRONTEND_URL,
   process.env.FRONTEND_URL_127,
    process.env.NETLIFY_URL
];

app.use(cors({
  origin: allowedOrigins
}));

// connectToMongoDB('mongodb+srv://abhayvishwakarma476:Abhay123@codingadda.5a9lxcm.mongodb.net/short-url')
// .then(()=>console.log('Mongodb conneted'))

app.use(express.json())



app.use("/url",urlRoute);
app.use("/", urlRouter);



// app.get("/:shortId",async (req,res)=>{

//    const shortId=req.params.shortId;
//    const entry=await URL.findOneAndUpdate({
//     shortId
//    },{ $push:{
//     visitHistory:{
//         timestamp:Date.now()
//     }
//    }});

//    res.redirect(entry.redirectURL)
// })

// app.listen(PORT,()=> console.log(`Server Started at PORT ${PORT}`))



async function startServer() {
    try {
        // 1. Pehle MongoDB connect hoga
        await connectToMongoDB(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully");

        // 2. MongoDB connect hone ke baad server start hoga
        app.listen(process.env.PORT, () => {
            console.log(`Server started at http://localhost:${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();