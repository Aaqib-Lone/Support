const {Router} =require('express');
const client=require('../db');
require('dotenv').config();
const router=Router();

const crypto = require("crypto")
router.get('/getQuestions',(req,res)=>{
    client.query(`select * from question_data`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).json(result.rows);
        }
    })
});

router.post('/addQuestion',(req,res)=>{
    const data=req.body;
   
    const q_id = crypto.randomUUID()
    // res.send(data);
    client.query(`insert into question_data (q_id,question,answer) values('${q_id}','${data.question}','${data.answer}')`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).send(result);
        }
    })
})
module.exports=router;