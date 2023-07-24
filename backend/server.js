const express=require('express');
const user =require('./Routes/user');
const questions=require('./Routes/questions');
const support=require('./Routes/support');
const supportHistory=require('./Routes/supportHistory');
const cors=require('cors');
const app=express();
const client=require('./db');
const {Server}=require('socket.io');
const auth=require('./Middlewares/auth');
const helmet=require('helmet');
require('dotenv').config;
app.use(express.json());
app.use(cors());
app.use(helmet());
const PORT=process.env.PORT || 5000;
const server=require('http').createServer(app);
const io=new Server(server,{
    cors:{
        origin:`http://localhost:3000`,
       
    },
});
const users={};

io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.on("join_room",(data)=>{
        socket.join(data.room);
        users[data.username]=socket.id;
        console.log(`User with id ${socket.id} joined the room ${data.room}`)
        // console.log(users);

    })
    socket.on("getUsers",()=>{
        socket.emit("users",users);
    })
 
    socket.on("send_message",(msg_data)=>{
        console.log(msg_data);
        console.log("send message called",msg_data.room);
        socket.to(msg_data.room).emit("receive_message",msg_data);

    })
    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id);
    })
    socket.emit("me", socket.id)

	socket.on("disconnect", () => {
         console.log("User Disconnected",socket.id);
		// socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
        // console.log(data.signal);
        // console.log(data.to);
		io.to(data.to).emit("callAccepted", data.signal)
	})
    socket.on("supportReq",()=>{
        console.log("called!!!!!");
        io.sockets.emit("refreshSupportReq");
    })
    socket.on("disconnect_support",(data)=>{
        io.to(data.room).emit("askReview",data.room);

    })
    socket.on("review",(data)=>{
        console.log(data);
        console.log("review called!!" ,data.room)
        io.to(data.room).emit("logSupport",data.review);
    })
    socket.on("leave_room",(data)=>{
        socket.leave(data.room);
        // console.log(`User with ${data.socket_id} left the room ${data.room}`);
    })
    socket.on("endCall",(id)=>{
        console.log("end call called!",id);
        io.to(id).emit("leaveCall");
    })

})
app.use('/api/v1/users',user);
io.on("connect",socket=>{});
app.use(auth);
app.use('/api/v1/questions',questions);
app.use('/api/v1/support',support);
app.use('/api/v1/history',supportHistory);
server.listen(PORT,async()=>{
    const res=await client.connect((err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Database connected Successfully");
        }

    });
    console.log(`Server is listening on port ${PORT}`);
})
