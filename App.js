import React, { Component } from "react";
import {
  View,
  Dimensions,
  NativeModules,
  AsyncStorage,
  ScrollView,
  Image,
  Text
} from "react-native";
import { WebView } from "react-native-webview"
import Toast from "react-native-simple-toast";
import includes from "lodash/includes";
import { SafeAreaView, createAppContainer } from "react-navigation";

import { Game } from "rsg-chess";
import { html } from "./src/scripts/Robot";
import { combineParams, stringifyTurnsReport } from "./src/scripts/utils";
import { strings, colorPalettes } from "./src/config";
import NavigationContext from "./src/components/NavigationContext";


import RobotChessUtils from "./src/utils/RobotChessUtils"
import AppNavigator from "./src/navigation/AppNavigator";

type Props = {};
let game = Game.prototype.initializeGame();
const blankFEN = game.FEN;

let language = "en";
const supportedLangs = ["en", "bg", "ru", "sp", "it", "fr", "jp", "kr", "cn", "zh"];
const supportedPalettes = Object.keys(colorPalettes);

export default class App extends Component<Props> {
  /// CLASS METHODS ///

  bTimer = null;
  wTimer = null;

  constructor() {
    super();
    this.state = {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      lang: language,
      palette: "default",
      rotated: false,
      showValidMoves: true,
      selected: null,
      checkmate: null,
      playAgainstRobot: null,
      isRobotThinking: false,
      promotionParams: null,
      selectModeModal: game.FEN === blankFEN,
      wTime: 30000, 
      bTime: 0, 
      active: 'W',
      apiSettings: null,
      timerPause: false
    };

    this.updateInfo = this.updateInfo.bind(this)
    this.setApiSettings = this.setApiSettings.bind(this)
    this.setTimerPause = this.setTimerPause.bind(this)

    Dimensions.addEventListener("change", () => {
      this.setState({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
      });
    });

    
    this.NavigationComponent = createAppContainer( AppNavigator );
  }

  componentDidMount = () => {
    // Make sure the splash screen is gone

    // Get the settings from the storage
    try {
      AsyncStorage.getItem("@RobotChess:lang").then(value => {
        if (value) {
          if (includes(supportedLangs, value)) this.setState({ lang: value });
        }
      });
    } catch (error) {
      
    }
    try {
      AsyncStorage.getItem("@RobotChess:showValidMoves").then(value => {
        if (value) {
          if (typeof JSON.parse(value) === "boolean")
            this.setState({ showValidMoves: JSON.parse(value) });
        }
      });
    } catch (error) {
      
    }

    try {
      AsyncStorage.getItem("@RobotChess:palette").then(value => {
        if (value) {
          if (includes(supportedPalettes, value))
            this.setState({ palette: value });
        }
      });
    } catch (error) {
      
    }    
  };

  /// HELPERS ///
  setRotation = value => {
    this.setState({
      rotated: value
    });
  };

  updateValidMovesConfig = value => {
    AsyncStorage.setItem(
      "@RobotChess:showValidMoves",
      JSON.stringify(value)
    ).then(ev => {
      this.setState({ showValidMoves: value });
    });
  };

  updateLang = value => {
    if (includes(supportedLangs, value))
      AsyncStorage.setItem("@RobotChess:lang", value).then(ev => {
        this.setState({ lang: value });
      });
  };

  updatePalette = value => {
    if (includes(supportedPalettes, value))
      AsyncStorage.setItem("@RobotChess:palette", value).then(ev => {
        this.setState({ palette: value });
      });
  };

  promoteRobot = (pawn, x, y, color) => {
    Toast.show(
      strings.RobotPromoted[this.state.lang],
      Toast.LONG,
      Toast.BOTTOM,
    );
    game.promotePawn(pawn, x, y, color, "queen");
  };

  promoteSelectedPawn = piece => {
    const { promotionParams, playAgainstRobot, checkmate } = this.state;
    if (promotionParams) {
      piece = piece ? piece : "knight";
      const { x, y, color, pawn } = promotionParams;
      game.promotePawn(pawn, x, y, color, piece);
      this.setState({ promotionParams: null });

      // Start the Robot if there is playAgainstRobot mode
      if (playAgainstRobot && !checkmate) {
        this.startRobot();
      }
    } else {
      
    }
  };

  selectMode = async playAgainstRobot => {
    await this.setState({
      selectModeModal: false,
      playAgainstRobot: playAgainstRobot,
      wTime: 30000,
      bTime: 0,
      active: 'W'
    });

    clearInterval(this.wTimer);
    clearInterval(this.bTimer);

    var that = this;
    this.wTimer = setInterval(function(){
      if( that.state.timerPause ) return;
      var wTime = that.state.wTime;
      if( wTime < 1000 ){
        that.setState({
          wTime: 0,
          checkmate: 'W'
        });
        clearInterval(that.wTimer);
        clearInterval(that.bTimer);
        return;
      }        
      that.setState({wTime: wTime-1000});
    }, 1000)
  };


  startRobot = () => {
    this.webView.injectJavaScript(
      `Robot(${combineParams(game, this.state.playAgainstRobot)})`
    );

    this.setState({ isRobotThinking: true });
  };


  setTimerPause( pause ){
    this.setState({
      timerPause: pause
    })
  }


  /// EVENTS ///
  handlePress = (x, y) => {
    let {
      selected,
      playAgainstRobot,
      isRobotThinking,
      lang,
      checkmate,
      promotionParams
    } = this.state;


    if (isRobotThinking) {
      Toast.show(
        strings.RobotThinking[lang],
        Toast.SHORT,
        Toast.BOTTOM
      );
      return;
    }
    
    if (selected) {
      var oldX = selected.x;
      var oldY = selected.y;

      // move the selected piece
      let move = game.moveSelected(
        selected,
        { x: x, y: y },
        this.handlePromotion,
        this.handleCheckmate,
        false
      );

      if( oldX != x || oldY != y ){
        this.updateInfo();
      } 
        

      this.setState({ selected: null });

      // use the worker for generating Robot movement

      let last = game.turn.length - 1;

      if (
        move &&
        playAgainstRobot &&
        last >= 0 &&
        game.turn[last].color === "W" &&
        !checkmate &&
        !move.promotion
      ) {
        this.startRobot();
      }

    } else {
      let last = game.turn.length - 1;
      if (
        game.board[y][x] &&
        (last >= 0
          ? game.board[y][x].color !== game.turn[last].color
          : game.board[y][x].color === "W")
      ) {
        this.setState({ selected: game.board[y][x] });
      } else {
        game.board[y][x] &&
        Toast.show(
            strings.invalidMove[lang],
            Toast.SHORT,
            Toast.BOTTOM
          );
      }
    }

  };

  handlePromotion = (pawn, x, y, color) => {
    this.setState({
      promotionParams: {
        x: x,
        y: y,
        color: color,
        pawn: pawn
      }
    });
  };

  handleReplay = (replay) => {
    this.setState({
      selected: null,
      promotionParams: null,
      checkmate: null,
      isRobotThinking: false,
      playAgainstRobot: null,
      selectModeModal: true,
      wTime: 30000,
      bTime: 0,
      active: 'W'
    });

    game = Game.prototype.initializeGame();

    clearInterval(this.wTimer);
    clearInterval(this.bTimer);

    
    
  };

  handleCheckmate = color => {
    this.setState({ checkmate: color });
    if (color === "D") {
    } else if (color === "W") {
      if (this.state.playAgainstRobot) {
      }
    } else if (color === "B") {
    } else {
    }
  };

  handleMessage = msg => {
    if (msg && msg.nativeEvent.data) {
      // Track issues if any

      if (typeof msg.nativeEvent.data === "string") {
      } else if (!JSON.stringify(msg.nativeEvent.data)) {
      } else {
      }
      // // //

      msg = JSON.parse(msg.nativeEvent.data);
      const { promoteRobot } = this;

      game.moveSelected(
        game.board[msg.from.y][msg.from.x],
        msg.to,
        promoteRobot,
        this.handleCheckmate,
        false
      );
      this.updateInfo();
      

      this.setState({ isRobotThinking: false });
    } else {
    }
  };


  updateInfo() {    
    var last = game.turn.length-1;
    if( last < 0 ) return;

    var turn = game.turn[last];

    clearInterval(this.bTimer);
    clearInterval(this.wTimer);      

    if( turn.color == 'W' ){
      if( RobotChessUtils.checkValid(turn.piece) ){
        this.setState({
          wTime: 0,
          bTime: 30000,
          active: 'B'
        })
      } else {
        this.setState({
          wTime: 0,
          bTime: 30000,
          active: 'B'
        })
      }
      
      var that = this;
      this.bTimer = setInterval(function(){
        if( that.state.timerPause ) return;
        var bTime = that.state.bTime;
        if( bTime < 1000 ){
          that.setState({
            bTime: 0,
            checkmate: 'B'
          });
          clearInterval(that.wTimer);
          clearInterval(that.bTimer);
          return;
        }        
        that.setState({bTime: bTime-1000});
      }, 1000)
    } else if( turn.color == 'B' ){
      if( RobotChessUtils.checkValid(turn.piece) ){
        this.setState({
          bTime: 0,
          wTime: 30000,
          active: 'W'
        })
      } else {
        this.setState({
          bTime: 0,
          wTime: 30000,
          active: 'W'
        })
      }

      var that = this;
      this.wTimer = setInterval(function(){
        if( that.state.timerPause ) return;
        var wTime = that.state.wTime;
        if( wTime < 1000 ){
          that.setState({
            wTime: 0,
            checkmate: 'W'
          });
          clearInterval(that.wTimer);
          clearInterval(that.bTimer);
          return;
        }        
        that.setState({wTime: wTime-1000});
      }, 1000)
    }
  }


  async setApiSettings( apiSettings ) {
    await this.setState({
      apiSettings: apiSettings
    });

    
  }


  render() {
    const {
      handleReplay,
      handlePress,
      NavigationComponent,
      updateLang,
      updatePalette,
      setRotation,
      updateValidMovesConfig,
      promoteSelectedPawn,
      selectMode,
      setApiSettings,
      setTimerPause
    } = this;

    return (
      <React.Fragment>
        <NavigationContext.Provider
          value={{
            self: this,
            game: game,
            handleReplay: handleReplay,
            updatePalette: updatePalette,
            handlePress: handlePress,
            updateLang: updateLang,
            setRotation: setRotation,
            updateValidMovesConfig: updateValidMovesConfig,
            promoteSelectedPawn: promoteSelectedPawn,
            selectMode: selectMode,
            setApiSettings: setApiSettings,
            setTimerPause: setTimerPause,
            ...this.state
          }}
        >
          <NavigationComponent />
        </NavigationContext.Provider>
        <View>
          <WebView
            ref={el => (this.webView = el)}
            source={{ html: html }}
            javaScriptEnabled={true}
            onMessage={this.handleMessage}
          />
        </View>
      </React.Fragment>
    );
  }
}

App.defaultProps = {};
