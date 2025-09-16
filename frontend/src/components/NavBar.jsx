import { Link, useNavigate } from 'react-router-dom'
import { BiLogOut } from "react-icons/bi";
import { PlusIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "react-hot-toast"

const NavBar = ({authUser}) => {

    const tenantName = authUser?.tenant?.tenantName;

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleLogout = async() => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Logged out successfully!");
        queryClient.invalidateQueries(["authUser"]); 
        navigate("/login");
      } else {
        toast.error(data.error || "Logout failed");
      }
    
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout.");
    }
  }

    return (
        <div className='bg-blue-500 shadow-xl shadow-gray-800'>
            <div className=' w-full h-16 flex justify-between items-center px-5'>
                <div className='flex justify-between items-center gap-2'>
                    <Link to="/">
                        <h1 className='text-3xl font-bold text-white'>Dashboard</h1>
                    </Link>
                    <span className='btn btn-xs rounded-md bg-black text-white text-xs'>
                        {tenantName || "Tenant"}
                    </span>
                </div>

                {authUser?.user?.role === "Admin" && 
                <button className='btn flex items-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white 
                transform transition-transform duration-200 hover:scale-110'>
                    <Link to="/upgrade">
                        Switch to PRO
                    </Link>
                </button> 
                }

                <div className='flex justify-between items-center gap-2'>
                    <button>
                    <Link to="/create" className='btn bg-blue-300 hover:bg-blue-400 rounded-xl transform 
                    transition-transform duration-200 hover:scale-110'>
                            <PlusIcon  size={15}/> 
                            <span className="ml-2 hidden md:inline">Create</span>
                        </Link> 
                    </button>
                    <button 
                    onClick={handleLogout} 
                    className="btn flex items-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white 
                    px-3 py-2 transform transition-transform duration-200 hover:scale-110">
                        <BiLogOut size={20} />
                        <span className="ml-2 hidden md:inline">Log out</span>
                    </button>
                </div>
            </div>
        </div>
        )
}

export default NavBar