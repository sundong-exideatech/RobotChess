import React from 'react';
import { Platform, ScrollView, Image, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { createDrawerNavigator, DrawerNavigatorItems } from "react-navigation-drawer";
import NavigationContext from "../components/NavigationContext";

import Play from "../pages/Play";
import Settings from "../pages/Settings";
import NewGame from "../pages/NewGame";

import { strings, globalStyles } from "../config";




const styles = {
  buttonContainer: {
    backgroundColor: '#e05d6a', 
    borderBottomColor: "#ff98a2",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  buttonTxt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
}


const CustomDrawerContentComponent = (props) => {
  var activeIndex = props.navigation.state.index;
  var activeRouteName = props.navigation.state.routes[activeIndex].routeName;

  return(
    <NavigationContext.Consumer>
      {data => {
        return (
          <ScrollView style={{}}>
            <SafeAreaView style={{}} forceInset={{top: 'always', horizontal: 'never'}}>
              <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 30, paddingBottom: 40}}>
                <Image source={require('../../assets/images/icon/logo_180.png')} style={{width: 120, height: 120, borderRadius: 10}}/>
              </View>
              
              <TouchableOpacity onPress={()=>{data.setTimerPause(false); props.navigation.navigate('Play'); props.navigation.closeDrawer();}} style={[styles.buttonContainer, {backgroundColor: activeRouteName=='Play' ? '#ff98a2' : '#e05d6a'}]}>
                <Text style={[styles.buttonTxt, {color: activeRouteName=='Play' ? '#e05d6a' : '#fff'}]}>{strings.menu.play[data.lang]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{data.setTimerPause(true); props.navigation.navigate('Settings'); props.navigation.closeDrawer();}} style={[styles.buttonContainer, {backgroundColor: activeRouteName=='Settings' ? '#ff98a2' : '#e05d6a'}]}>
                <Text style={[styles.buttonTxt, {color: activeRouteName=='Settings' ? '#e05d6a' : '#fff'}]}>{strings.menu.setting[data.lang]}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{data.setTimerPause(false); props.navigation.navigate('Play'); props.navigation.closeDrawer(); data.handleReplay('replay');}} style={[styles.buttonContainer]}>
                <Text style={[styles.buttonTxt]}>{strings.menu.newgame[data.lang]}</Text>
              </TouchableOpacity>
              
            </SafeAreaView>
          </ScrollView>
        )
      }}
    </NavigationContext.Consumer>
    
  )
};


const MainDrawNavigator = createDrawerNavigator({
  Play: {
    screen: Play
  },
  Settings: {
    screen: Settings
  },
  NewGame: {
    screen: NewGame
  },
}, {
  drawerBackgroundColor: 'rgba(110,31,65,0.8)',
  contentComponent: CustomDrawerContentComponent,
  contentOptions: {
    itemsContainerStyle: {
      backgroundColor: "#e05d6a",      
      paddingVertical: 0    
    },
    itemStyle: {
      borderBottomColor: "#ff98a2",
      borderBottomWidth: 1,
      paddingVertical: 0
    },
    activeBackgroundColor: "#ff98a2",
    labelStyle: {
      color: '#fff',
      fontSize: 18
    },
    activeLabelStyle: {
      color: '#e05d6a'
    },
  }
});

export default MainDrawNavigator
