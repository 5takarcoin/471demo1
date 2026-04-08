const ScheduleModal = ({ isOpen, onClose, candidateName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Schedule Interview</h2>
        <p className="text-gray-600 mb-6">Candidate: <span className="font-bold text-black">{candidateName}</span></p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <input type="datetime-local" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meeting Link</label>
            <input type="url" placeholder="https://zoom.us/j/..." className="w-full border p-2 rounded" />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded font-bold">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-black text-white rounded font-bold">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};