import React, { useState, useEffect } from 'react';
import { Calendar, Cloud } from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import ItineraryTimeline from './ItineraryTimeline';
import SortableItem from './SortableItem';
import tripService from '../../services/tripService';

const SmartItinerary = ({ itinerary, tripId, onUpdateItinerary }) => {
  const [localItinerary, setLocalItinerary] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // Add stable IDs if missing (for older trips)
    const processedItinerary = itinerary?.map((day, dIdx) => ({
      ...day,
      _id: day._id || `day-${dIdx}`,
      items: day.items?.map((item, iIdx) => ({
        ...item,
        _id: item._id || `item-${dIdx}-${iIdx}`
      })) || []
    })) || [];
    setLocalItinerary(processedItinerary);
  }, [itinerary]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the containers
    let activeContainerId = null;
    let overContainerId = null;

    for (const day of localItinerary) {
      if (day.items.find(i => i._id === activeId)) activeContainerId = day._id;
      if (day._id === overId) overContainerId = day._id; // Hovering over empty container
      else if (day.items.find(i => i._id === overId)) overContainerId = day._id;
    }

    if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) {
      return;
    }

    setLocalItinerary((prev) => {
      const activeItems = prev.find(d => d._id === activeContainerId).items;
      const overItems = prev.find(d => d._id === overContainerId).items;
      
      const activeIndex = activeItems.findIndex(i => i._id === activeId);
      const overIndex = overItems.findIndex(i => i._id === overId);

      const newItinerary = [...prev];
      const activeDayIdx = newItinerary.findIndex(d => d._id === activeContainerId);
      const overDayIdx = newItinerary.findIndex(d => d._id === overContainerId);

      const [removed] = newItinerary[activeDayIdx].items.splice(activeIndex, 1);
      
      // If hovering over empty day container, overIndex will be -1
      if (overIndex >= 0) {
        // determine if we are above or below
        const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newItinerary[overDayIdx].items.splice(overIndex + modifier, 0, removed);
      } else {
        newItinerary[overDayIdx].items.push(removed);
      }

      return newItinerary;
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let activeContainerId = null;
    let overContainerId = null;

    for (const day of localItinerary) {
      if (day.items.find(i => i._id === activeId)) activeContainerId = day._id;
      if (day._id === overId) overContainerId = day._id;
      else if (day.items.find(i => i._id === overId)) overContainerId = day._id;
    }

    if (!activeContainerId || !overContainerId) return;

    const activeDayIdx = localItinerary.findIndex(d => d._id === activeContainerId);
    const overDayIdx = localItinerary.findIndex(d => d._id === overContainerId);
    
    const activeItems = localItinerary[activeDayIdx].items;
    const overItems = localItinerary[overDayIdx].items;

    const activeIndex = activeItems.findIndex(i => i._id === activeId);
    const overIndex = overItems.findIndex(i => i._id === overId);

    if (activeContainerId === overContainerId && activeIndex !== overIndex) {
      // Reordering within the same day
      const newItinerary = [...localItinerary];
      const [removed] = newItinerary[activeDayIdx].items.splice(activeIndex, 1);
      newItinerary[activeDayIdx].items.splice(overIndex, 0, removed);
      
      setLocalItinerary(newItinerary);
      onUpdateItinerary(newItinerary);
      
      try {
        await tripService.updateTrip(tripId, { itinerary: newItinerary });
      } catch (err) {
        console.error('Failed to save itinerary order', err);
      }
    } else if (activeContainerId !== overContainerId) {
       // It was already moved during dragOver, we just need to save
       onUpdateItinerary(localItinerary);
       try {
         await tripService.updateTrip(tripId, { itinerary: localItinerary });
       } catch (err) {
         console.error('Failed to save itinerary order', err);
       }
    }
  };

  const getActiveItem = () => {
    if (!activeId) return null;
    for (const day of localItinerary) {
      const item = day.items.find(i => i._id === activeId);
      if (item) return item;
    }
    return null;
  };

  const activeItem = getActiveItem();

  if (!localItinerary || localItinerary.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-2xl border border-default">
        <h3 className="text-lg font-bold text-main mb-2">No Itinerary Yet</h3>
        <p className="text-sub mb-6 max-w-md mx-auto">Generate a weather-aware smart itinerary to see daily activity recommendations.</p>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-10">
        {localItinerary.map((day, index) => (
          <div key={day._id} className="bg-surface/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-default shadow-sm">
            <div className="border-b border-default pb-5 mb-2">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center text-primary-600 font-bold mb-1">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {day.date}
                  </div>
                  <h3 className="text-2xl font-black text-main">{day.dayTitle}</h3>
                </div>
                {day.weatherSummary && (
                  <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-lg border border-default shadow-sm shrink-0">
                    <Cloud className="w-4 h-4 text-dim" />
                    <span className="text-sm font-semibold text-main">{day.weatherSummary}</span>
                  </div>
                )}
              </div>
            </div>
            
            <ItineraryTimeline items={day.items} dayId={day._id} />
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <SortableItem item={activeItem} isDragOverlay={true} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SmartItinerary;

