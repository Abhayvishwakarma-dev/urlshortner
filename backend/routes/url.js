const express=require('express')
const {handleGenerateNewShortURL,handleGetAnalytics,handleRedirect}=require('../controllers/url')

const router=express.Router();

router.post('/',handleGenerateNewShortURL);
router.get('/analytics/:shortId',handleGetAnalytics);
router.get("/:shortId", handleRedirect);
router.get('/health',(req,res)=>{
    res.status(200).send("App is running")
    
});

module.exports=router;