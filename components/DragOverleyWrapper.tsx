import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React from 'react'
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement'
import { ElementsType, FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'

const DragOverleyWrapper = () => {
    const {elements} = useDesigner();
    const [draggedItem, setDraggedItem] = React.useState<Active | null>(null)

    useDndMonitor({
        onDragStart: (event) => {
            setDraggedItem(event.active)
        },
        onDragCancel: () => {
            setDraggedItem(null);
        },
        onDragEnd: () => {
            setDraggedItem(null);
        }
    })

    if(!draggedItem) return null;

    let node = <div>No drag overlay</div>;
    const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtn;

    if(isSidebarBtnElement) {
        const type = draggedItem.data?.current?.type as ElementsType;
        node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />
    }

    const isDesignElement = draggedItem.data?.current?.isDesignerElement;
    if(isDesignElement) {
        const elementId = draggedItem.data?.current?.elementId;
        const element = elements.find((el) => el.id === elementId);
        if(!element) node = <div>Element not found</div>;
        else {
            const DesignerElementComponent = FormElements[element.type].designerComponent;

            node = (
                <div 
                    className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none"
                >
                    <DesignerElementComponent elementInstance={element} />
                </div>
            )
        }
    }

    return (
        <DragOverlay>{node}</DragOverlay>
    )
}

export default DragOverleyWrapper