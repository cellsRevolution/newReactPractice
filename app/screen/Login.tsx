import React, {useState, useRef} from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    LogInScreen: undefined;
    SignUpScreen: undefined;
  };
  
type Account = {
    email: String;
    password: String;
    system: String;
}

type Props = NativeStackScreenProps<RootStackParamList, 'LogInScreen'>;
export default function LoginScreen({navigation}:Props) {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userSystem, setUserSystem] = useState('');
    const [errortext, setErrortext] = useState('');

    const sysChoice = [
        {title: "hssv"},
        {title: "office"}
    ]

    const handleSubmitPress = () => {
        setErrortext('');
        if (!userEmail){
            alert('please enter email');
            return;
        }
        if (!userPassword){
            alert('please enter password');
            return;
        }
        if (!userSystem){
            alert('please enter system');
            return;
        }
        let dataSending = {"email": userEmail, "password": userPassword, "system": userSystem};

        fetch('http://gptapi.congcuxanh.com/users/login', {
            method: 'POST',
            body: JSON.stringify(dataSending),
            headers:{
                'Content-Type': 'application/json',
            },
        })
        .then((response)=>response.json())
        .then((responseJson)=>{
            console.log(responseJson)
            if(responseJson.status === 0){
                alert('sucessful login!');
            }else{
                setErrortext("Please check your information");
            }
        })
        .catch((error)=>{
            console.error(error);
        })

    }
    return (
        <View style={styles.mainBody}>
            <View style={styles.SectionStyle}>
                <TextInput
                style={styles.inputStyle}
                onChangeText={(userEmail)=>setUserEmail(userEmail)}
                placeholder='Enter Email'/>
            </View>
            <View style={styles.SectionStyle}>
                <TextInput
                style = {styles.inputStyle}
                onChangeText={(userPassword)=>setUserPassword(userPassword)}
                placeholder='Enter Password'
                secureTextEntry={true}
                />
            </View>
            <View style={styles.SectionStyle}>
                <SelectDropdown
                data={sysChoice}
                onSelect={(userSystem)=>setUserSystem(userSystem.title)}
                renderButton={(selectedItem, isOpened) => {
                    return (
                      <View>
                        <Text style={{...styles.inputStyle, ...{paddingVertical:10}}}>
                          {(selectedItem && selectedItem.title) || 'Select your system'}
                        </Text>
                      </View>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <View style={{...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                        <Text>{item.title}</Text>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
            </View>
            {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            <Text
            style={styles.registerTextStyle}
            onPress={()=>navigation.navigate('SignUpScreen')}>Sign Up</Text>
        </View>
  );
}

const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#7393B3',
      alignContent: 'center',
    },
    SectionStyle: {
      flexDirection: 'row',
      height: 40,
      marginTop: 20,
      marginLeft: 35,
      marginRight: 35,
      margin: 10,
    },
    buttonStyle: {
      backgroundColor: '#7DE24E',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#7DE24E',
      height: 40,
      alignItems: 'center',
      borderRadius: 30,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 20,
      marginBottom: 25,
    },
    buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
    },
    inputStyle: {
      flex: 1,
      color: 'white',
      paddingLeft: 15,
      paddingRight: 15,
      borderWidth: 1,
      borderRadius: 30,
      borderColor: '#dadae8',
    },
    registerTextStyle: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      alignSelf: 'center',
      padding: 10,
    },
    errorTextStyle: {
      color: 'red',
      textAlign: 'center',
      fontSize: 14,
    },
  });