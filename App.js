import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';

import {
  DragResizeBlock,
} from 'react-native-drag-resize';
import { Connector } from 'react-native-drag-resize/src/Connector';
//import { TouchableOpacity } from 'react-native-gesture-handler';




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
        console.log("one finger")
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


export default function App(props) {

    const windowDim = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      }
    
    const initSize = 75
    const initPos1 = [windowDim.width / 3, windowDim.height/2]
    const initPos2 = [windowDim.width / 3 + 300, windowDim.height/2]

    const [pos1, setpos1] = useState(initPos1)
    const [pos2, setpos2] = useState(initPos2)
    const [size1, setSize1] = useState([initSize, initSize])
    const [size2, setSize2] = useState([initSize, initSize])
    const [collisionOccured, setCollisionOccured] = useState(false)
    


    useEffect(() => {
      let min1x = pos1[0]
      let min1y = pos1[1]
      let min2x = pos2[0]
      let min2y = pos2[1]
      let max1x = pos1[0] + pos1[0]
      let max1y = pos1[1] + size1[1] 
      let max2x = pos2[0] + size2[0] 
      let max2y = pos2[1] + size2[1]
      let aLeftOfB = max1x < min2x
      let aRightOfB = max2x < min1x
      let aAboveB = min1y > max2y
      let aBelowB = max1y < min2y
      


      console.log("size1 = ")
      console.log(size1)
      console.log("size2 = ")
      console.log(size2)
      console.log("pos1 = ")
      console.log(pos1)
      console.log("pos2 = ")
      console.log(pos2)
  
      if (!(aLeftOfB || aRightOfB || aAboveB || aBelowB)){
        console.log("min1x : ", min1x)
        console.log("min1y : ", min1y)
        console.log("min2x : ", min2x)
        console.log("min2y : ", min2y)
        console.log("max1x : ", max1x)
        console.log("max1y : ", max1y)
        console.log("max2x : ", max2x)
        console.log("max2y : ", max2y)
        console.log("aLeftOfB = ", aLeftOfB)  
        console.log("aRightOfB = ", aRightOfB)  
        console.log("aAboveB = ", aAboveB)  
        console.log("aBelowB = ", aBelowB)  
        console.log("A collision occured")
        setCollisionOccured(true)
        //console.log("Somthing happened")  
      }
    }, [pos1, pos2, size1, size2])

    const euclideanDistS = (posA, posB) => {
      return (posA[0] - posB[0])*(posA[0] - posB[0]) + (posA[1] - posB[1])*(posA[1] - posB[1])
    }

    const onResize = (newPos, oldPos, oldSize, idx) => {
      let setPos = idx === 1 ? setpos1 : setpos2
      let setSize = idx === 1 ? setSize1 : setSize2
      let size = idx === 1 ? size1 : size2
      let distToBR = euclideanDistS(newPos, oldPos)
      let distToTL = euclideanDistS(newPos, [oldPos[0] + oldSize[0], oldPos[1] + oldSize[1]])
      let dx = oldPos[0] - newPos[0]
      let dy = oldPos[1] - newPos[1]
      console.log("distToBR ", distToBR)
      console.log("distToTL ", distToTL)
      console.log("dx : ", dx)
      console.log("dy : ", dy)
      
      if(distToBR < distToTL){
        // we've changed the Bottom Right
        console.log("BR has to be changed")
        setPos(newPos)
      }
      setSize([size[0] + dx, size[1] + dy])
    }

    return (
      <>
        {collisionOccured ? 
          <View style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
            <Text>Oops... You made a collision...</Text>
            <TouchableOpacity 
                style={{backgroundColor:"grey"}} 
                onPress={() => {
                setCollisionOccured(false)
                setpos1([...initPos1])
                setpos2([...initPos2])
                setSize1([initSize, initSize])
                setSize2([initSize, initSize])
                console.log("======================================")
                console.log(pos1)
                console.log(pos2)
                console.log(size1)
                console.log(size2)
                console.log("======================================")
                }}>
              <Text>Press to restart</Text>
            </TouchableOpacity>

          </View>
          :
        <>
        <DragResizeBlock
          x={windowDim.width/3}
          y={windowDim.height/2}
          onDrag={(newPos) => setpos1(newPos)}
          onResize={(newSize) => onResize(newSize, pos1, size1, 1)}
          connectors={["c", "tl", "br"]}
          h={initSize}
          w={initSize}
          style={styles.block}>
          <View style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'red',
                  justifyContent:"center", 
                  alignItems:"center",
                  borderRadius:9
                }}>
            <Text style={{fontSize:50}} >A</Text>
          </View>
        </DragResizeBlock>
        <DragResizeBlock
        x={2*windowDim.width/3}
        y={windowDim.height/2}
        connectors={["c", "tl", "br"]}
        h={initSize}
        w={initSize}
        onDrag={(newPos) => setpos2(newPos)}
        onResize={(newSize) => onResize(newSize, pos2, size2, 2)}
        style={styles.block}>
        <View style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'red',
                justifyContent:"center", 
                alignItems:"center",
                borderRadius:9
              }}>
          <Text style={{fontSize:50}}>B</Text>
        </View>
      </DragResizeBlock>  
      </>           
      }
    </>  
    );
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
  block:{
    backgroundColor:"grey",
    borderRadius:20
  }

});
