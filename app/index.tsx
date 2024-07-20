import * as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthContext } from './AuthContext'
import LoginScreen from './screen/Login';
import SignupScreen from './screen/Signup';
import LessonScreen from './screen/Lesson';
import ToolScreen from './screen/Tools';
import ChatScreen from './screen/Chatbot';
import ExamScreen from './screen/Exam';
import SettingScreen from './screen/Settings';

type RootStackParamList = {
  LogInScreen: undefined;
  SignUpScreen: undefined;
  LessonScreen: undefined;
  ToolScreen: undefined;
  ChatScreen: undefined;
  ExamScreen: undefined;
  SettingScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

type State = {
  isLoading: boolean,
  isSignout: boolean,
  userToken: string|null,
}
type Action = 
| {type:'RESTORE_TOKEN', token:string|null} 
| {type:'SIGN_IN', token:string|null}
| {type:'SIGN_OUT'}

function Index() {
  const [state, dispatch] = React.useReducer(
    (prevState:State, action:Action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      } catch (e) {
        userToken = null;
        dispatch({ type: 'SIGN_OUT'});
      }


    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data:string) => {
        dispatch({ type: 'SIGN_IN', token: data });
      },
      signOut: async () => {dispatch({ type: 'SIGN_OUT' }); await AsyncStorage.removeItem('userToken')},
    }),
    []
  );


  return (
    <AuthContext.Provider value={authContext}>
      {state.userToken == null ? (
        <Stack.Navigator 
        screenOptions={{
          headerStyle:{backgroundColor: '#4b7b30'},
          headerTintColor: '#fff',
          headerTitleStyle:{fontWeight: 'bold'},}}>
          <Stack.Screen 
            name="LogInScreen"
            component={LoginScreen}  
            options={{
              headerBackVisible: false,
            }}
          />
          <Stack.Screen 
            name="SignUpScreen"
            component={SignupScreen}
            options={{
              title:"Đăng ký",
              headerBackVisible: false,
            }}
          />
        </Stack.Navigator>
      ) : (<Tab.Navigator 
      screenOptions={{
        headerStyle:{backgroundColor: '#4b7b30'},
        headerTintColor: '#fff',
        headerTitleStyle:{fontWeight: 'bold'},
        tabBarHideOnKeyboard:true
      }}>
        <Tab.Screen 
          name="ToolScreen"
          component={ToolScreen}  
          options={{
            title:"Tính năng",
          }}
        />
        <Tab.Screen 
          name="LessonScreen"
          component={LessonScreen}  
          options={{
            title:"Bài giảng chực tuyến",
          }}
        />
        <Tab.Screen 
          name="ChatScreen"
          component={ChatScreen}
          options={{
            title:"Gia Sư",
          }}
        />
        <Tab.Screen 
          name="ExamScreen"
          component={ExamScreen}  
          options={{
            title:"Kiểm tra, thi thử",
          }}
        />
        <Tab.Screen 
          name="SettingScreen"
          component={SettingScreen}  
          options={{
            title:"Cài đặt",
          }}
        />
      </Tab.Navigator>)}
    </AuthContext.Provider>
  );
}

export default Index;