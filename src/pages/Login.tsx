import {  signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth, db } from "../firebase/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

function Login() {
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const navigate=useNavigate()

const handleLogin = async () => {
  try {
    const userCr = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userDoc = await getDoc(
      doc(db, "users", userCr.user.uid)
    );

    const role = userDoc.data()?.role;

    if (role === "admin") {
      navigate("/admin/orders");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.log(error);
  }
};


const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(
      auth,
      provider
    );

    const userDoc = await getDoc(
      doc(db, "users", result.user.uid)
    );

    const role = userDoc.data()?.role;

    if (!userDoc.exists()) {
  await setDoc(
    doc(db, "users", result.user.uid),
    {
      email: result.user.email,
      password: password,
      role: "user",
      createdAt: serverTimestamp(),
    }
  );
}

    if (role === "admin") {
      navigate("/admin/orders");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.log(error);
  }
};




  return (
    <div className='h-screen flex items-center justify-center'>
<div className='card w-25 py-3 px-2'>
    <div className='card-header bg-primary text-white'>Login</div>
    <div className='card-body'>
        <input 
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className='form-control' type="email" placeholder='email' />
        <input 
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className='form-control mt-2' type="text" placeholder='password' />


    </div>
    <div className='card-footer'>
        <button onClick={handleLogin} className='btn btn-primary w-100'>Login</button>
        <button
  onClick={googleLogin}
  className="btn btn-danger w-100 mt-2"
>
  Login with Google
</button>
  <Link to={"/register"}> <p className="mt-2 text-center">if you don't have an account</p> </Link>
    </div>
</div>



    </div>
  )
}

export default Login
