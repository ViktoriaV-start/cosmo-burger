import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAppSelector } from '@hooks/redux.ts';
import { getIngredientById, getIngredients } from '@services/ingredients/reducer.ts';

import type { Ingredient } from '@utils';

export type IngredientLocationState = {
  isModal?: boolean;
} | null;

type UseIngredientPageReturn = {
  ingredient: Ingredient | null;
  isLoaded: boolean;
  isModal: boolean;
  onCloseModal: () => void;
};

export const useIngredientPage = (): UseIngredientPageReturn => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ingredient = useAppSelector((state) => getIngredientById(state, id));
  const isLoaded = useAppSelector(getIngredients).length > 0;
  const isModal = Boolean((location.state as IngredientLocationState)?.isModal);

  const onCloseModal = (): void => {
    void navigate('/');
  };

  return { ingredient, isLoaded, isModal, onCloseModal };
};
