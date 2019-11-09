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
  ActivityIndicator
} from 'react-native';
import JPush from 'jpush-react-native';
import NavigationContext from "../components/NavigationContext";

// constant
import config from '../constants/config';


export default class LoadingPage extends React.Component {
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
      loadingText: 'Loading App...',
      apiSettings: null
    }

    this.connection = this.connection.bind(this);
  }



  async connection(){    

    var url = 'https://developer.apple.com';

    var connectivity = await fetch(url, {
      method: 'GET',
      timeout: 5000
    }).then(data => { return data })
    .catch(e => {
      console.log("-- HomePage initialize connectivity e : ", e);
      this.setState({
        loadingText: 'Internet connection is not valid. \nPlase wait for a while.'
      })
      return null;
    });

    if( !connectivity || connectivity.status !== 200 ){
      this.setState({
        loadingText: 'Internet connection is not valid. \nPlase wait for a while.'
      })
    } else {    
      var apiSettings = await fetch(config.api_url+'/admin/settings/getSetting', {
        method: 'GET',
        timeout: 5000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(data => { 
        var ret = data.json();
        return ret;
      })
      .catch(e => {
        console.log("-- HomePage initialize connectivity e : ", e);
        this.setState({
          loadingText: 'Internet connection is not valid. \nPlase wait for a while.'
        })
        return null;
      });
  
      if( !apiSettings ) return;

      this.setState({
        apiSettings: apiSettings
      })

      clearInterval(this.timer);
    }
  }


  componentDidMount () {
    this.connection();

    var that = this;
    this.timer = setInterval( async function(){ 
      that.connection();
    }, 2000);

    JPush.init();
    //连接状态
    this.connectListener = result => {
      console.log("connectListener:" + JSON.stringify(result))
    };
    JPush.addConnectEventListener(this.connectListener);

    //通知回调
    this.notificationListener = result => {
      console.log("notificationListener:" + JSON.stringify(result))
    };
    JPush.addNotificationListener(this.notificationListener);

    //自定义消息回调
    this.customMessageListener = result => {
      console.log("customMessageListener:" + JSON.stringify(result))
      this.setState({
        pushMsg: map.content
      })
    };
    JPush.addCustomMessagegListener(this.customMessageListener);

    //本地通知回调 todo
    this.localNotificationListener = result => {
      console.log("localNotificationListener:" + JSON.stringify(result))
    };
    JPush.addLocalNotificationListener(this.localNotificationListener);

    //tag alias事件回调
    this.tagAliasListener = result => {
      console.log("tagAliasListener:" + JSON.stringify(result))
    };
    JPush.addTagAliasListener(this.tagAliasListener);

    //手机号码事件回调
    this.mobileNumberListener = result => {
      console.log("mobileNumberListener:" + JSON.stringify(result))
    };
    JPush.addMobileNumberListener(this.mobileNumberListener);  

    // this.openNotificationListener = map => {
    //   console.log('-- JPush openNotificationListener Opening notification!')
    //   console.log('-- JPush openNotificationListener map.extra: ' + map.extras)
    //   this.props.navigation.navigate('HomePage')
    // }
    // JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener)

  }


  componentWillUnmount () {
    
  }


  render() {
    var { loadingText } = this.state;
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="transparent" barStyle="light-content"/>
        <View style={styles.mainContent}>
          <NavigationContext.Consumer>
            {data => {
              const {
                setApiSettings,
              } = data;
              if( this.state.apiSettings != null ) {
                data.setApiSettings( this.state.apiSettings )
                if( this.state.apiSettings.apiStatus == 1 ){
                  this.props.navigation.navigate('ApiPage'); 
                } else {
                  this.props.navigation.navigate('Main'); 
                }
              }
            }}
          </NavigationContext.Consumer>
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
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',   
  },
  backgroundGrad: {
    alignItems: 'center', flex: 1, width: '100%'
  },  
  apiContent: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  mainContent: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  contact: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    bottom: 150,
    width: '100%'
  },
});

