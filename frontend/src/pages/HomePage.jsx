import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import MemberList from "../components/MemberList";
import toast from "react-hot-toast";

const HomePage = ({ authUser }) => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tenantId = authUser?.tenant?._id;


  const { data: notes, isLoading, isError } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await fetch("/api/notes", 
        { credentials: "include" 
          });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch notes");
      return data;
    },
  });


  const { mutate: deleteNote } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete note");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      toast.success("Note deleted successfully");
    },
  });


  const { data: members, isLoading: loadingMembers, isError: membersError } = useQuery({
    queryKey: ["tenantMembers", tenantId],
    queryFn: async () => {
      const res = await fetch(`/api/tenants/${tenantId}/members`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch members");
      return data;
    },
    enabled: !!tenantId,
  });

  return (
    <div className="flex gap-5 mt-4 justify-between ml-10">
      <div className="flex flex-col gap-6">
        <div className="text-black bg-white shadow-2xl shadow-gray-400 rounded-md w-max p-4">
          <h1 className="text-2xl font-bold">
            Welcome to {authUser?.tenant?.tenantName}'s dashboard! 
          </h1>
          <p className="text-md">Email: {authUser.user.email}</p>
        </div>

        <div className="bg-blue-100 w-max rounded-xl p-4">
          {isLoading && <p>Loading notes...</p>}
          {isError && <p className="text-red-500">Failed to load notes.</p>}

          {notes?.length > 0 ? (
            <div className={`grid gap-4 flex-wrap ${
                authUser?.user?.role === "Admin" ? "grid-cols-3" : "grid-cols-4"}`}>
              {notes.map((note, index) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  index={index}
                  handleEdit={() => navigate(`/notes/edit/${note._id}`)}
                  handleDelete={() => deleteNote(note._id)}
                />
              ))}
            </div>
          ) : (
            !isLoading && <p className="text-gray-500">No notes yet. Create one!</p>
          )}
        </div>
      </div>

      {authUser?.user?.role === "Admin" && (
        <div className="w-96 h-auto bg-blue-300 rounded-md p-4 mr-4">
          <h1 className="text-2xl font-semibold mb-3">Invite your members</h1>

          {loadingMembers && <p>Loading members...</p>}
          {membersError && <p className="text-red-500">Failed to load members</p>}

          {members?.length > 0 ? (
            <div className="space-y-2">
              {members.map((member) => (
                <MemberList
                  key={member._id}
                  tenantId={tenantId}
                  email={member.email}
                />
              ))}
            </div>
          ) : (
            !loadingMembers && <p className="text-gray-500">No members yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
