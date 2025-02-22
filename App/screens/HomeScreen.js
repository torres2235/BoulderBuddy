import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, View, SafeAreaView} from 'react-native';

import colors from '../config/colors.js'

function HomeScreen(props) {
  return (
    <SafeAreaView style={styles.sample}>
      <Text>Home Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    sample: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default HomeScreen;