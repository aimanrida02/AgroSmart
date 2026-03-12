import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n/i18n';

const DashboardScreen = ({ navigation }) => {
  const [language, setLanguage] = useState('en');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      const userData = await AsyncStorage.getItem('userData');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.locale = savedLanguage;
      }
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name || user.email);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      i18n.t('logout'),
      i18n.t('confirmLogout'),
      [
        {
          text: i18n.t('cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: i18n.t('logout'),
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  const DashboardButton = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonIcon}>{icon}</Text>
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{i18n.t('welcome')}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selector */}
      <View style={styles.languageSelector}>
        {['en', 'hi', 'te'].map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.langButton,
              language === lang && styles.langButtonActive,
            ]}
            onPress={async () => {
              setLanguage(lang);
              i18n.locale = lang;
              await AsyncStorage.setItem('language', lang);
            }}
          >
            <Text style={styles.langButtonText}>
              {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dashboard Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            <DashboardButton
              title={i18n.t('soilHistory')}
              icon="📊"
              onPress={() => navigation.navigate('SoilHistory')}
            />
            <DashboardButton
              title={i18n.t('soilRecommendation')}
              icon="🌾"
              onPress={() => navigation.navigate('SoilRecommendation')}
            />
          </View>
          <View style={styles.row}>
            <DashboardButton
              title={i18n.t('voiceAssistant')}
              icon="🎤"
              onPress={() => navigation.navigate('VoiceAssistant')}
            />
            <DashboardButton
              title={i18n.t('chatbot')}
              icon="💬"
              onPress={() => navigation.navigate('Chatbot')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2E8B57',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    fontSize: 24,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
    backgroundColor: '#fff',
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  langButtonActive: {
    backgroundColor: '#2E8B57',
  },
  langButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  gridContainer: {
    gap: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 150,
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  buttonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default DashboardScreen;