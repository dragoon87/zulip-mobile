/* @flow */
import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import type { TopicExtended } from '../types';
import TopicItem from '../streams/TopicItem';
import { LoadingIndicator, SectionSeparatorBetween, SearchEmptyState } from '../common';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'column',
  },
});

type Props = {
  topics: ?(TopicExtended[]),
  onPress: (stream: string, topic: string) => void,
};

export default class TopicList extends PureComponent<Props> {
  props: Props;

  static defaultProps = {
    showDescriptions: false,
    showSwitch: false,
    selected: false,
    streams: [],
  };

  render() {
    const { topics, onPress } = this.props;

    if (!topics) {
      return <LoadingIndicator size={40} />;
    }

    if (topics.length === 0) {
      return <SearchEmptyState text="No topics found" />;
    }

    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        style={styles.list}
        data={topics}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <TopicItem
            name={item.name}
            isMuted={item.isMuted}
            unreadCount={item.unreadCount}
            onPress={onPress}
          />
        )}
        SectionSeparatorComponent={SectionSeparatorBetween}
      />
    );
  }
}
