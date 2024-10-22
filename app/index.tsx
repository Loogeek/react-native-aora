import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";

import "./global.css";

const Welcome = () => {
  return (
    <View>
      <Text className="flex flex-1 items-center justify-center bg-red-500">
        Open up App.js to start working on your app!
      </Text>
    </View>
  );
};

export default Welcome;
