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

export var PIECE_CHARS = {
  pawn: { W: '♙', B: '♟' },
  rook: { W: '♖', B: '♜' },
  knight: { W: '♘', B: '♞' },
  bishop: { W: '♗', B: '♝' },
  queen: { W: '♕', B: '♛' },
  king: { W: '♔', B: '♚' }
}

const renderPromotionModal = (promotionParams, lang, promotionCallback) => {
  return (
    <Modal
      isVisible={!!promotionParams}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={1}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={1000}
      animationOutTiming={1000}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}
    >
      <View style={styles.mainContainer}>
        <ScrollView>
          <Text style={styles.text}>{strings.promotePawn[lang]}</Text>
          <Text>{`\n`}</Text>
          <View style={styles.optionsRow}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => {
                  promotionCallback("knight");
                }}
              >
                <Text style={[styles.actionBtnTxt, {fontSize: 30}]}>{PIECE_CHARS.knight[promotionParams.color]}</Text>
                <Text style={styles.actionBtnTxt}>{strings.pieces.knight[lang]}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => {
                  promotionCallback("rook");
                }}
              >
                <Text style={[styles.actionBtnTxt, {fontSize: 30}]}>{PIECE_CHARS.rook[promotionParams.color]}</Text>
                <Text style={styles.actionBtnTxt}>{strings.pieces.rook[lang]}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.optionsRow}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => {
                  promotionCallback("bishop");
                }}
              >
                <Text style={[styles.actionBtnTxt, {fontSize: 30}]}>{PIECE_CHARS.bishop[promotionParams.color]}</Text>
                <Text style={styles.actionBtnTxt}>{strings.pieces.bishop[lang]}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => {
                  promotionCallback("queen");
                }}
              >
                <Text style={[styles.actionBtnTxt, {fontSize: 30}]}>{PIECE_CHARS.queen[promotionParams.color]}</Text>
                <Text style={styles.actionBtnTxt}>{strings.pieces.queen[lang]}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    color: '#fff',
  },
  optionsRow: {
    flexDirection: "row",
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  buttonContainer: {
    marginVertical: 2,
    marginHorizontal: 5
  },
  actionBtn: {
    backgroundColor: '#d54e88',
    width: 100,
    height: 40, 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
  actionBtnTxt: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default renderPromotionModal;
