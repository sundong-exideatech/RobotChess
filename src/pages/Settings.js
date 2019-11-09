import React, { Component } from "react";
import {
  Platform,
  View,
  Text,
  ScrollView,
  Dimensions,
  Button,
  StyleSheet
} from "react-native";
import CheckmateSnackBar from "../components/CheckmateSnackBar";
import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker,
  SettingsTextLabel
} from "react-native-settings-components";
import NavigationContext from "../components/NavigationContext";
import { strings, possiblePalettes, globalStyles } from "../config";
import { adsHeight } from "../scripts/getSizes";

// constant
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;

export default class HomePage extends Component<Props> {
  static navigationOptions = {
    title: "Settings",
    header: null,
    // drawerLabel: () => (
    //   <NavigationContext.Consumer>
    //     {data => {
    //       return (
    //         <Text style={globalStyles.drawerItemLabel}>
    //           {strings.settings[data.lang]}
    //         </Text>
    //       );
    //     }}
    //   </NavigationContext.Consumer>
    // )
  };

  state = {
    adLoaded: false,
    langLabel: 'English'
  };

  constructor() {
    super();
  }

  componentDidMount() {
    
  }

  render() {

    return (
      <View style={styles.container}>
        <NavigationContext.Consumer>
          {data => {
            const {
              lang,
              updateLang,
              updatePalette,
              handleReplay,
              palette,
              setRotation,
              rotated,
              showValidMoves,
              updateValidMovesConfig
            } = data;
            return (
              <React.Fragment>
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={{
                    width: Dimensions.get("window").width
                  }}
                >
                  <View style={{ height: 25 }} />
                  <SettingsCategoryHeader title={strings.personalize[lang]} titleStyle={{color: '#fff'}} />
                  <SettingsTextLabel
                    title={strings.personalizeSettingsLabel[lang]}
                    titleStyle={{color: '#fff'}} 
                  />
                  {/* <SettingsDividerShort containerStyle={{ height: 2 }} /> */}

                  <SettingsPicker
                    title={strings.lang[lang]}
                    titleStyle={{color: '#fff'}} 
                    dialogDescription={strings.chooseLang[lang]}
                    possibleValues={[
                      { label: "English", value: "en" },
                      { label: "Български", value: "bg" },
                      { label: "Руский", value: "ru" },
                      { label: "Español", value: "sp" },
                      { label: "italiano", value: "it" },
                      { label: "français", value: "fr" },
                      { label: "日本語", value: "jp" },
                      { label: "한국어", value: "kr" },
                      { label: "简体中文", value: "cn" },
                      { label: "繁體中文", value: "zh" },
                    ]}
                    negativeButtonTitle={strings.cancel[lang]}
                    positiveButtonTitle={strings.okaySettings[lang]}
                    onSaveValue={value => {
                      updateLang(value);
                      var langLabel = 'English';
                      if( value == 'bg' ) langLabel = 'Български';
                      else if( value == 'ru' ) langLabel = 'Руский';
                      else if( value == 'sp' ) langLabel = 'Español';
                      else if( value == 'it' ) langLabel = 'italiano';
                      else if( value == 'fr' ) langLabel = 'français';
                      else if( value == 'jp' ) langLabel = '日本語';
                      else if( value == 'kr' ) langLabel = '한국어';
                      else if( value == 'cn' ) langLabel = '简体中文';
                      else if( value == 'zh' ) langLabel = '繁體中文';
                      this.setState({langLabel: langLabel})
                    }}
                    valueStyle={{color: '#ffafd1'}}
                    value={this.state.langLabel}
                    containerStyle={{
                      backgroundColor: '#6e1f41'
                    }}
                  />

                  <SettingsDividerShort 
                    containerStyle={{backgroundColor: '#6e1f41'}}
                    dividerStyle={{backgroundColor: '#882650'}}
                  />

                  <SettingsPicker
                    title={strings.colorPalettes[lang]}
                    titleStyle={{color: '#fff'}} 
                    dialogDescription={strings.selectPalette[lang]}
                    possibleValues={possiblePalettes()}
                    negativeButtonTitle={strings.cancel[lang]}
                    positiveButtonTitle={strings.okaySettings[lang]}
                    onSaveValue={value => {
                      updatePalette(value);
                    }}
                    value={palette}
                    valueStyle={{color: '#ffafd1'}}
                    containerStyle={{
                      backgroundColor: '#6e1f41'
                    }}
                  />

                  <SettingsDividerShort 
                    containerStyle={{backgroundColor: '#6e1f41'}}
                    dividerStyle={{backgroundColor: '#882650'}}
                  />

                  <SettingsSwitch
                    title={strings.showValidMoves[lang]}
                    titleStyle={{color: '#fff'}} 
                    onSaveValue={updateValidMovesConfig}
                    value={showValidMoves}
                    containerStyle={{
                      backgroundColor: '#6e1f41'
                    }}
                  />

                  <View style={{ height: 10 }} />
                  <SettingsCategoryHeader title={strings.gameOptions[lang]} titleStyle={{color: '#fff'}} />
                  <SettingsTextLabel title={strings.sessionOnlyLabel[lang]} titleStyle={{color: '#fff'}} />

                  <View style={{backgroundColor: '#6e1f41'}}>
                    <SettingsSwitch
                      title={strings.rotateBlackPiecesSetting[lang]}
                      titleStyle={{color: '#fff'}} 
                      onSaveValue={setRotation}
                      value={rotated}
                      containerStyle={{
                        backgroundColor: '#6e1f41'
                      }}
                    />

                    <SettingsTextLabel
                      containerStyle={{ width: "75%", marginTop: -10, backgroundColor: '#6e1f41' }}
                      titleStyle={{ paddingTop: 0, fontSize: 12, color: '#fff' }}
                      title={strings.rotateBlackPiecesLabel[lang]}
                    />
                  </View>
                  

                  <View style={{ height: 10 }} />
                  <SettingsCategoryHeader title={strings.fastAction[lang]}  titleStyle={{color: '#fff'}} />

                  <View style={styles.newGameContainer}>
                    <Button
                      onPress={() => {                        
                        this.props.navigation.navigate("Play");
                        handleReplay();
                      }}
                      title={strings.newGame[lang]}
                    />
                  </View>
                  <SettingsDividerLong 
                    dividerStyle={{backgroundColor: '#882650'}}
                  />
                </ScrollView>
                <View
                  style={{
                    height: adsHeight(Dimensions.get("window").height),
                    backgroundColor: "#dfdfdf",
                    display: this.state.adLoaded ? "flex" : "none"
                  }}
                >
                  
                </View>
                <CheckmateSnackBar navigate={this.props.navigation.navigate} />
              </React.Fragment>
            );
          }}
        </NavigationContext.Consumer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#882650"
  },
  scrollView: { 
    flex: 1 ,
    paddingTop: 20,
    backgroundColor: "#882650"
  },
  newGameContainer: {
    padding: 16,
    paddingLeft: 16,
    paddingVertical: 4,
    backgroundColor: '#882650'
  },
  buttonContainer: {
    padding: 16,
    paddingLeft: 16,
    paddingVertical: 4,
    backgroundColor: '#882650'
  }
});
