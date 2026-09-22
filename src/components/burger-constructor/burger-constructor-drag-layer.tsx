import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { SORT_INGREDIENT_DRAG_TYPE } from '@utils';
import { useDragLayer } from 'react-dnd';

import type { SortDragItem } from './burger-constructor-ingredient';
import type { CSSProperties } from 'react';

import styles from './burger-constructor.module.css';

export const BurgerConstructorDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    isDragging:
      monitor.isDragging() && monitor.getItemType() === SORT_INGREDIENT_DRAG_TYPE,
    item: monitor.getItem<SortDragItem>(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !item || !currentOffset) {
    return null;
  }

  const { ingredient, width } = item;

  const style: CSSProperties = {
    transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
    width,
  };

  return (
    <div className={styles.drag_layer} style={style}>
      <div className={styles.order_ingredient}>
        <DragIcon type="primary" />
        <ConstructorElement
          price={ingredient.price}
          text={ingredient.name}
          thumbnail={ingredient.image_mobile}
        />
      </div>
    </div>
  );
};
