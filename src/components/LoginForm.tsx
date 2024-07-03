'use client'
import { signIn } from "next-auth/react";

import { useState } from "react"

export default function Login(){

    const [userOrEmail, setUserOrEmail] = useState("");
    const [password, setPassword] = useState("");

    function handelSubmit(e: any){
        e.preventDefault();
        signIn("credentials", {
          username: userOrEmail,
          password: password,
        });
    }

    return <div>
        <form onSubmit={handelSubmit}>
            <input type="text" placeholder="username/email" value={userOrEmail} onChange={(e)=>{
                setUserOrEmail(e.target.value)
            }}/>
            <input type="password" placeholder="password" value={password} onChange={(e)=>{
                setPassword(e.target.value)
            }}/>
            <button type="submit">submit</button>
        </form>
    </div>
}