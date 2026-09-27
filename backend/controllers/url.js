const { nanoid}=require('nanoid')
const URL=require('../models/url')

async function handleGenerateNewShortURL(req,res){
    const body=req.body;
    // console.log(body)
    if(!body.url) return res.status(400).json({error:'url is required'})
    const shortID=nanoid(8);

        // Current time + 1 hour
    const expiresAt = new Date(
        Date.now() + 60 * 60 * 1000
    );

    
    await URL.create({
        shortId:shortID,
        redirectURL:body.url,
        visitHistory:[],
        expiresAt: expiresAt


    })

    return res.json({id:shortID, expiresAt: expiresAt})


}



async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result=await URL.findOne({ shortId});

      if (!result) {
        return res.status(404).json({
            error: "Short URL not found"
        });
       }

    return res.json({totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,})
}

async function handleRedirect(req, res) {

    const shortId = req.params.shortId;

    const entry = await URL.findOne({
        shortId: shortId
    });

    // Short ID database me nahi mila
    if (!entry) {
        return res.status(404).json({
            error: "Short URL not found"
        });
    }

    // Expiry check
    if (new Date() > entry.expiresAt) {
        return res.status(410).json({
            error: "Short URL has expired"
        });
    }
     
    // Click record
    entry.visitHistory.push({
        timestamp: Date.now()
    });

    await entry.save();


    // URL abhi valid hai
    return res.redirect(entry.redirectURL);
}

module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleRedirect
    
}