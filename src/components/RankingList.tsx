"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { haptic } from "@/lib/native";

export const RANK_TILE = [
  "bg-brand text-white shadow-[0_6px_20px_-6px_rgb(255_111_145/0.7)]",
  "bg-accent/30 text-[#d9c7ff]",
  "bg-accent/18 text-[#c3adf5]",
  "bg-white/8 text-muted",
  "bg-white/5 text-faint",
];

const verticalOnly: Modifier = ({ transform }) => ({ ...transform, x: 0 });

type Props = {
  order: string[];
  onChange: (order: string[]) => void;
};

export function RankingList({ order, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = order.indexOf(String(active.id));
    const to = order.indexOf(String(over.id));
    onChange(arrayMove(order, from, to));
  };

  const move = (index: number, delta: -1 | 1) => {
    const to = index + delta;
    if (to < 0 || to >= order.length) return;
    onChange(arrayMove(order, index, to));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2 pl-1 text-xs font-bold">
        <span className="flex items-center gap-1.5 text-muted">
          <span className="text-p1">▲</span> いちばん当てはまる
        </span>
        <span className="text-faint">ドラッグで入れ替え</span>
      </div>
      <div className="flex gap-2">
        {/* 順位ラベルは固定し、項目だけが動く */}
        <ol className="flex flex-col gap-2" aria-hidden>
          {order.map((_, i) => (
            <li
              key={i}
              className={`flex h-14 w-12 shrink-0 items-baseline justify-center gap-px rounded-2xl pt-3 font-display leading-none ${RANK_TILE[i]}`}
            >
              <span className="text-[26px] font-black">{i + 1}</span>
              <span className="text-[11px] font-bold">位</span>
            </li>
          ))}
        </ol>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[verticalOnly]}
          onDragStart={() => haptic("pick")}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <ul className="flex min-w-0 flex-1 flex-col gap-2">
              {order.map((item, i) => (
                <SortableRow
                  key={item}
                  item={item}
                  index={i}
                  isFirst={i === 0}
                  isLast={i === order.length - 1}
                  onMove={move}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SortableRow({
  item,
  index,
  isFirst,
  isLast,
  onMove,
}: {
  item: string;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMove: (index: number, delta: -1 | 1) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex h-14 items-center gap-1 rounded-2xl pr-1.5 transition-[background-color,box-shadow] ${
        isDragging
          ? "relative z-10 bg-surface-3 shadow-[0_18px_40px_-10px_rgb(0_0_0/0.8)] ring-2 ring-accent"
          : "bg-surface-2 ring-1 ring-line"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        aria-label={`${index + 1}位: ${item}（ドラッグで並べ替え）`}
        className="flex h-full min-w-0 flex-1 cursor-grab touch-none items-center gap-2.5 pl-3 select-none active:cursor-grabbing"
      >
        <GripIcon />
        <span className="min-w-0 text-[15px] leading-tight font-bold break-words text-ink min-[360px]:text-base">
          {item}
        </span>
      </div>
      <MoveButton label={`${item}を上へ`} disabled={isFirst} onClick={() => onMove(index, -1)}>
        <Chevron up />
      </MoveButton>
      <MoveButton label={`${item}を下へ`} disabled={isLast} onClick={() => onMove(index, 1)}>
        <Chevron />
      </MoveButton>
    </li>
  );
}

function MoveButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition active:scale-90 active:bg-white/10 active:text-ink disabled:opacity-20 min-[360px]:w-10"
    >
      {children}
    </button>
  );
}

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className={up ? "" : "rotate-180"}>
      <path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" className="shrink-0 fill-white/25" aria-hidden>
      {[2, 9, 16].map((y) => (
        <g key={y}>
          <circle cx="2" cy={y} r="1.8" />
          <circle cx="8" cy={y} r="1.8" />
        </g>
      ))}
    </svg>
  );
}
