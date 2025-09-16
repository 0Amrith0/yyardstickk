import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [notes, setNotes] = useState({ title: "", content: "" });


    const { data: editNote, isLoading, isError } = useQuery({
        queryKey: ["editNote", id],
        queryFn: async () => {
        const res = await fetch(`/api/notes/${id}`, 
            { credentials: "include" 
            });
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch note");
        
        return data;
        },
    });


    useEffect(() => {
        if (editNote) {
        setNotes({ 
            title: editNote.title ?? "", 
            content: editNote.content ?? "" });
        }
    }, [editNote]);


    const { mutate: updateNote, isLoading: isUpdating, isError: updateError, error } = useMutation({
        mutationFn: async ({ title, content }) => {
            const res = await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json" 
            },
            credentials: "include",
            body: JSON.stringify({ title, content }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error("Failed to update note");
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["notes"]);
            toast.success("Note updated successfully");
            navigate("/")
        },
        });

    const handleInputChange = (e) => {
        setNotes((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateNote(notes);
    };

    if (isLoading) return <p>Loading note...</p>;
    if (isError) return <p className="text-red-500">Failed to load note</p>;

    return (
        <div className="flex min-h-screen items-center justify-center px-6">
        <form
            className="flex flex-col bg-blue-400 rounded-xl shadow-md shadow-gray-900 p-6 gap-4 w-full max-w-md"
            onSubmit={handleSubmit}
        >
            <h1 className="font-bold text-3xl">Edit Note</h1>
            <input
            type="text"
            name="title"
            placeholder="Title"
            className="input input-bordered rounded-md w-full"
            onChange={handleInputChange}
            value={notes.title ?? ""}
            />
            <textarea
            name="content"
            placeholder="Content"
            className="textarea textarea-bordered rounded-md h-32 w-full"
            onChange={handleInputChange}
            value={notes.content ?? ""}
            />
            <button className="btn rounded-md bg-blue-600 hover:bg-blue-700 text-white w-auto">
            {isUpdating ? "Saving changes..." : "Save"}
            </button>
            {updateError && <p className="text-red-500">{error.message}</p>}
        </form>
        </div>
    );
    };

export default EditPage;
