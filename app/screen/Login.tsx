import React, {useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {AuthContext} from '../AuthContext'

type RootStackParamList = {
  LogInScreen: undefined;
  SignUpScreen: undefined;
};

const storeID = async (value:object) => {
  await AsyncStorage.setItem('userToken', JSON.stringify(value));
}
  

type Props = NativeStackScreenProps<RootStackParamList, 'LogInScreen'>;
export default function LoginScreen({navigation}:Props) {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [errortext, setErrortext] = useState('');

    const {signIn} = useContext(AuthContext);

    const handleSubmitPress = () => {
        setErrortext('');
        if (!userEmail.toLowerCase().match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
          Toast.show({type: 'error', text1:'Email không hợp lệ', text2: 'Xin hãy kiểm tra lại'});
          return;
        }
        if (!userPassword){
          Toast.show({type: 'error', text1:'Mật khẩu chưa được điền', text2: 'Xin hãy kiểm tra lại'});
            return;
        }

        let dataSending = {"email": userEmail, "password": userPassword, "system": 'hssv'};

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
              Toast.show({type: 'success', text1:'Đăng ký thành công'})
              signIn(responseJson.token);
              storeID(responseJson.token);
            }else{
                setErrortext("Xin kiểm tra lại mật khẩu và email");
            }
        })
        .catch((error)=>{
          Toast.show({type: 'error', text1:error});
        })

    }
    return (
        <View style={styles.mainBody}>
          <View style={{paddingTop:40}}>
            <Text style={styles.regularTextStyle}>Email:</Text>
          </View>
            <View style={styles.SectionStyle}>
                <TextInput
                style={styles.inputStyle}
                onChangeText={(userEmail)=>setUserEmail(userEmail)}
                placeholder='Email'/>
            </View>
            <View>
              <Text style={styles.regularTextStyle}>Mật khẩu:</Text>
            </View>
            <View style={styles.SectionStyle}>
                <TextInput
                style = {styles.inputStyle}
                onChangeText={(userPassword)=>setUserPassword(userPassword)}
                placeholder='Enter Password'
                secureTextEntry={true}
                />
            </View>
            {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={{...styles.SectionStyle, ...{alignSelf:'center'}}}>
              <Text>Chưa có tài khoản? </Text>
              <Text
                style={styles.linkTextStyle}
                onPress={()=>navigation.navigate('SignUpScreen')}>Đăng ký</Text>
            </View>
          <Toast/>
        </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#dfe9f6',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginLeft: 35,
    marginRight: 35,
    margin: 5,
    marginBottom:15,
  },
  buttonStyle: {
    backgroundColor: '#9ae098',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#000000',
    borderTopWidth:2,
    borderLeftWidth:2,
    borderRightWidth:2,
    borderBottomWidth:2,
    height: 50,
    alignItems: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    paddingVertical: 10,
    fontSize: 16,
  },
  regularTextStyle:{
    paddingLeft: 40,
    fontSize: 16
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF'
  },
  linkTextStyle: {
    color: '#2f6dba',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});