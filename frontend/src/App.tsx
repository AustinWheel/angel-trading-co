//@ts-nocheck
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
import Header from "../components/header/header"
import SignUp from "../components/SignUp"
import Chat from "../components/Chat"

function App() {

  return (
    <div>
      <SignedOut>
        {/* <SignUp /> */}
        <Chat />
      </SignedOut>
      <SignedIn>
        <Header />
      </SignedIn>
    </div>
  )
}

export default App
