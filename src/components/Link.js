import React from "react";
import { TouchableOpacity, View, Text, Linking } from "react-native";

export default class LinkButton extends React.Component {
  handleClick = () => {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        Toast.show(
          "Cannot open the link. Try accessing it with your PC browser.",
          Toast.LONG,
          Toast.BOTTOM
        );
      }
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handleClick}>
        <View>
          <Text style={{ color: "blue", textDecorationLine: "underline" }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
