'use client'
import axios from "axios";

import { useState } from "react"

export default function SignUpForm(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handelSubmit(e: any){
        e.preventDefault();
        axios.post("/api/signup", {
            username: username,
            email: email,
            password: password
        }).then((res)=>{
            console.log(res.data.message)
        }).catch((error)=>{
            console.log(error);
        })
    }

    return <div>
        <form onSubmit={handelSubmit}>
            <input type="text" placeholder="username" value={username} onChange={(e)=>{
                setUsername(e.target.value)
            }}/>
             <input type="email" placeholder="email" value={email} onChange={(e)=>{
                setEmail(e.target.value)
            }}/>
            <input type="password" placeholder="password" value={password} onChange={(e)=>{
                setPassword(e.target.value)
            }}/>
            <button type="submit">submit</button>
        </form>
    </div>
}