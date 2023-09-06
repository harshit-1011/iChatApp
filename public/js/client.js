const socket = io();

var username;
let chat = document.querySelector('.chat')
let users_list = document.querySelector('.users-list')
let users_count = document.querySelector('.users-count')
let msg_send = document.querySelector('#user-send');
let user_msg = document.querySelector('#user-msg');

var audio = new Audio('tone.mp3');

do{
   username=prompt("Enter Your name: ")
}while(!username)

/*it will be called when user will join*/ 
socket.emit("new-user-joined",username)
/*Notifying that user is joined*/
socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,' joined')
})
/*function  to create joined/left status div */
function userJoinLeft(name,status){
 let div = document.createElement("div")
 div.classList.add('user-join')
 let content=`<p><b>${name} </b>${status} the chat</p>`;
 div.innerHTML= new Date().toLocaleTimeString([], { timeStyle: "short" }) + content;
 chat.appendChild(div);
 chat.scrollTop=chat.scrollHeight;
}
/*Notifying that user has left*/
socket.on("user-disconnected",(user)=>{
    userJoinLeft(user,"left");
});
/*for Updating user list and user count */
socket.on('user-list',(users)=>{
users_list.innerHTML="";
users_arr=Object.values(users);
for(i=0;i<users_arr.length;i++){
    let p=document.createElement('p');
    p.innerText=users_arr[i];
    users_list.appendChild(p);
}
users_count.innerHTML=users_arr.length;
})

/*For sending msg */
msg_send.addEventListener('click',()=>{
    let data={
        user:username,
        msg:user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value='' ;
        
    }
});
function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML=new Date().toLocaleTimeString([], { timeStyle: "short" }) +content;
    chat.appendChild(div);
    chat.scrollTop=chat.scrollHeight;
    if (status == "incoming") {
        audio.play();
      }
  
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming')
})