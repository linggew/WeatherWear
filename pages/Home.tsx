import React from "react";
import { View } from "react-native";
import { makeStyles, Text, Button } from "@rneui/themed";

import type { NavigationProp } from '@react-navigation/native';

type HomeProps = {
  navigation: NavigationProp<any>;
};

export const Home = ({ navigation }: HomeProps) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text h3>🌤️Weather Wear🌤️</Text>
      <Text style={styles.text}>
        by Pixel Capybaras 😎
      </Text>
      <Button onPress={() => navigation.navigate('Settings')}>Go to Settings</Button>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginVertical: theme.spacing.lg,
  },
}));
