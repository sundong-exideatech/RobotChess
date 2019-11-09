import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Button,
  StyleSheet
} from "react-native";
import Modal from "react-native-modal";
import { strings } from "../config";

const renderCheckmateModal = (checkmate, lang, exitCallback, playAgainstRobot, hideCallback) => {
  return (
    <Modal
      isVisible={!!checkmate}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={1}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={1000}
      animationOutTiming={1000}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}
      onSwipe={hideCallback}
      onBackdropPress={hideCallback}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.text}>
          {checkmate !== "D"
            ? checkmate === "W"
              ? playAgainstRobot==null ? strings.blackWon[lang] : strings.robotWon[lang]
              : strings.whiteWon[lang]
            : strings.draw[lang]}
        </Text>
        <Text>{`\n`}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={()=>{exitCallback('replay', playAgainstRobot)}}
          >
            <Text style={styles.actionBtnTxt}>{strings.newGame[lang]}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={hideCallback}
          >
            <Text style={styles.actionBtnTxt}>{strings.hideThis[lang]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#6e1f41",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    color: '#fff',
  },
  actionBtn: {
    backgroundColor: '#d54e88',
    width: 100,
    height: 40, 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  actionBtnTxt: {
    color: '#fff',
    fontSize: 16
  }
});

export default renderCheckmateModal;
