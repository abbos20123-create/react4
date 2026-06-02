import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"
import { auth, db } from "../firebase/firebase"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"


function Register() {
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const navigate=useNavigate()


const handleRegister = async () => {
  try {
    const userCr = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(
      doc(db, "users", userCr.user.uid),
      {
        email: userCr.user.email,
        role: "user",
        createdAt: serverTimestamp(),
      }
    );

    navigate("/login");
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className='h-screen flex items-center justify-center'>
<div className='card w-25 py-3 px-2'>
    <div className='card-header bg-success text-white'>Register</div>
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
        <button onClick={handleRegister} className='btn btn-success w-100'>Register</button>
        <Link to={"/login"}> <p className="text-center mt-2">Already have an account? Login</p> </Link>
    </div>
</div>



    </div>
  )
}

export default Register