const {Router} =require('express');
const client=require('../db');
require('dotenv').config();
const router=Router();

const crypto = require("crypto");
const { error } = require('console');
router.get('/getHistory',(req,res)=>{
    client.query(`select * from support_history`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).json(result.rows);
        }
    })
});

router.post('/addHistory',(req,res)=>{
    const data=req.body;
    const log_id = crypto.randomUUID()
    // res.send(data);
     client.query(`insert into support_history(log_id,support_user,req_user,support_req,start_time,end_time,status) values('${log_id}','${data.support_user}','${data.req_user}','${data.support_req}','${data.start_time}','${data.end_time}','${data.status}');
`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).json(result.rows);
        }
    })
   
})

module.exports=router;