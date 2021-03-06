import deepFreeze from 'deep-freeze';

import { getTopicsForNarrow, getLastMessageTopic, getTopicsInScreen } from '../topicSelectors';
import { homeNarrow, streamNarrow } from '../../utils/narrow';

describe('getTopicsForNarrow', () => {
  test('when no topics return an empty list', () => {
    const state = deepFreeze({});

    const topics = getTopicsForNarrow(homeNarrow)(state);

    expect(topics).toEqual([]);
  });

  test('when there are topics in the active narrow, return them as string array', () => {
    const state = deepFreeze({
      streams: [{ stream_id: 123, name: 'hello' }],
      topics: {
        123: [{ name: 'hi' }, { name: 'wow' }],
      },
    });

    const topics = getTopicsForNarrow(streamNarrow('hello'))(state);

    expect(topics).toEqual(['hi', 'wow']);
  });
});

describe('getLastMessageTopic', () => {
  test('when no messages in narrow return an empty string', () => {
    const state = deepFreeze({
      messages: {},
    });

    const topic = getLastMessageTopic(homeNarrow)(state);

    expect(topic).toEqual('');
  });

  test('when one or more messages return the topic of the last one', () => {
    const narrow = streamNarrow('hello');
    const state = deepFreeze({
      messages: {
        [JSON.stringify(narrow)]: [{ id: 1 }, { id: 2, subject: 'some topic' }],
      },
    });

    const topic = getLastMessageTopic(narrow)(state);

    expect(topic).toEqual('some topic');
  });
});

describe('getTopicsInScreen', () => {
  test('when no topics loaded for given stream return undefined', () => {
    const state = deepFreeze({
      nav: {
        index: 0,
        routes: [
          {
            routeName: 'topics',
            params: { streamId: 123 },
          },
        ],
      },
      streams: [],
      topics: {},
      mute: [],
      unread: {
        streams: [],
      },
    });

    const topics = getTopicsInScreen(state);

    expect(topics).toEqual(undefined);
  });

  test('when topics loaded for given stream return them', () => {
    const state = deepFreeze({
      nav: {
        index: 0,
        routes: [
          {
            routeName: 'topics',
            params: { streamId: 123 },
          },
        ],
      },
      streams: [],
      topics: {
        123: [{ name: 'topic', max_id: 456 }],
      },
      mute: [],
      unread: {
        streams: [],
      },
    });

    const topics = getTopicsInScreen(state);

    expect(topics).toEqual([{ name: 'topic', max_id: 456, isMuted: false, unreadCount: 0 }]);
  });

  test('TODO', () => {
    const state = deepFreeze({
      nav: {
        index: 0,
        routes: [
          {
            routeName: 'topics',
            params: { streamId: 1 },
          },
        ],
      },
      streams: [{ stream_id: 1, name: 'stream 1' }],
      topics: {
        1: [
          { name: 'topic 1', max_id: 5 },
          { name: 'topic 2', max_id: 6 },
          { name: 'topic 3', max_id: 7 },
          { name: 'topic 4', max_id: 8 },
          { name: 'topic 5', max_id: 9 },
        ],
      },
      mute: [['stream 1', 'topic 1'], ['stream 1', 'topic 3'], ['stream 2', 'topic 2']],
      unread: {
        streams: [
          {
            stream_id: 1,
            topic: 'topic 2',
            unread_message_ids: [1, 5, 6],
          },
          {
            stream_id: 1,
            topic: 'topic 4',
            unread_message_ids: [7, 8],
          },
        ],
      },
    });
    const expected = [
      { name: 'topic 1', max_id: 5, isMuted: true, unreadCount: 0 },
      { name: 'topic 2', max_id: 6, isMuted: false, unreadCount: 3 },
      { name: 'topic 3', max_id: 7, isMuted: true, unreadCount: 0 },
      { name: 'topic 4', max_id: 8, isMuted: false, unreadCount: 2 },
      { name: 'topic 5', max_id: 9, isMuted: false, unreadCount: 0 },
    ];

    const topics = getTopicsInScreen(state);

    expect(topics).toEqual(expected);
  });
});
