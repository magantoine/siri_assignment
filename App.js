import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {DragResizeBlock} from 'react-native-drag-resize';



export default function App(props) {

    const windowDim = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      }

    const CENTRAL_CONNECTOR = "c"
    const TOP_LEFT_CONNECTOR = "tl"
    
    // initialization positon and size of each blocks
    const initSize = 75
    const initPos1 = [windowDim.width / 3, windowDim.height/2]
    const initPos2 = [2*windowDim.width / 3, windowDim.height/2]


    // hooks to track the sizes and the position of each blocks
    const [pos1, setpos1] = useState(initPos1)
    const [pos2, setpos2] = useState(initPos2)
    const [size1, setSize1] = useState([initSize, initSize])
    const [size2, setSize2] = useState([initSize, initSize])
    const [collisionOccured, setCollisionOccured] = useState(false)
    
    useEffect(() => {
      // computes the min and max coordinates of each block
      let min1x = pos1[0]
      let min1y = pos1[1]
      let min2x = pos2[0]
      let min2y = pos2[1]
      let max1x = pos1[0] + size1[0]
      let max1y = pos1[1] + size1[1] 
      let max2x = pos2[0] + size2[0] 
      let max2y = pos2[1] + size2[1]
      let aLeftOfB = max1x < min2x
      let aRightOfB = max2x < min1x
      let aAboveB = min1y > max2y
      let aBelowB = max1y < min2y
      
      if (!(aLeftOfB || aRightOfB || aAboveB || aBelowB)){
        setCollisionOccured(true)

      }
    }, [pos1, pos2, size1, size2])


    /**
     * The blocks' positions and their sizes are set back to the initial values
     */
    const resetStage = () =>{
      setCollisionOccured(false)
      
      setpos1([...initPos1])
      setpos2([...initPos2])
      setSize1([initSize, initSize])
      setSize2([initSize, initSize])
    }
    /**
     * Computes the new size based on the modification of position of the top left corner
     * 
     * @param {Array} newPos new position of the top left corner
     * @param {Array} oldPos old position of the top left corner
     * @param {Array} oldSize old size of the block
     * @param {Number} idx index of the block
     */
    const onResize = (newPos, oldPos, oldSize, idx) => {
      let setPos = idx === 1 ? setpos1 : setpos2
      let setSize = idx === 1 ? setSize1 : setSize2
      
      let dx = oldPos[0] - newPos[0]
      let dy = oldPos[1] - newPos[1]
      
      setPos(newPos)
      setSize([oldSize[0] + dx, oldSize[1] + dy])
    }


    /**
     * Basic block to be displayed
     * 
     * @param {Number} idx index of the block
     * @param {Function} onDragFunc function that will be called when the block is being dragged
     * @param {Function} onResizeFunc function that will eb called when the block is being resized
     * @param {Array} initPos initial position of the block
     * @param {String} name Name of the block, will be displayed over it
     * @returns block component
     */
    const block = (idx, onDragFunc, onResizeFunc, initPos, name) =>{
      return (
        <DragResizeBlock
          x={initPos[0]}
          y={initPos[1]}
          onDrag={onDragFunc}
          onResize={onResizeFunc}
          connectors={[CENTRAL_CONNECTOR, TOP_LEFT_CONNECTOR]}
          h={initSize}
          w={initSize}
          >
            <View style={styles.block}>
              <Text style={{fontSize:50}} >{name}</Text>
            </View>
        </DragResizeBlock>
        ) 
    }


    const block1 = block(1, (newPos) => setpos1(newPos), (newSize) => onResize(newSize, pos1, size1, 1), initPos1, "A")
    const block2 = block(2, (newPos) => setpos2(newPos), (newSize) => onResize(newSize, pos2, size2, 2), initPos2, "B")

    return (
      <>
        {collisionOccured ? 
          <View style={styles.collisionContainer}>
            <Text>Oops... You made a collision...</Text>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={resetStage}>
              <Text style={{color:"white"}}>Press to restart</Text>
            </TouchableOpacity>
          </View>
          :
        <>   
          {block1}
          {block2}
      </>           
      }
    </>  
    );
  }

const styles = StyleSheet.create({

  block:{
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
    justifyContent:"center", 
    alignItems:"center",
    borderRadius:9
  }, 
  backButton:{
    backgroundColor:"grey",
    padding:10,
    margin:20,
    width:"40%",
    height:"5%",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10
  },
  collisionContainer:{
    width:"100%",
    height:"100%", 
    justifyContent:"center", 
    alignItems:"center"
  }

});
