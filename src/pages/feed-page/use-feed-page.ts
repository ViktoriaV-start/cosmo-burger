import { FEED_MOCK } from '@utils/feed-mock.ts';

import type { OrdersFeed } from '@utils';

// Пока нет API ленты — отдаём тестовые данные; позже здесь будет подписка на WebSocket
export const useFeedPage = (): OrdersFeed => FEED_MOCK;
