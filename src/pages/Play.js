import React from "react";
import { View, Text, StatusBar, StyleSheet, Image } from "react-native";
import { Pieces } from "rsg-chess";
import ChessBoard from "rsg-chess-rn-graphics";
import getSizes from "../scripts/getSizes";
import NavigationContext from "../components/NavigationContext";
import renderCheckmateModal from "../components/CheckMateModal";
import renderPromotionModal from "../components/PromotionModal";
import renderSelectModeModal from "../components/SelectModeModal";
import { strings, colorPalettes, globalStyles } from "../config";
import MenuIcon from "../components/MenuIcon";
import SplashScreen from 'react-native-splash-screen';

// constant
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Players from '../constants/Players';
import RobotChessUtils from "../utils/RobotChessUtils"
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;

export var PIECE_CHARS = {
  pawn: { W: '♙', B: '♟' },
  rook: { W: '♖', B: '♜' },
  knight: { W: '♘', B: '♞' },
  bishop: { W: '♗', B: '♝' },
  queen: { W: '♕', B: '♛' },
  king: { W: '♔', B: '♚' }
}

export default class Play extends React.Component<Props> {
  static navigationOptions = {
    title: "Play",
    header: null,
    // drawerLabel: () => (
    //   <NavigationContext.Consumer>
    //     {data => {
    //       return (
    //         <Text style={globalStyles.drawerItemLabel}>
    //           {strings.play[data.lang]}
    //         </Text>
    //       );
    //     }}
    //   </NavigationContext.Consumer>
    // )
  };

  componentDidMount() {
    SplashScreen.hide()
  }

  render() {
    return (
      <NavigationContext.Consumer>
        {data => {
          const {
            width,
            height,
            self,
            game,
            selected,
            showValidMoves,
            handlePress,
            checkmate,
            promotionParams,
            lang,
            handleReplay,
            palette,
            rotated,
            promoteSelectedPawn,
            selectModeModal,
            selectMode,
            playAgainstRobot,
            wTime,
            bTime,
            active
          } = data;


          // To be clear:
          /// colorPalettes - array of all palettes
          // // palette - the id/name of the palette which will be dispalyed
          // // currentPaltte - object with params which will be used to configure the board
          const currentPalette = colorPalettes[palette];
          let sizes = getSizes(data.width, data.height);

          var turn = game.turn;
          var bTurnsArr = [];
          var wTurnsArr = [];
          var bMark = 0;
          var wMark = 0;
          for( var i=0; i<turn.length; i++ ){
            if( RobotChessUtils.checkValid(turn[i].piece) ){
              if( turn[i].piece.color == 'B' ){
                wTurnsArr.push(
                  <View key={i} style={{marginRight: 3, height: 30}}>
                    <Text style={{fontSize: 21}}>{turn[i].piece.char}</Text>
                    <View style={{position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{fontSize: 8, color: '#fff'}}>{RobotChessUtils.getMark(turn[i].piece.type)}</Text>
                    </View>
                  </View>
                )
                wMark += RobotChessUtils.getMark(turn[i].piece.type);
              } else if( turn[i].piece.color == 'W' ){
                bTurnsArr.push(
                  <View key={i} style={{marginRight: 3, height: 30}}>
                    <Text style={{fontSize: 21}}>{turn[i].piece.char}</Text>
                    <View style={{position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{fontSize: 8, color: '#fff'}}>{RobotChessUtils.getMark(turn[i].piece.type)}</Text>
                    </View>
                  </View>
                )
                bMark += RobotChessUtils.getMark(turn[i].piece.type);
              }
            }
          }

          return (
            <View
              style={[
                styles.container,
                { backgroundColor: currentPalette.background }
              ]}
            >
              <StatusBar hidden={true} />

              <View style={{position: 'absolute', left: 0, top: 0, width: LW, height: LH, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../../assets/images/Board.jpg')} style={{width: LW, height: LW/1125*2436}}/>
              </View>

              {/* <MenuIcon
                navigation={this.props.navigation}
                palette={currentPalette}
              /> */}

              <View style={{position: 'absolute', left: 0, top: RateWH>2 ? 40:0, paddingTop: RateWH>2 ? 50:10}}>
                <View style={{width: LW-20, borderBottomRightRadius: 15, borderTopRightRadius: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,0,1)', borderWidth: active=='B' ? 5:0, borderLeftWidth: 0, paddingHorizontal: 20, paddingVertical: 15, alignItems: 'flex-start'}}>
                  <Image source={playAgainstRobot == null ? Players[1].image : Players[2].image} style={{width: 130, height: 130, right: 10, bottom: RateWH>2 ? 50:20, position: 'absolute'}} />
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column'}}>
                      <Text style={{fontSize: 16, color: "#ffa800"}}>{strings.time[lang]}</Text>                    
                      <View style={{backgroundColor: active=='B' ? 'rgba(255,0,0,0.7)':'rgba(255,0,0,0.1)', width: 100, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                        <Text style={{fontSize: 30, color: "#fff"}}>{RobotChessUtils.getTimeStr(bTime)}</Text>
                      </View>                    
                    </View>
                    <View style={{flexDirection: 'column', marginLeft: 30}}>
                      <Text style={{fontSize: 16, color: "#ffa800"}}>{strings.mark[lang]}</Text>
                      <View style={{backgroundColor: 'rgba(0,255,0,0.3)', width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                        <Text style={{fontSize: 30, color: "#fff", fontWeight: 'bold'}}>{bMark}</Text>
                      </View>
                    </View>                
                  </View>
                  <View style={{backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', borderRadius: 5, marginTop: 10, width: '100%', height: 30, alignItems: 'center'}}>
                    {bTurnsArr}
                  </View>
                </View>
              </View>

              <View style={{position: 'absolute', right: 0, bottom: RateWH>2 ? 40:10, paddingTop: 50}}>
                <View style={{width: LW-20, borderBottomLeftRadius: 15, borderTopLeftRadius: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,0,1)', borderWidth: active=='W' ? 5:0, borderRightWidth: 0, paddingHorizontal: 20, paddingVertical: 15, alignItems: 'flex-end'}}>
                  <Image source={Players[0].image} style={{width: 130, height: 130, left: 10, bottom: RateWH>2 ? 50:20, position: 'absolute'}} />
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column'}}>
                      <Text style={{fontSize: 16, color: "#ffa800"}}>{strings.time[lang]}</Text>
                      <View style={{backgroundColor: active=='W' ? 'rgba(255,0,0,0.7)':'rgba(255,0,0,0.1)', width: 100, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                        <Text style={{fontSize: 30, color: "#fff"}}>{RobotChessUtils.getTimeStr(wTime)}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'column', marginLeft: 30}}>
                      <Text style={{fontSize: 16, color: "#ffa800"}}>{strings.mark[lang]}</Text>
                      <View style={{backgroundColor: 'rgba(0,255,0,0.3)', width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                        <Text style={{fontSize: 30, color: "#fff", fontWeight: 'bold'}}>{wMark}</Text>
                      </View>
                    </View>                
                  </View>
                  <View style={{backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', borderRadius: 5, marginTop: 10, width: '100%', height: 30, alignItems: 'center'}}>
                   {wTurnsArr}
                  </View>
                </View>
              </View>

              <View>
                <ChessBoard
                  self={self}
                  board={game.board}
                  boardWidth={sizes.width-(RateWH>2 ? 10:5)}
                  boardHeight={sizes.height-(RateWH>2 ? 10:5)}
                  selected={selected}
                  showValidMoves={showValidMoves}
                  pieceSize={sizes.fontSize-(RateWH>2 ? 10:5)}
                  onPress={handlePress}
                  {...currentPalette.props}
                  rotated={rotated}
                />
              </View>
              {renderCheckmateModal(checkmate, lang, handleReplay, playAgainstRobot, () => {
                self.setState({ checkmate: null });
              })}
              {promotionParams &&
                renderPromotionModal(
                  promotionParams,
                  lang,
                  promoteSelectedPawn
                )}
              {renderSelectModeModal(!!selectModeModal, selectMode, lang)}
            </View>
          );
        }}
      </NavigationContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
