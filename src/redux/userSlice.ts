import { createSlice } from "@reduxjs/toolkit";

export type User={
  id:number
  name:string
  age:string
  job:boolean
}

type State={
  users:User[]
  userForm:{
    name:string
    age: string
    job:boolean
  }
  editingUser:User|null
}

const initialState:State={
  users:[],
  userForm:{
    name:"",
    age:"",
    job:false,
  },
  editingUser:null,
}

const userSlice=createSlice({
  name:"user",
  initialState,
  reducers:{
    setName:(state:State,action)=>{
      state.userForm.name=action.payload
    },

    setAge:(state:State,action)=>{
      state.userForm.age=action.payload
    },

    setJob:(state:State,action)=>{
      state.userForm.job=action.payload
    },

    addUser:(state:State)=>{
      if(state.editingUser){
        const user=state.users.find(
          (u)=>u.id===state.editingUser.id
        )

          user.name=state.userForm.name
          user.age=state.userForm.age
          user.job=state.userForm.job
        

        state.editingUser=null
      } else {
        if(state.userForm.name!=="" && state.userForm.age!==""){
          state.users.push({
          id:Date.now(),
          name:state.userForm.name,
          age:state.userForm.age,
          job:state.userForm.job,
        })
        }
      }

      state.userForm={
        name:"", 
        age:"",
        job:false
      }
    },

    deleteUser:(state, action)=>{
      state.users=state.users.filter(
        (u)=>u.id!==action.payload
      )
    },

    startEdit:(state:State,action)=>{
      state.editingUser=action.payload

      state.userForm={
        name:action.payload.name,
        age:action.payload.age,
        job:action.payload.job,
      }
    },
  },
})

export const {
  setName,
  setAge,
  setJob,
  addUser,
  deleteUser,
  startEdit,
}=userSlice.actions

export default userSlice.reducer