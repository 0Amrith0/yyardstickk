import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UpgradePage = ({ authUser }) => {
  const navigate = useNavigate();

  const { mutate: upgrade, isLoading } = useMutation({ 
    mutationFn: async () => {
      const res = await fetch(`/api/subscriptions/${authUser.tenant.tenantName.toLowerCase()}/upgrade`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upgrade failed");
      return data;
    },
    onSuccess: () => {
      toast.success("Upgraded to Pro!");
      navigate("/");
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <button 
        onClick={() => upgrade()} 
        className="btn bg-green-600 text-white hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? "Upgrading..." : "Upgrade to Pro"}
      </button>
    </div>
  );
};

export default UpgradePage;
