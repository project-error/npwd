import { useCallback, useEffect, useState } from 'react';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import { Message, MessageEvents } from '../../../../../typings/messages';
import { useConversationId, useSetMessages } from './state';

function useFetchMessages(page) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const conversationId = useConversationId();
  

  const getMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const resp = await fetchNui<ServerPromiseResp<Message[]>>(MessageEvents.FETCH_MESSAGES, {
        conversationId,
        page,
      });

      if (resp.data.length === 0) return;

      setList((prev) => [...prev, resp.data]);

      setLoading(false);
    } catch (e) {
      setError(e);
    }
  }, [page, conversationId]);

  useEffect(() => {
    if (page > 20) {
      getMessages();
    }
  }, [getMessages, page]);

  return { loading, error, list, currentPage, setCurrentPage };
}

export default useFetchMessages;
