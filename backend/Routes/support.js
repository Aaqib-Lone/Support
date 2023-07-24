const {Router} =require('express');
const client=require('../db');
require('dotenv').config();
const router=Router();

const crypto = require("crypto");
const { error } = require('console');
router.get('/getSupport',(req,res)=>{
    client.query(`select * from support`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).json(result.rows);
        }
    })
});

router.post('/addSupport',(req,res)=>{
    const data=req.body;
    const s_id = crypto.randomUUID()
    // res.send(data);
    client.query(`select * from support where email='${req.user.email}' and support_flag='${data.support_flag}'`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            if(result.rowCount==0){
                client.query(`insert into support (s_id,name,username,email,phone_no,support_flag,socket_id) values('${s_id}','${req.user.name}','${req.user.username}','${req.user.email}','${req.user.phone_no}','${data.support_flag}','${data.socket_id}')`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).send(result);
        }
    })
            }else{
                res.status(200).send("Request Already Added!!");
            }

        }
    })
})
router.post('/delete',(req,res)=>{
    const data=req.body;
    // res.send(data);
    client.query(`delete from support where email='${data.email}' and support_flag='${data.support_flag}'`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).send(result);
        }
    })
})
router.post('/deleteAll',(req,res)=>{
    const data=req.body;
    // res.send(data);
    client.query(`delete from support where email='${data.email}''`,(error,result)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).send(result);
        }
    })
})
module.exports=router;