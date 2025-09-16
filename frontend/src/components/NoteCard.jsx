import { Pencil, Trash2 } from "lucide-react";

const NoteCard = ({ note, index, handleEdit, handleDelete }) => {
  return (
    <div
      className="bg-white shadow-md shadow-gray-300 rounded-xl overflow-hidden 
      hover:shadow-xl hover:scale-[1.02] transition-transform duration-200" 
      style={{ width: "8cm", height: "6cm" }}
    >
      <div className="px-3 py-2 flex flex-col gap-1 text-gray-800" style={{ height: "4cm" }}>
        <span className="text-xs text-gray-500">#{index + 1}</span>
        <h3 className="text-md font-bold truncate">{note.title}</h3>
        <p className="text-sm text-gray-600 overflow-hidden text-ellipsis line-clamp-3">
          {note.content}
        </p>
      </div>

      <div className="flex justify-end items-center gap-3 px-3" style={{ height: "1cm" }}>
        <button onClick={() => handleEdit(note._id)} className="text-blue-400 hover:text-blue-800 transition">
          <Pencil size={18} />
        </button> 
        <button onClick={handleDelete} className="text-red-400 hover:text-red-800 transition">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
