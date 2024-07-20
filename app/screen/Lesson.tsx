import { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import SelectDropdown from "react-native-select-dropdown"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"

const options = [
    {title: 'Toàn bộ bài giảng', alias: null},
    {title: 'Lớp 6', alias: '66611b535498537db90e5f34'},
    {title: 'Lớp 7', alias: '668cf1df16bce0c1430eaa61'},
    {title: 'Lớp 8', alias: '668cf1ec16bce0c1430eaa62'},
    {title: 'Lớp 9', alias: '668cf1f016bce0c1430eaa63'},
    {title: 'Lớp 10', alias: '668cf20b16bce0c1430eaa64'},
    {title: 'Lớp 11', alias: '668cf21116bce0c1430eaa65'},
    {title: 'Lớp 12', alias: '668cf21a16bce0c1430eaa66'},
    {title: 'IELTS', alias: '668cf22416bce0c1430eaa68'}
]

interface courseJSON {
    _id: string,
    author: string,
    content: Array<Object>
    avatar: string,
    createdOn: string,
    description: string,
    grade: string,
    level: string,
    groupName: string,
    status: string,
    subject: string,
    title: string
}

interface accType {
    math : Array<dataButton>,
    literature: Array<dataButton>,
    science: Array<dataButton>,
    hisGeo: Array<dataButton>,
}

type dataButton = {
    subject: string,
    title: string
    subtitle: string
    illustration: string
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage:number) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.15;
const slideWidth = wp(35);
const itemHorizontalMargin = wp(1);


const SliderEntry = ({ data, index } : {data:dataButton, index:number}) => {

  return (
    <TouchableOpacity
              activeOpacity={1}
              style={styles.slide}
              onPress={() => { alert(`You've clicked '${data.title}'`); }}
              >
      <View style={styles.slide}>
          {data.illustration && <Image source={{uri:data.illustration}} style={styles.image} />}
          <Text style={styles.title}>{data.title}</Text>
          {data.subtitle && <Text style={styles.regularTextStyle}>{data.subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

  
export default function Lesson() {
    const [course, setCourse] = useState<null | accType>();
    const scrollViewRef = useRef(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [scrolling, setScrolling] = useState<boolean>(false);

    const queryLesson = async (lesson:string|null) => {
        let token = await AsyncStorage.getItem('userToken');
        if (token) {token = token.replace(/['"]+/g, '')};
        let dataSending = {};
        if (lesson != null){
            dataSending = {"action": "list", "groupid": lesson};
        }
        else{
            dataSending = {"action": "list"}
        }
        fetch('http://gptapi.congcuxanh.com/loadCourse', {
            method: 'POST',
            body: JSON.stringify(dataSending),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        .then((response)=>response.json())
        .then((response)=>{
            return response.data.map((item:courseJSON) => ({
                subject: item.subject,
                title: item.title,
                subtitle: item.level.toUpperCase(),
                illustration: `http://gptapi.congcuxanh.com/courseimg/${item?._id}/${item.avatar}`
            }));        
        })
        .then((response)=>{
            const groupedBook = response.reduce((acc:accType, book:dataButton) => {
                const category = book.subject;
                if(category == "toán"){
                    acc.math.push(book);
                } else if (category == "ngữ văn"){
                    acc.literature.push(book);
                } else if (category == "khoa học tự nhiên"){
                    acc.science.push(book);
                } else if (category == "lịch sử/địa lý"){
                    acc.hisGeo.push(book);
                }
                return acc;
            }, {
                math : [],
                literature: [],
                science: [],
                hisGeo: [],
            }   
        )
        setCourse(groupedBook);
        }).then(()=>console.log(course))
        .catch((error)=>{
          Toast.show({type: 'error', text1:error});
        });  
    }

    const handleScroll = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrolling(true);
        const offsetX = event.nativeEvent.contentOffset.x;
        const pageIndex = Math.floor((offsetX + slideWidth * 0.5) / slideWidth );
        setCurrentPage(pageIndex);
      };
    
      const handleScrollEnd = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrolling(false);
        const offsetX = event.nativeEvent.contentOffset.x;
    
        // Calculate the new offset to center the next slide
        const newOffset = (currentPage - 1) * (slideWidth + itemHorizontalMargin);
      };

      
    return(
        <View style={styles.mainBody}>
            <SelectDropdown
                data={options}
                onSelect={(selectedItem) => {queryLesson(selectedItem.alias)}}
                renderButton={(selectedItem, isOpened) => {
                return (
                    <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                            {(selectedItem && selectedItem.title) || "chọn lớp"}
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
            <View style={styles.SectionStyle}>
                <View style={styles.SectionStyle}>
                    <Text style={styles.regularTextStyle}>Toán</Text>
                </View>
                <View style={styles.container}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        onMomentumScrollEnd={handleScrollEnd}
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.scrollView}
                    >
                    {course?.math.map((slide, index) => (
                        <SliderEntry key={index} data={slide} index={index} />
                    ))}        
                    
                    </ScrollView>
                    <View style={styles.pagination}>
                        {course?.math.map((_, index) => (
                            <View
                            key={index}
                            style={[
                                styles.dot,
                                { opacity: currentPage === index ? 1 : 0.3 },
                            ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
            <View style={styles.SectionStyle}>
                <View style={styles.SectionStyle}>
                    <Text style={styles.regularTextStyle}>Ngữ văn</Text>
                </View>
                <View style={styles.container}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        onMomentumScrollEnd={handleScrollEnd}
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.scrollView}
                    >
                    {course?.literature.map((slide, index) => (
                        <SliderEntry key={index} data={slide} index={index} />
                    ))}        
                    
                    </ScrollView>
                    <View style={styles.pagination}>
                        {course?.literature.map((_, index) => (
                            <View
                            key={index}
                            style={[
                                styles.dot,
                                { opacity: currentPage === index ? 1 : 0.3 },
                            ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
            <View style={styles.SectionStyle}>
                <View style={styles.SectionStyle}>
                    <Text style={styles.regularTextStyle}>Khoa học tự nhiên</Text>
                </View>
                <View style={styles.container}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        onMomentumScrollEnd={handleScrollEnd}
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.scrollView}
                    >
                    {course?.science.map((slide, index) => (
                        <SliderEntry key={index} data={slide} index={index} />
                    ))}        
                    
                    </ScrollView>
                    <View style={styles.pagination}>
                        {course?.science.map((_, index) => (
                            <View
                            key={index}
                            style={[
                                styles.dot,
                                { opacity: currentPage === index ? 1 : 0.3 },
                            ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
            <View style={styles.SectionStyle}>
                <View style={styles.SectionStyle}>
                    <Text style={styles.regularTextStyle}>Lịch sử/địa lý</Text>
                </View>
                <View style={styles.container}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        onMomentumScrollEnd={handleScrollEnd}
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.scrollView}
                    >
                    {course?.hisGeo.map((slide, index) => (
                        <SliderEntry key={index} data={slide} index={index} />
                    ))}        
                    
                    </ScrollView>
                    <View style={styles.pagination}>
                        {course?.hisGeo.map((_, index) => (
                            <View
                            key={index}
                            style={[
                                styles.dot,
                                { opacity: currentPage === index ? 1 : 0.3 },
                            ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
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
        flex: 1,
      height: 40,
      marginLeft: 35,
      marginRight: 35,
      margin: 5,
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
      fontSize: 10,
    },
    regularTextStyle:{
      fontSize: 20,
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
      container: {
        flex: 3,
        height: slideHeight,
        justifyContent: 'center',
        alignItems: 'center',
      },
      scrollView: {
        alignItems: 'center',
        marginStart: 10,
      },
      slide: {
        height: "100%",
        width: slideWidth, // Display a portion of the next slide
        marginHorizontal: itemHorizontalMargin, // Create space between slides
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#9DD6EB',
      },
      image: {
        //width: 200,
        //height: 200,
        flex: 1,
        resizeMode: 'contain', 
        borderRadius: 10
      },
      title: {
        fontSize: 15,
      },
      pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
      },
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#000',
        margin: 5,
      },
  });