import { useFeedPage } from '@/pages/feed-page/use-feed-page';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { IngredientLocationState } from '@/pages/ingredient-page/use-ingredient-page';
import type { FeedOrder } from '@utils';

type UseFeedOrderPageReturn = {
  order: FeedOrder | null;
  isModal: boolean;
  onCloseModal: () => void;
};

export const useFeedOrderPage = (): UseFeedOrderPageReturn => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useFeedPage();
  const order = orders.find((item) => String(item.number) === id) ?? null;
  const isModal = Boolean((location.state as IngredientLocationState)?.isModal);

  const onCloseModal = (): void => {
    void navigate('/feed');
  };

  return { order, isModal, onCloseModal };
};
