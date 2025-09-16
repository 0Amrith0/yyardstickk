import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const MemberList = ({ tenantId, email }) => {
  const queryClient = useQueryClient();


  const { mutate: inviteMember, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/tenants/${tenantId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to invite member");
      return data;
    },
    onSuccess: () => {
      toast.success(`Invitation sent to ${email}`);
      queryClient.invalidateQueries(["tenantMembers", tenantId]);
    },
  });

  return (
    <div className="flex items-center justify-between border p-2 rounded-md shadow-sm">
      <span className="text-gray-700">{email}</span>
      <button
        onClick={() => inviteMember()}
        className="btn bg-blue-600 text-white hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Inviting..." : "Invite"}
      </button>
    </div>
  );
};

export default MemberList;
