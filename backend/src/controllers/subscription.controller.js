import Tenant from "../models/Tenant.model.js";

export const upgradeSubscription = async (req, res) => {
  try {
    const { tenantName } = req.params;


    const tenant = await Tenant.findOne({ tenantName });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    tenant.plan = "pro";
    tenant.notesCount = Infinity;
    
    await tenant.save();

    return res.status(200).json({ message: "Tenant upgraded to Pro", tenant });
  } catch (err) {
    console.error("upgradeSubscription error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
