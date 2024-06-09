import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Index from './pages/index';
import Pagina from './pages/pagina';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="index"
                component={Index}
                options={{
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarIcon: () => (
                        <Ionicons name="home" size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Pagina"
                component={Pagina}
                options={{
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarIcon: () => (
                        <Ionicons name="document" size={24} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Home" 
                    component={HomeTabs} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
