import React, {useState, useRef} from 'react';
import Toast from 'react-native-toast-message';
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
  

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpScreen'>;
export default function LoginScreen({navigation}:Props) {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState(''); 
    const [userPassword, setUserPassword] = useState('');
    const [errortext, setErrortext] = useState('');

    const [confirmFlag, setConfirmFlag] = useState(false);

    const validatePassword = (suggest:string) => {
      return !suggest.match(/^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d@.#$!%*?&]{6,}$/);
    }

    const handleSubmitPress = () => {
        setErrortext('');
        if (!userEmail.toLowerCase().match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
            Toast.show({type: 'error', text1:'Email không hợp lệ', text2: 'Xin hãy kiểm tra lại'});
            return;
        }
        if (!userName){
          Toast.show({type: 'error', text1:'Tên chưa điền', text2: 'Làm ơn điền tên bạn'});
            return;
        }
        if (validatePassword(userPassword)){
            Toast.show({type: 'error', text1:'Mật khẩu không hợp lệ', text2: 'Mật khẩu cần ít nhất 6 kí tự và chữ viết hoa'})
            return;
        }
        if (confirmFlag){
          Toast.show({type: 'error', text1:'Mật khẩu không khớp khi điền lại', text2: 'Kiểm tra lại mật khẩu của bạn'})
          return;
      }
        let dataSending = {"email": userEmail, "username": userName, "password": userPassword, "system": "hssv", "dealer": "3la", "language": "vn", "level": "0"};

        fetch('http://gptapi.congcuxanh.com/users/register', {
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
              navigation.navigate("LogInScreen");
            }else{
                setErrortext("Please check your information");
            }
        })
        .catch((error)=>{
            Toast.show({type: 'error', text1:error});
        })

    }
    return (
        <View style={styles.mainBody}>
          <View>
            <Text style={styles.regularTextStyle}>Email:</Text>
          </View>
            <View style={styles.SectionStyle}>
                <TextInput
                style={styles.inputStyle}
                onChangeText={(userEmail)=>setUserEmail(userEmail)}
                placeholder='Email'/>
            </View>
            <View>
              <Text style={styles.regularTextStyle}>Họ tên:</Text>
            </View>
            <View style={styles.SectionStyle}>
                <TextInput
                style={styles.inputStyle}
                onChangeText={(userName)=>setUserName(userName)}
                placeholder='User Name'/>
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
            <View>
              <Text style={styles.regularTextStyle}>Xác nhận mật khẩu:</Text>
            </View>
            <View style={StyleSheet.compose(styles.SectionStyle, {marginBottom:0})}>
                <TextInput
                style = {styles.inputStyle}
                onChangeText={(userConPassword)=>{userPassword != userConPassword ? setConfirmFlag(true) : setConfirmFlag(false)}}
                placeholder='Confirm Password'
                secureTextEntry={true}
                />
            </View>
            {confirmFlag ? (
              <View style={styles.SectionStyle}>
                <Text style={styles.errorTextStyle}>Không khớp với mật khẩu trên</Text>
            </View>) : null}
            <View>
              <Text
                style={{...styles.linkTextStyle,...{textAlign:'right', paddingRight:50}}}
                onPress={()=>navigation.navigate('LogInScreen')}>Điều khoản sử dụng</Text>
            </View>
            {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>Đăng ký</Text>
            </TouchableOpacity>
            <View style={{...styles.SectionStyle, ...{alignSelf:'center'}}}>
              <Text>Đã có tài khoản? </Text>
              <Text
                style={styles.linkTextStyle}
                onPress={()=>navigation.navigate('LogInScreen')}>Đăng nhập</Text>
            </View>
          <Toast />
        </View>
  );
}

const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
      backgroundColor: '#dfe9f6',
      alignContent: 'center',
      paddingTop: 30,
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