import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, FlatList, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const { width: screenWidth } = Dimensions.get('window');

const img1 = require('../assets/img1.png');
const img2 = require('../assets/img2.png');
const img3 = require('../assets/img3.png');

const data = [
    { source: img1 },
    { source: img2 },
    { source: img3 },
];

export default function Index() {
    const [fontsLoaded] = useFonts({
        'regular': require('../assets/fonts/DMSans_24pt-Regular.ttf'),
        'bold': require('../assets/fonts/DMSans_18pt-Bold.ttf'),
        'medium': require('../assets/fonts/DMSans_36pt-Medium.ttf'),
    });

    const [location, setLocation] = useState(null);
    const [institutions, setInstitutions] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const carouselRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % data.length;
                if (carouselRef.current) {
                    carouselRef.current.snapToItem(nextIndex);
                }
                return nextIndex;
            });
        }, 6000); // 6 segundos

        return () => clearInterval(interval);
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    const requestLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Permissão de localização é necessária para buscar instituições próximas.');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        fetchNearbyInstitutions(location.coords.latitude, location.coords.longitude);
    };

    const fetchNearbyInstitutions = (latitude, longitude) => {
        const mockInstitutions = [
            { id: 1, name: 'APAE', distance: '1,983.6 km' },
            { id: 2, name: 'CEI ESPERANÇA DE SIÃO', distance: '1.1 km' },
        ];
        setInstitutions(mockInstitutions);
    };

    if (!fontsLoaded) {
        return null;
    }

    const DATA = [
        { id: '1', title: 'APAE' },
        { id: '2', title: 'CEI ESPERANÇA DE SIÃO' },
        { id: '3', title: 'REVLON' },
        { id: '4', title: 'LAKMÉ' },
        { id: '5', title: 'GARNIER' },
        { id: '6', title: 'MAYBELLINE' },
        { id: '7', title: 'CLINIQUE' },
        { id: '8', title: 'SUGAR' },
    ];

    const handleSearch = (text) => {
        setSearch(text);
        if (text) {
            const newData = DATA.filter((item) => {
                const itemData = item.title
                    ? item.title.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
        } else {
            setFilteredData([]);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.carouselItem}>
                <Image source={item.source} style={styles.image} />
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={ScrollView}>
                <View style={styles.container} onLayout={onLayoutRootView}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.titulo, { color: '#FDAA5D' }]}>Boas
                            <Text style={{ color: '#4AB7B6' }}> vindas</Text>
                        </Text>

                        <TouchableOpacity style={styles.notificacao}>
                            <Ionicons name="notifications" size={26} color="#EA7173" />
                        </TouchableOpacity>
                    </View>

                    {/* Localização */}
                    <View style={styles.boxLocal}>
                        <View style={styles.iconeLocal}>
                            <Ionicons name="location-outline" size={35} color="#FFFFFF" />
                        </View>

                        <TouchableOpacity onPress={requestLocation}>
                            <Text style={styles.textPermitir}>Permitir localização?</Text>
                        </TouchableOpacity>
                    </View>

                    {location && (
                        <View style={styles.local}>
                            <Text style={styles.textInst}>Instituições próximas:</Text>
                            {institutions.map(inst => (
                                <Text style={styles.textInstuicao} key={inst.id}>{inst.name} - {inst.distance}</Text>
                            ))}
                        </View>
                    )}

                    {/* Barra de Pesquisa */}
                    <View style={styles.boxBarraPesquisa}>
                        <Ionicons name="search" size={26} color="#7D8FAB" />

                        <TextInput
                            style={styles.barraPesquisa}
                            placeholder="Explorar organizações "
                            value={search}
                            onChangeText={(text) => handleSearch(text)}
                        />

                        <Ionicons name="remove" size={30} color="#CFCECE" style={{ transform: [{ rotate: '90deg' }] }} />

                        <Ionicons name="chevron-forward" size={30} color="#73C5C5" style={{ marginLeft: -10 }} />
                    </View>

                    {search ? (
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>}
                        />
                    ) : null}

                    {/* Carrossel de Imagens */}
                    <View style={styles.carouselContainer}>
                        <Carousel
                            ref={carouselRef}
                            data={data}
                            renderItem={renderItem}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth}
                            onSnapToItem={(index) => setActiveIndex(index)}
                            autoplay={false}
                            loop={true}
                        />
                    </View>

                    {/* categoria */}
                    <View style={styles.boxCategoria}>
                        <Text style={styles.tituloCat}>Categorias</Text>
                        <View style={styles.categoria}>
                            <TouchableOpacity style={[styles.categ, { backgroundColor: '#4AB7B6' }]}>
                                <Image style={styles.iconeCat} source={require('../assets/alimentos.png')} />
                                <Text style={styles.textCat}>Alimentos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.categ, { backgroundColor: '#4B9DCB' }]}>
                                <Image style={styles.iconeCatDin} source={require('../assets/dinheiro.png')} />
                                <Text style={styles.textCat}>Dinheiro</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.categ, { backgroundColor: '#AF558B' }]}>
                                <Image style={styles.iconeCat} source={require('../assets/roupas.png')} />
                                <Text style={styles.textCat}>Roupas</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* organização */}
                    <View style={styles.boxOrganizacao}>
                        <Text style={styles.tituloOrg}>Organizações mais doadas</Text>

                        <View style={styles.organizacao}>
                            <Image style={styles.imgOrg} source={require('../assets/org1.png')} />

                            <Image style={styles.imgOrg} source={require('../assets/org1.png')} />

                            <Image style={styles.imgOrg} source={require('../assets/org1.png')} />
                        </View>

                        <View style={[styles.organizacao, { marginTop: 20 }]}>
                            <Image style={styles.imgOrg} source={require('../assets/org1.png')} />

                            <Image style={styles.imgOrg} source={require('../assets/org1.png')} />

                            <Image style={styles.imgOrg} source={require('../assets/org1.png')} />
                        </View>
                    </View>

                    {/* nos somos */}
                    <View style={styles.boxNoSomos}>
                        <Text style={styles.tituloSomos}>Quem somos nós?</Text>

                        <View style={styles.doacao}>
                            <View>
                                <Image source={require('../assets/imgDoacao.png')} style={styles.imgDoacao} />
                            </View>
                            <View style={styles.infosDoacao}>
                                <Text style={styles.tituloDoacao}>Ajude a fazer o bem</Text>
                                <Text style={styles.descricao}>
                                    Facilitamos suas doações para transformar vidas.                             </Text>
                                <TouchableOpacity style={styles.botaoDoacao}>
                                    <Text style={styles.textBotao}>Doar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <StatusBar style="auto" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    ScrollView: {
        minHeight: 100,
    },
    container: {
        flex: 1,
        margin: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titulo: {
        fontFamily: 'bold',
        fontSize: 22,
    },
    notificacao: {
        backgroundColor: '#E4E4E4',
        width: 40,
        height: 40,
        alignItems: 'center',
        borderRadius: 50,
        justifyContent: 'center',
    },
    boxLocal: {
        flexDirection: 'row',
        marginTop: 20,
    },
    iconeLocal: {
        backgroundColor: '#4AB7B6',
        width: 55,
        height: 55,
        alignItems: 'center',
        borderRadius: 50,
        justifyContent: 'center',
        marginRight: 10,
    },
    textPermitir: {
        fontFamily: 'regular',
        fontSize: 16,
        color: '#293041',
        marginTop: 5,
    },
    local: {
        marginLeft: 66,
        marginTop: -25,
    },
    textInst: {
        fontFamily: 'medium',
        color: '#33363E',
    },
    textInstuicao: {
        fontFamily: 'regular',
        color: '#565961',
    },
    boxBarraPesquisa: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    barraPesquisa: {
        color: '#7D8FAB',
        fontFamily: 'regular',
        paddingLeft: 5,
        flex: 1, // Ensure it takes available space
    },
    carouselContainer: {
        marginTop: 20, // Adjust this to control the spacing
    },
    carouselItem: {
        width: screenWidth,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 100,
    },
    image: {
        width: '85%', // Set width to 100% to fit the container
        borderRadius: 20,
    },
    tituloCat: {
        fontFamily: 'bold',
        color: '#303733',
        fontSize: 18,
        marginVertical: 20, // Adjust this to control the spacing
    },
    categoria: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    categ: {
        width: 100,
        height: 100,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconeCat: {
        width: 40,
        height: 35,
        marginBottom: 10
    },
    iconeCatDin: {
        width: 30,
        height: 35,
        marginBottom: 10
    },
    textCat: {
        fontFamily: 'medium',
        color: '#FFFFFF',
        fontSize: 16
    },
    tituloOrg: {
        fontFamily: 'bold',
        color: '#303733',
        fontSize: 18,
        marginVertical: 20, // Adjust this to control the spacing
    },
    organizacao: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    imgOrg: {
        width: 100,
        height: 100
    },
    tituloSomos: {
        fontFamily: 'bold',
        color: '#303733',
        fontSize: 18,
        marginVertical: 20, // Adjust this to control the spacing
    },
    doacao: {
        flexDirection: 'row',
        backgroundColor: '#C8EDD9',
        padding: 20,
        borderRadius: 20,
        justifyContent: 'cen',
        alignItems: 'center'
    },
    imgDoacao: {
        width: 80,
        height: 70,
        marginRight: 15
    },
    tituloDoacao: {
        color: '#303733',
        fontFamily: 'medium',
        fontSize: 17
    },
    descricao: {
        fontFamily: 'regular',
        width: 210,
        marginTop: 10
    },
    botaoDoacao: {
        backgroundColor: '#14AB87',
        marginTop: 10,
        padding: 5,
        width: 80,
        alignItems: 'center',
        borderRadius: 20
    },
    textBotao: {
        fontFamily: 'bold',
        color: '#FFFFFF'
    }
});
