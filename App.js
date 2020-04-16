import React, {Component} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          // eslint-disable-next-line react-native/no-inline-styles
          style={{flex: 1, alignItems: 'center'}}
          ref={(ref) => {
            this.camera = ref;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
});

export default App;