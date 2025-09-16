import Note from "../models/Note.model.js";
import Tenant from "../models/Tenant.model.js";

export const createNotes = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "All the fields are required" });
        }

        const tenant = await Tenant.findById(tenantId)
        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }
        
        const count = await Note.countDocuments({ tenantId });

        if (tenant.plan === "free" && count >= 3) {
            return res.status(403).json({ error: " * Limit reached. Upgrade to Pro." });
        }

        const newNote = await Note.create({
            title,
            content,
            tenantId: req.user.tenantId,
            authorId: req.user._id,
        });

        return res.status(201).json({message: "Note created successfully", newNote});

    } catch (error) {
        console.log("Error in createNotes controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllNotes = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const notes = await Note.find({ tenantId }).sort({ createdAt: -1 });

        res.status(200).json(notes);
    } catch (error) {
        console.log("Error in getAllNotes controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getNoteById = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const { id } = req.params

        const note = await Note.findOne({ _id: id, tenantId: tenantId });
        if(!note) return res.status(400).json({error: "Note not found"});

        res.status(200).json({note});

    } catch (error) {
        console.log("Error in getNoteById controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateNote = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const { id } = req.params;
        const { title, content } = req.body;

        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, tenantId: tenantId }, 
            { title, content }, 
            { new : true });

        if(!updatedNote) return res.status(400).json({error: "id cannot be found"});

        res.status(200).json({ success: true, data: updatedNote });

    } catch (error) {
        console.log("Error in updateNote controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteNote = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const { id } = req.params;

        const note = await Note.findOneAndDelete({ _id: id, tenantId: tenantId });
        if(!note) return res.status(400).json({ error: "id cannot be found" });

        return res.status(200).json({ message: "Note deleted successfully" });

    } catch (error) {
        console.log("Error in deleteNote controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}