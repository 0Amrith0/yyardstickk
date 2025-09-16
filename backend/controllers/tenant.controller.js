import User from "../models/User.model.js";
import Tenant from "../models/Tenant.model.js";

export const getTenantMembers = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const members = await User.find({ tenantId, role: "Member", isInvited: false }).select("-password");
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching tenant members:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const user = await User.findOne({ email, tenantId, role: "Member" });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isInvited) {
      return res.status(400).json({ error: "User already invited" });
    }

    user.isInvited = true;
    await user.save();

    return res.status(201).json({ message: `Invitation sent to ${email}` });
  } catch (error) {
    console.error("Error inviting member:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
