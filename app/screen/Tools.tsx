import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";



type Props =  {navigation: NavigationHelpers<ParamListBase,BottomTabNavigationEventMap>};
export default function Tools({navigation}:Props) {
    return(
        <View>
            <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={() => navigation.navigate("LessonScreen")}>
            <Text style={styles.buttonTextStyle}>Học trực tuyến</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={() => navigation.navigate("ExamScreen")}>
            <Text style={styles.buttonTextStyle}>Thi thử, bài tập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={() => navigation.navigate("ChatScreen")}>
            <Text style={styles.buttonTextStyle}>Gia sư môn học</Text>
            </TouchableOpacity>
        </View>
    )
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
      borderWidth: 2,
      color: '#FFFFFF',
      borderColor: '#000000',
      height: 150,
      width: 150,
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