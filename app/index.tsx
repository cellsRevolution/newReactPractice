import React from "react";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DarkTheme } from '@react-navigation/native';

import LoginScreen from './screen/Login';
import SignupScreen from './screen/Signup';

type RootStackParamList = {
  LogInScreen: undefined;
  SignUpScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();



function Index() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="LogInScreen"
        component={LoginScreen}  
        options={{
          title:"Log In",
          headerStyle:{backgroundColor: '#307ecc'},
          headerTintColor: '#fff',
          headerTitleStyle:{fontWeight: 'bold'},
        }}
      />
      <Stack.Screen 
        name="SignUpScreen"
        component={SignupScreen}
        options={{
          title:"Sign Up",
          headerStyle:{backgroundColor: '#307ecc'},
          headerTintColor: '#fff',
          headerTitleStyle:{fontWeight: 'bold'},
        }}
      />
    </Stack.Navigator>
  );
}

export default Index;