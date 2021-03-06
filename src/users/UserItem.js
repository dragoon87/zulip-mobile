/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Presence } from '../types';
import { Avatar, RawLabel, Touchable, UnreadCount } from '../common';
import { BRAND_COLOR } from '../styles';

const componentStyles = StyleSheet.create({
  selectedRow: {
    backgroundColor: BRAND_COLOR,
  },
  text: {
    marginLeft: 8,
  },
  selectedText: {
    color: 'white',
  },
  textEmail: {
    fontSize: 10,
    color: '#999',
  },
  textWrapper: {
    flex: 1,
  },
});

type Props = {
  email: string,
  fullName: string,
  avatarUrl: string,
  presence?: Presence,
  isSelected?: boolean,
  showEmail?: boolean,
  unreadCount?: number,
  onPress: (email: string) => void,
};

export default class UserItem extends PureComponent<Props> {
  props: Props;

  static contextTypes = {
    styles: () => null,
  };

  handlePress = () => {
    const { email, onPress } = this.props;
    if (email && onPress) {
      onPress(email);
    }
  };

  render() {
    const { styles } = this.context;
    const { fullName, avatarUrl, presence, isSelected, unreadCount, showEmail, email } = this.props;

    return (
      <Touchable onPress={this.handlePress}>
        <View style={[styles.listItem, isSelected && componentStyles.selectedRow]}>
          <Avatar
            size={32}
            avatarUrl={avatarUrl}
            email={email}
            name={fullName}
            presence={presence}
            onPress={this.handlePress}
          />
          <View style={componentStyles.textWrapper}>
            <RawLabel
              style={[componentStyles.text, isSelected && componentStyles.selectedText]}
              text={fullName}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
            {showEmail && (
              <RawLabel
                style={[
                  componentStyles.text,
                  componentStyles.textEmail,
                  isSelected && componentStyles.selectedText,
                ]}
                text={email}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            )}
          </View>
          <UnreadCount count={unreadCount} inverse={isSelected} />
        </View>
      </Touchable>
    );
  }
}
