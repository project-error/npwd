import React from 'react';
import { AppIcon, AppWrapper } from '@ui/components';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { Link } from 'react-router-dom';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { IApp } from '@os/apps/config/apps';
import { CSS } from '@dnd-kit/utilities';

export const HomeApp: React.FC = () => {
  const { apps, setApps } = useApps();
  const [activeId, setActiveId] = React.useState(null);
  const externalApps = useExternalApps();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (activeId !== over.id) {
      setApps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <AppWrapper>
      <div className="mx-auto w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={({ active }) => {
            if (!active) {
              return;
            }

            setActiveId(active.id);
          }}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="py-8 pt-20 text-center">
            <h1 className="text-7xl font-medium text-white">12.43</h1>
          </div>

          <SortableContext items={apps} strategy={rectSortingStrategy}>
            <div className="mx-auto grid w-full grid-cols-4 gap-y-4">
              {apps &&
                [...apps, ...externalApps].map((app) => <SortableAppItem key={app.id} {...app} />)}
            </div>
          </SortableContext>

          {/*<div className="absolute bottom-5 left-8 right-8">
            <div className="h-20 w-full rounded-lg bg-gray-200/30 backdrop-blur">
              {apps &&
                apps.slice(0, 4).map((app) => (
                  <div className="float-left h-full w-1/4" key={app.id}>
                    <div className="m-0 flex h-full w-full items-center justify-center p-0">
                      <Link to={app.path}>
                        <AppIcon {...app} />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>*/}
        </DndContext>
      </div>
    </AppWrapper>
  );
};

const SortableAppItem = (app: IApp) => {
  const { transition, transform, attributes, setNodeRef, listeners } = useSortable({
    id: app.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex items-center justify-center"
    >
      <Link to={app.path}>
        <AppIcon {...app} />
      </Link>
    </div>
  );
};
