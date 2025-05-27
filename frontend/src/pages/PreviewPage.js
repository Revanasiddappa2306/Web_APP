import { DndContext } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableField({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

const PreviewPage = ({ fieldConfigs, fieldOrder, setFieldOrder, onGenerate, customPageName }) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fieldOrder.indexOf(active.id);
      const newIndex = fieldOrder.indexOf(over.id);
      setFieldOrder(arrayMove(fieldOrder, oldIndex, newIndex));
    }
  };

  // Use navigate from react-router-dom if available, or fallback
  const navigate = window.history.back ? () => window.history.back() : () => {};

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-left">Preview: {customPageName}</h2>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={fieldOrder} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldOrder.map((fieldKey) => (
              <SortableField key={fieldKey} id={fieldKey}>
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                  <label className="block font-semibold mb-2">
                    {fieldConfigs[fieldKey]?.label || fieldKey}
                  </label>
                  <input
                    type="text"
                    className="text-black w-full p-2 rounded border"
                    disabled
                    placeholder={fieldConfigs[fieldKey]?.label || ""}
                  />
                </div>
              </SortableField>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded text-sm"
          onClick={() => onGenerate(fieldOrder)}
        >
          Generate Page
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded text-sm"
          onClick={() => navigate("/component-selector")}
        >
          Back to Component Selector
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;