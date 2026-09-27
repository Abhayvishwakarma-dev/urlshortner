const mongoose=require('mongoose')

const urlSchema=new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true,
    },
    redirectURL:{
        type:String,
        required:true,
    },
     visitHistory: [
        {
            ip: {
                type: String
            },

            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    expiresAt: {
        type: Date,
        required: true,
        expires: 0   
    }
},{timestamp:true}
)

const URL=mongoose.model('url',urlSchema);

module.exports=URL;