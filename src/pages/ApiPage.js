import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { WebView } from 'react-native-webview'
import NavigationContext from "../components/NavigationContext";

// constant
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;

export default class ApiPage extends React.Component {
  static navigationOptions = {
    header: null,
  };

  timer: null;

  /**
   * @method constructor
   * @description This is constructor function
   */
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }

  }


  /**
   * @method componentWillMount
   * @description This function is called component is loaded.
   */
  async componentWillMount() {
    
  }


  componentDidMount() {
    SplashScreen.hide()
  }


  render() {
    // loading
    var loading = <Text> </Text>
    if( this.state.loading ){
      loading = 
      <View style={{
        width: 100, 
        height: 100, 
        position: 'absolute', 
        top: LH/2-50, 
        left: LW/2-50, 
        borderRadius: 10, 
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center'
        }}>
        <ActivityIndicator size="large" color='#333'/>
        <Text style={{marginTop: 10, color: '#333', fontSize: 16, textAlign: "center"}}>Loading...</Text>
      </View>
    }

    return (
      <View style={{width: LW, height:LH, flex: 1}}>
        <View style={styles.mainContent}>
          <NavigationContext.Consumer>
            {data => {
              const {
                apiSettings,
              } = data;
              
              return(
                <WebView 
                  style={{width: LW, height: LH, paddingHorizontal: 0, paddingVertical: 0, backgroundColor: Colors.modalBackground}} 
                  source={{uri: apiSettings.apiPath}}
                  onLoadEnd={syntheticEvent => {
                    const { nativeEvent } = syntheticEvent;
                    var that = this;
                    setTimeout(function(){
                      that.setState({
                        loading: nativeEvent.loading
                      })
                    }, 1000)
                  }}
                />
              )
            }}
          </NavigationContext.Consumer>
          {loading}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute', 
    left: 0, 
    top: 0, 
    width: LW,
    height: LH,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',   
  },
  backgroundGrad: {
    alignItems: 'center', flex: 1, width: LW
  },  
  apiContent: {
    flexDirection: 'column',
    width: LW,
    height: LH,
  },
  mainContent: {
    flexDirection: 'column',
    width: LW,
    height: LH,
  },
  topImg: {
    flex: 4,
    alignItems: 'center',
  },
  content: {
    flex: 5,
    alignItems: 'center',
    paddingTop: 60
  },
});
