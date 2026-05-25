import { Provider } from "react-redux"
import store from "./redux/store"
import AddBook from "./AddUser"
import BookList from "./UserList"




function App() {
  return (
    <Provider store={store}>
      <AddBook/>   
      <BookList/>
    </Provider>
  )
}

export default App