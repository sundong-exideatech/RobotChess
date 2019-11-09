import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView
} from "react-native";
import Modal from "react-native-modal";
import { strings } from "../config";

const renderSelectModeModal = (visible, selectModeMethod, lang) => {
  
  return (
    <Modal
      isVisible={visible}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={1}
    >
      <View style={styles.mainContainer}>
        <ScrollView>
          <Text style={styles.text}>{strings.selectMode[lang]}</Text>
          <Text style={{ margin: 4, textAlign: 'center', color: '#fff' }}>
            {strings.singleplayerDescription[lang]}
          </Text>
          <View style={{ margin: 4, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity 
              style={[styles.actionBtn, {backgroundColor: '#3ba4c3'}]}
              onPress={() => {
                selectModeMethod(null);
              }}
            >
              <Text style={styles.actionBtnTxt}>{strings.singleplayer[lang]}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ margin: 4, textAlign: 'center', color: '#fff' }}>{strings.playAgainstRobot[lang]}</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, {backgroundColor: '#6c5b7b'}]}
              onPress={() => {
                selectModeMethod({ depth: 2 });
              }}
            >
              <Text style={styles.actionBtnTxt}>{strings.easy[lang]}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, {backgroundColor: '#c06c84'}]}
              onPress={() => {
                selectModeMethod({ depth: 3 });
              }}
            >
              <Text style={styles.actionBtnTxt}>{strings.medium[lang]}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, {backgroundColor: '#f67280'}]}
              onPress={() => {
                selectModeMethod({ depth: 4 });
              }}
            >
              <Text style={styles.actionBtnTxt}>{strings.hard[lang]}</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.warningText}>
            {strings.hardModeWarning[lang]}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#6e1f41",
    padding: 22,
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 6,
    color: '#fff',
  },
  optionsRow: {
    flexDirection: "column",
    padding: 1,
    justifyContent: 'center', alignItems: 'center'
  },
  buttonContainer: {
    flex: 1,
    margin: 2
  },
  warningText: {
    margin: 4,
    color: "#f67280",
    fontStyle: "italic"
  },
  actionBtn: {
    backgroundColor: '#64b9d2',
    width: 200,
    height: 40, 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  actionBtnTxt: {
    color: '#fff',
    fontSize: 16
  }
});

export default renderSelectModeModal;
