import { addUser, setAge, setJob, setName } from "./redux/userSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

function AddUser() {
  const dispatch = useAppDispatch()
  const { userForm, editingUser }=useAppSelector((state)=>state.user)

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {editingUser?"Edit User":"Add User"}
        </h2>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Name</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={userForm.name}
            onChange={(e)=>dispatch(setName(e.target.value))}
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Age</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={userForm.age}
            onChange={(e)=>dispatch(setAge(e.target.value))}
            placeholder="Enter age"
          />
        </div>

        <div>
          <label htmlFor="ff" className="container">
            <div className="flex items-center gap-2">
              <input
            id="ff"
            type="checkbox"
            className="w-4 h-4 accent-indigo-500"
            checked={userForm.job}
            onChange={(e)=>dispatch(setJob(e.target.checked))}
          />
          <span style={{userSelect:"none"}} className="text-sm text-gray-700 user">Employed</span>
            </div>
          </label>
        </div>

        <button
          onClick={()=>dispatch(addUser())}
          className={`w-full py-2 rounded-lg font-medium text-white transition ${
            editingUser?"bg-yellow-500 hover:bg-yellow-600"
                       :"bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {editingUser?"Update User":"Add User"}
        </button>
      </div>
    </div>
  );
}

export default AddUser;