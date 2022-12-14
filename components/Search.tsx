import { Flex, HStack, Avatar, Text, ScrollView, Input, Center, Image, Icon, Button } from "native-base";
import React, { useEffect, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
//import Carousel from 'react-native-snap-carousel'
import { ActivityIndicator, Dimensions, Keyboard } from "react-native"; 
import { fetchByTag } from "../utils/firebase-adapter";
import { useMutation, useQueries } from "react-query";
import { values } from "ramda";
import ViewImage from "./ViewImage";



// Use expo constant variable
export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = 200

const CarouselCardItem = ({ item, index }: any) => {
    return (
        <ViewImage uri={values(item.upload)[0].uri} uid={''} />
    )
}


export const Search = () => {

    const [inputText, setInputText] = useState<string>('');

    const isCarousel = React.useRef(null)

    const queryWedding = () => {
        try {
            const response = fetchByTag('Wedding');
            return Promise.resolve(response);
        } catch {
            return Promise.reject('Network Failed')
        }
    }

    const queryOuting = () => {
        try {
            const response = fetchByTag('Outing');
            return Promise.resolve(response);
        } catch {
            return Promise.reject('Network Failed')
        }
    }

    const searchQuery = (id: string) => {
        console.log(id);
        return Promise.resolve(5)
    }

    const { "0": wedding, "1": outing } = useQueries([
        { queryKey: 'wedding', queryFn: queryWedding },
        { queryKey: 'outing', queryFn: queryOuting }
    ])

    const { mutate, data } = useMutation({
        mutationKey: ['search'],
        mutationFn: searchQuery
    })

    useEffect(() => {
        // TODO: Configure the search box correctly to its corresponding queries
        Keyboard.addListener('keyboardDidHide', (event) => {
            setInputText('')
            mutate(inputText)


        })
        return () => {
            Keyboard.removeAllListeners('keyboardDidHide')
        }

    }, [])

    if (wedding.status === 'loading' || outing.status === 'loading') {
        return (
            <Center flex={'1'}>
                <ActivityIndicator size={'large'} />
            </Center>
        )
    } else if (wedding.status === 'error' || outing.status === 'error') {

        return (
            <Center p="20" flex={'1'} >
                <Icon as={MaterialIcons} name="error-outline" size={'4xl'} />

                <Text fontSize="md" my={'4'}>{outing.error as string}</Text>
                <Button
                    colorScheme="warning"
                    onPress={queryWedding}
                >
                    Click Here to try again
                </Button>

            </Center>
        )

    }
    else if (wedding.status === 'success' && outing.status === 'success') {

        return (
            <>
                <HStack bg={'white'} width={'full'} px={'3'} py={'4'}>
                    <Input
                        placeholder="Search"
                        w={'full'}
                        fontSize={'sm'}
                        value={inputText}
                        onChangeText={(event) => setInputText(event)}
                        InputLeftElement={<Icon as={AntDesign} name="search1" />
                        }
                    />
                </HStack>

                <ScrollView px={'2'} bg={'white'}>


                    {/* <Text px={'3'} fontSize="md" bg={'white'} color={'blueGray.700'} fontWeight={'semibold'}>Wedding Event</Text> */}

                    {/* <Carousel
                        layout="default"

                        ref={isCarousel}
                        data={wedding.data}
                        renderItem={CarouselCardItem}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        activeSlideAlignment={'start'}
                        inactiveSlideShift={0}
                        useScrollView={true}
                        vertical={false}

                    /> */}

                    {/* <Text px={'3'} fontSize="md" bg={'white'} color={'blueGray.700'} fontWeight={'semibold'}>Special Outing</Text> */}

                    {/* <Carousel
                        layout="default"
                        activeSlideAlignment={'start'}
                        ref={isCarousel}
                        data={outing.data}
                        renderItem={CarouselCardItem}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        inactiveSlideShift={0}
                        useScrollView={true}
                        vertical={false}
                    /> */}
                </ScrollView>
            </>

        )
    } else {
        return <ActivityIndicator size={'large'} />
    }
}
