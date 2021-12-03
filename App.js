import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  PanResponder,
  Alert
} from 'react-native';
import Constants from 'expo-constants';




let baseHeight = 100;




const DraggableView = (props) => {
  
  const {name} = props
  const pan = useRef(new Animated.ValueXY({x : 0, y : 0})).current
  const size = useRef(new Animated.ValueXY({x : baseHeight, y : baseHeight})).current

  const pan2 = useRef(new Animated.ValueXY({x : 0, y : 0})).current
  const size2 = useRef(new Animated.ValueXY({x : 50, y : 50})).current

  
  

  const overlapping = () => {
    let min1x = pan.__getValue().x
    let min1y = pan.__getValue().y
    let min2x = pan2.__getValue().x 
    let min2y = + pan2.__getValue().y + 450
    let max1x = pan.__getValue().x + size.__getValue().x 
    let max1y = pan.__getValue().y + size.__getValue().y 
    let max2x = pan2.__getValue().x + size2.__getValue().x 
    let max2y = + pan2.__getValue().y + size2.__getValue().y + 450
    let aLeftOfB = max1x < min2x
    let aRightOfB = max2x < min1x
    let aAboveB = min1y > max2y
    let aBelowB = max1y < min2y

    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB)
  }

  const panResponder1 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => { 
      if(gesture.numberActiveTouches === 1){
        console.log("one finger")
        if(overlapping()){
          Alert.alert("bruh")
        }
        Animated.event([
          null,
          {
            dx: pan.x, // x,y are Animated.Value
            dy: pan.y,
          },
          ], {useNativeDriver: false})(event, gesture)
      }
    },
    onPanResponderGrant: (event, gestureState) => {
    pan.setOffset(pan.__getValue())
  },
  });

  const sizeResponder1 = PanResponder.create({
     onStartShouldSetPanResponder: () => true,
     onPanResponderMove: (event, gesture) => {
       if(gesture.numberActiveTouches === 1){
        console.log("two fingers")
        Animated.event([
          null,
          {
            dx: size.x, // x,y are Animated.Value
            dy: size.y,
          },
          ], {useNativeDriver: false})(event, gesture)
        }
    },
     onPanResponderGrant: (event, gestureState) => {
      const newWidth = pan.__getValue().x - pan.x
      console.log("current width : ", size.x + "new width : " + newWidth)
      const newHeight = pan.__getValue().y - pan.y
      console.log("current height : ", size.y + "new height : " + newHeight)
      size.setOffset({x : newWidth, y : newHeight})
   },
   })

   const panResponder2 = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => { 
      if(gesture.numberActiveTouches === 1){
        if(overlapping()){
          Alert.alert("There is a collision")
        }
        Animated.event([
          null,
          {
            dx: pan2.x, // x,y are Animated.Value
            dy: pan2.y,
          },
          ], {useNativeDriver: false})(event, gesture)

      }
      
    },
    onPanResponderGrant: (event, gestureState) => {
    pan2.setOffset(pan2.__getValue())
  },
  });

  const sizeResponder2 = PanResponder.create({
     onStartShouldSetPanResponder: () => true,
     onPanResponderMove: (event, gesture) => {
       if(gesture.numberActiveTouches === 1){
        console.log("two fingers")
        Animated.event([
          null,
          {
            dx: size2.x, // x,y are Animated.Value
            dy: size2.y,
          },
          ], {useNativeDriver: false})(event, gesture)
        }
    },
     onPanResponderGrant: (event, gestureState) => {
      const newWidth = pan2.__getValue().x - pan2.x
      console.log("current width : ", size2.x + "new width : " + newWidth)
      const newHeight = pan2.__getValue().y - pan2.y
      console.log("current height : ", size2.y + "new height : " + newHeight)
      size.setOffset({x : newWidth, y : newHeight})

      if(overlapping()){
        Alert.alert("There is a collision")
      }
   },
   })

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          {...panResponder1.panHandlers} 
          style={[pan.getLayout(), styles.item]}
        >
          <Animated.View 
            {...sizeResponder1.panHandler}
            style={{width:size.x, height:size.y, justifyContent:"center", alignItems:"center"}}>
            <Text>1</Text>
          </Animated.View>
        </Animated.View>
      </View>
      <View style={styles.container}>
      <Animated.View
        {...panResponder2.panHandlers} 
        style={[pan2.getLayout(), styles.item]}
      >
        <Animated.View 
          {...sizeResponder2.panHandler}
          style={{width:size2.x, height:size2.y, justifyContent:"center", alignItems:"center"}}>
          <Text>2</Text>
        </Animated.View>
      </Animated.View>
    </View>
  </>
    );
};


export default class App extends React.Component {

  render() {
    return (
      <View style={{backgroundColor:"red", width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
        <DraggableView/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: { 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },

});
