import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import SortableItem from './SortableItem';

const ItineraryTimeline = ({ items, dayId }) => {
  const { setNodeRef } = useDroppable({
    id: dayId,
  });

  if (!items || items.length === 0) {
    return (
      <div 
        ref={setNodeRef} 
        className="relative pl-6 lg:pl-8 border-l border-default mt-6 min-h-[100px] flex items-center justify-center bg-background/50 rounded-xl border-dashed"
      >
        <p className="text-dim text-sm">Drag items here to add to this day</p>
      </div>
    );
  }

  const itemIds = items.map(item => item._id);

  return (
    <div ref={setNodeRef} className="relative pl-6 lg:pl-8 border-l border-default mt-6 space-y-8 min-h-[100px]">
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem key={item._id} item={item} />
        ))}
      </SortableContext>
    </div>
  );
};

export default ItineraryTimeline;

