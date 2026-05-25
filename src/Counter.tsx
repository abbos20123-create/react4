import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { addTen, decrement, increment } from "./redux/counterSlice"


function Counter() {
  
    const dispatch = useAppDispatch()
    const {count}=useAppSelector((state)=>state.counter)




 

    return (
    <section className="max-w-sm w-full mx-auto p-6 bg-linear-to-br from-white to-gray-500 dark:from-gray-800/80 dark:to-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl">
      <header className="flex flex-col items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Counter</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Simple stateful counter with accessible controls</p>
      </header>
      <div className="flex flex-col items-center gap-4">
        <div
          role="status"
          aria-live="polite"
          className="px-6 py-4 rounded-lg bg-white dark:bg-gray-800 shadow-inner text-indigo-600 dark:text-indigo-300 text-6xl font-extrabold tracking-tight w-full text-center transition-transform duration-150"
        >
          {count}
        </div>

        <div className="flex gap-3">
          <button
            aria-label="Increment"
            onClick={() => dispatch(increment())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 active:scale-95 transition transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add
          </button>

          <button
            aria-label="Decrement"
            onClick={() => dispatch(decrement())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-amber-900 hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-200 active:scale-95 transition transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Subtract
          </button>

          <button
            aria-label="Add ten"
            onClick={() => dispatch(addTen())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 active:scale-95 transition transform"
          >
            +10
          </button>
        </div>
      </div>
    </section>
    
  )
}

export default Counter