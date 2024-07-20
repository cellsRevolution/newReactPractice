import { View, Text, StyleSheet, Dimensions } from "react-native"
import SelectDropdown from "react-native-select-dropdown"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import Toast from "react-native-toast-message"

enum optionsType {
  MATH = 'math',
  PHY = 'physics',
  CHEM = 'chemistry',
  BIO = 'biology'
}

const options = [
  {title: optionsType.MATH},
  {title: optionsType.PHY},
  {title: optionsType.CHEM},
  {title: optionsType.BIO},
]

type selectTutor = {
  prompt : {
    action: 'load',
    subject: optionsType
  }
}

type messageTutor = {
  prompt : {
    action: 'tutor',
    subject: optionsType
  },
  messages: string
}

type returnMessageA = {
    _id: string,
    createdOn: string,
    messages: string,
    response: string,
}

type returnMessageB = {
  reply: string,
  status: number
}



export default function Chatbot() {
    const [subject, setSubject] = useState<optionsType>()
    const [messages, setMessages] = useState<IMessage[]>([])

    const sendQuery = async (dataSending:selectTutor|messageTutor) => {
      let token = await AsyncStorage.getItem('userToken');
      if (token) {token = token.replace(/['"]+/g, '')};
      fetch('http://gptapi.congcuxanh.com/tutor', {
        method: 'POST',
        body: JSON.stringify(dataSending),
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    .then((response)=>response.json())
    .then((response)=>{
      if (response.hasOwnProperty('data')){
        return response.data;
      }else {
        return response.reply;
      }
    })
  }

    const tutorSelect = async (subject:optionsType) => {
        setSubject(subject);
        let token = await AsyncStorage.getItem('userToken');
        if (token) {token = token.replace(/['"]+/g, '')};
        let dataSending = {prompt:{"action": "load", "subject": subject}}
        fetch('http://gptapi.congcuxanh.com/tutor', {
          method: 'POST',
          body: JSON.stringify(dataSending),
          headers:{
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          },
        })
        .then((response)=>response.json())
        .then((response)=> {
            setMessages([]);
            let newArray:IMessage[] = [];
            response.data.forEach((message:returnMessageA, index:number)=>{
              newArray.push({_id:(index*2) + 1, createdAt:Date.parse(message.createdOn), text:message.messages, user:{_id:1, name: 'User'}})
              newArray.push({_id:(index+1)*2, createdAt:Date.parse(message.createdOn), text:message.response, user:{_id:2, name: 'Tutor'}})
            })
            setMessages(previousMessages =>
              GiftedChat.append(previousMessages, newArray.reverse()),
            )
      })
        .catch((error)=>{console.log(error)})
    } 

    const tutorQuery = async (message:string, index:string|number) => {
      if (subject){
        let token = await AsyncStorage.getItem('userToken');
        if (token) {token = token.replace(/['"]+/g, '')};
        let dataSending = {prompt:{action: "tutor", subject: subject},messages:message}
        fetch('http://gptapi.congcuxanh.com/tutor', {
          method: 'POST',
          body: JSON.stringify(dataSending),
          headers:{
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          },
        })
        .then((response)=>response.json())
        .then((response)=> {
          let message = [{_id: index + '1', createdAt:new Date(), text:response.reply, user:{_id:2, name: 'Tutor'}}]
          setMessages(previousMessages => GiftedChat.append(previousMessages, message),)  
          })
        .catch((error)=>{console.log(error)})
      }
  } 

  const onSend = useCallback((messages:IMessage[]) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
    tutorQuery(messages[0].text,messages[0]._id)
  }, [])
    return(
        <View style={styles.mainBody}>
            <View style={styles.SectionStyle}>
                <SelectDropdown
                    data={options}
                    onSelect={(selectedItem) => tutorSelect(selectedItem.title)}
                    renderButton={(selectedItem, isOpened) => {
                    return (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || 'Chọn gia sư môn học'}
                            </Text>
                        </View>
                    );
                    }}
                    renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                        <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>
            <View style={styles.ChatStyle}>
              <GiftedChat
                  messages={messages}
                  onSend={messages => onSend(messages)}
                  user={{
                      _id: 1,
                  }}
              />
            </View>
        <Toast/>
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
      flex:1,
      marginLeft: 35,
      marginRight: 35,
      margin: 5,
      marginBottom:5,
      alignContent: 'center'
    },
    ChatStyle: {
      flexDirection: 'row',
      flex:5,
      marginLeft: 35,
      marginRight: 35,
      margin: 5,
      marginBottom:15,
    },

    errorTextStyle: {
      color: 'red',
      textAlign: 'center',
      fontSize: 14,
    },

    dropdownButtonStyle: {
        width: 400,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      },
      dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownButtonArrowStyle: {
        fontSize: 28,
      },
      dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
      dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
      },
      dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      },
      dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
  });