import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import NavBar from "./components/NavBar"
import UpgradePage from "./components/planUpgrade";
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage";
import CreatePage from "./pages/CreatePage"
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";
import EditPage from "./pages/EditPage";

function App() {

  const {data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include"
        });

        if (res.status === 400 || res.status === 401) {
          return null;
        }

        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser", data);
        return data;

      } catch (error) {
        throw error;
      }
    },
    retry: false
  })

  if(isLoading){
    return(
      <div className='h-screen flex justify-center items-center'>
        <Loader className="text-xs"/>
      </div>
    )
  }

  return (
    <>
      <div>
        
        {authUser && <NavBar authUser={authUser}/>}
        <Routes>
          <Route path="/notes/edit/:id" element={authUser?<EditPage /> : <Navigate to = "/login"/>} />
          <Route path="/login" element = {!authUser?<LoginPage /> : <Navigate to = "/"/>}/>
          <Route path="/signup" element = {!authUser?<SignUpPage /> : <Navigate to = "/"/>}/>
          <Route path="/create" element = {authUser?<CreatePage /> : <Navigate to = "/login"/>}/>
          <Route path="/" element = {authUser?<HomePage authUser={authUser}/> : <Navigate to = "/login"/>}/>
          <Route path="/upgrade" element={authUser?.user?.role === "Admin" ? <UpgradePage authUser={authUser}/> : <Navigate to="/"/>}/>
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App;
