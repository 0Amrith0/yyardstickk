import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreatePage = () => {

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [note, setNote] = useState({
    title: "",
    content: ""
  })

  const { mutate: noteMutation, isError, isLoading, error } = useMutation({
    mutationFn: async ({ title, content}) => {
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ title, content }),
          credentials: "include",
        });

        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Failed to create the note");
        }
        return data;

      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("New note created!")
      queryClient.invalidateQueries(["notes"])
      navigate("/");
    }
  })

  const handleInputChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    noteMutation(note)
  }

  return (
  <div className="flex min-h-screen items-center justify-center px-6">
    <form className="flex flex-col bg-blue-300 rounded-xl shadow-md shadow-gray-900 p-6 gap-4 w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h1 className="font-bold text-3xl">Add your new task</h1>
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="input input-bordered rounded-md w-full"
        onChange={handleInputChange}
        value={note.title} 
      />

      <textarea
        name="content"
        placeholder="Content"
        className="textarea textarea-bordered rounded-md h-32 w-full"
        onChange={handleInputChange}
        value={note.content}
      />

      <button className="btn rounded-md bg-blue-600 hover:bg-blue-700 text-white w-auto">
        {isLoading ? "Creating....." : "Add"}
      </button>
      {isError && <p className='text-red-600'>{error.message}</p>}
    </form>
  </div>
)

}

export default CreatePage
