import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileComponent from './ProfileComponent';
import type { RootStackParamList } from './AppNavigator';
import { LinearGradient } from "expo-linear-gradient"; 

type Nav = NativeStackNavigationProp<RootStackParamList>;

const AccountComponent = () => {
  const navigation = useNavigation<Nav>();

  const accountList = [
    { icon: 'time-outline' as const, name: 'History', route: 'History' as const },
    { icon: 'home-outline' as const, name: 'My Address', route: 'MyAddress' as const },
    { icon: 'help-circle-outline' as const, name: 'Help', route: 'Help' as const },
  ];

  return (
    <LinearGradient
          colors={["#E65100","#FFB74D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{width:"100%",height:"100%"}}
          >
      <ProfileComponent navigation={navigation}/>
      <View>
        {accountList.map((item, idx) => (
          <Pressable
            key={item.route}
            onPress={() => navigation.navigate(item.route)}
            style={{
              flexDirection: 'row',
              padding: 20,
              backgroundColor: '#fff',
              marginHorizontal: 10,
              marginTop: idx === 0 ? 10 : 0,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={item.icon} size={22} style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16 }}>{item.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} />
          </Pressable>
        ))}
      </View>
    </LinearGradient>
  );
};

export default AccountComponent;
