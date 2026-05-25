import { deleteUser, startEdit } from "./redux/userSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

function UserList() {
  const {users} = useAppSelector((state)=>state.user)
  const dispatch=useAppDispatch()

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        User List
      </h2>

      {users.length===0?(
        <p className="text-gray-500">No users yet</p>
      ):(
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((user)=>(
            <div
              key={user.id}
              className="bg-white rounded-xl shadow p-5 hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Age: {user.age}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-sm">
                {user.job==true?(
                  <span className="text-green-600 font-medium">
                    ● Employed
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">
                    ● Unemployed
                  </span>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <button onClick={()=>dispatch(startEdit(user))}
                className="px-5 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                >
                  Edit
                </button>

                <button
                  onClick={()=>dispatch(deleteUser(user.id))}
                  className="px-5 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;