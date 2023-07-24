const {Client}=require('pg');
require('dotenv').config();
// const client=new Client({
//     user:process.env.DATABASE_USER,
//     host:process.env.DATABASE_HOST,
//     password:process.env.DATABASE_PASS,
//     database:process.env.DATABASE_NAME,
//     port:process.env.DATABASE_PORT
// }) 
const client=new Client(`postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?sslmode=require`);

module.exports=client;