import { MdOutlineMail, MdPassword } from "react-icons/md"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { useState } from "react"


const SignUpPage = () => {

  const queryClient = useQueryClient();

  const [signupData, setSignupData] = useState({
    email: "",
    password: "" 
  })

  const { mutate: signupMutation, isError, isLoading, error} = useMutation({
    mutationFn: async({ email, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if(!res.ok) {
          throw new Error(data.error || "Sign up failed");
        }

        return data;

      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["authUser"]})
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  }

  const handleInputChange = (e) => {
    setSignupData({...signupData, [e.target.name]: e.target.value})
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-black">Create your account</h1>
        <label className='w-96 input input-bordered rounded flex items-center gap-2'>
          <MdOutlineMail size={12}/>
          <input
            type='email'
            className='grow'
            placeholder='Email'
            name='email'
            onChange={handleInputChange}
            value={signupData.email}
          />
        </label>

        <label className='w-96 input input-bordered rounded flex items-center gap-2'>
          <MdPassword />
          <input
            type='password'
            className='grow'
            placeholder='Password'
            name='password'
            onChange={handleInputChange}
            value={signupData.password}
          />
        </label>

        <button className='w-96 btn bg-blue-600 hover:bg-blue-700 rounded-2xl text-white'>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
        {isError && <p className='text-red-500'>{error.message}</p>}
        <div className='w-96 flex flex-col gap-2 mt-6'>
        <p className='text-black text-lg'>Already have an account?</p>
        <Link to='/login'>
          <button className='btn rounded-2xl bg-blue-600 hover:bg-blue-700 text-white btn-outline w-full'>Login</button>
        </Link>
      </div>
      </form>
    </div>
  )
}

export default SignUpPage