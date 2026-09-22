import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { SORT_INGREDIENT_DRAG_TYPE } from '@utils';
import classnames from 'classnames';
import { useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import type { Ingredient } from '@utils';

import styles from './burger-constructor.module.css';

export type SortDragItem = {
  index: number;
  ingredient: Ingredient;
  width: number;
};

type BurgerConstructorIngredientProps = {
  ingredient: Ingredient;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDeleteClick: (ingredientId: string) => void;
};

export const BurgerConstructorIngredient = ({
  ingredient,
  index,
  onMove,
  onDeleteClick,
}: BurgerConstructorIngredientProps) => {
  const { id, _id, name, price, image_mobile } = ingredient;
  const ingredientId = id ?? _id;
  const ref = useRef<HTMLLIElement>(null);

  const [, dropRef] = useDrop<SortDragItem>({
    accept: SORT_INGREDIENT_DRAG_TYPE,
    hover: (item, monitor) => {
      if (!ref.current || item.index === index) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top;

      if (item.index < index && hoverClientY < hoverMiddleY) {
        return;
      }
      if (item.index > index && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag({
    type: SORT_INGREDIENT_DRAG_TYPE,
    item: (): SortDragItem => ({
      index,
      ingredient,
      width: ref.current?.getBoundingClientRect().width ?? 0,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreviewRef]);

  dragRef(dropRef(ref));

  return (
    <li
      ref={ref}
      className={classnames(styles.order_ingredient, {
        [styles.dragging]: isDragging,
      })}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        price={price}
        text={name}
        thumbnail={image_mobile}
        handleClose={() => onDeleteClick(ingredientId)}
      />
    </li>
  );
};
