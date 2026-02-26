import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./component/SplashScreen";
import { StyleSheet } from 'react-native';
import HomeTabs from "./component/HomeTabs";
import RegistrationScreen from "./component/RegistrationScreen"
import WalkthroughContainer from './container/WalkthroughContainer';
import LoginContainer from './container/LoginContainer'
import RegisterContainer from './container/RegisterContainer';
import HomeContainer from './container/HomeContainer';
import CheckoutContainer from './container/CheckoutContainer'
import SavedAddressComponent from './component/SavedAddressComponent'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Walkthrough" component={WalkthroughContainer} />
        <Stack.Screen name="Auth" component={LoginContainer} />
        <Stack.Screen name="Register" component={RegisterContainer} />
        <Stack.Screen name="Home" component={HomeContainer} />
        <Stack.Screen name="Checkout" component={CheckoutContainer}/>
       <Stack.Screen
          name="SavedAddressComponent"
          component={SavedAddressComponent}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%",
    height:"100%"
  },
});
