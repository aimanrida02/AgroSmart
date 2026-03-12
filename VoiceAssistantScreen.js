import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import i18n from '../i18n/i18n';

const VoiceAssistantScreen = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: i18n.t('voiceAssistantGreeting'),
    },
  ]);

  const languageMap = {
    en: 'en-US',
    hi: 'hi-IN',
    te: 'te-IN',
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.locale = savedLanguage;
      }
    };
    loadLanguage();

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    Tts.setDefaultLanguage(languageMap[language]);
    Tts.setDefaultRate(0.9);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [language]);

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechRecognized = () => {
    setRecognized('recognized');
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechError = (e) => {
    console.error(e);
    setIsListening(false);
  };

  const onSpeechResults = (e) => {
    setTranscript(e.value[0]);
  };

  const startListening = async () => {
    try {
      setTranscript('');
      setRecognized('');
      setIsListening(true);
      await Voice.start(languageMap[language]);
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
      if (transcript) {
        await handleQuery(transcript);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuery = async (query) => {
    setMessages([
      ...messages,
      { type: 'user', text: query },
    ]);

    // Mock AI Response
    const mockResponses = {
      soil: i18n.t('soilInfo'),
      crop: i18n.t('cropInfo'),
      fertilizer: i18n.t('fertilizerInfo'),
      default: i18n.t('defaultResponse'),
    };

    let botResponse = mockResponses.default;
    if (query.toLowerCase().includes('soil')) {
      botResponse = mockResponses.soil;
    } else if (query.toLowerCase().includes('crop')) {
      botResponse = mockResponses.crop;
    } else if (query.toLowerCase().includes('fertilizer')) {
      botResponse = mockResponses.fertilizer;
    }

    setMessages((prev) => [
      ...prev,
      { type: 'bot', text: botResponse },
    ]);

    // Speak the response
    await Tts.speak(botResponse);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← {i18n.t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('voiceAssistant')}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.type === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.type === 'user' ? styles.userText : styles.botText,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputSection}>
        {isListening && (
          <View style={styles.listeningIndicator}>
            <ActivityIndicator size="large" color="#2E8B57" />
            <Text style={styles.listeningText}>{i18n.t('listening')}</Text>
          </View>
        )}

        {transcript && (
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptLabel}>{i18n.t('you')}:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}

        {/* Voice Button */}
        <TouchableOpacity
          style={[
            styles.voiceButton,
            isListening && styles.voiceButtonActive,
          ]}
          onPress={isListening ? stopListening : startListening}
        >
          <Text style={styles.voiceButtonText}>
            {isListening ? '🛑' : '🎤'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.buttonLabel}>
          {isListening ? i18n.t('stopListening') : i18n.t('startListening')}
        </Text>
      </View>
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
  backButton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageBubble: {
    marginVertical: 8,
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2E8B57',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  listeningIndicator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  listeningText: {
    marginTop: 10,
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: '600',
  },
  transcriptBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderLeftColor: '#2E8B57',
    borderLeftWidth: 4,
  },
  transcriptLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  voiceButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  voiceButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  voiceButtonText: {
    fontSize: 32,
  },
  buttonLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
  },
});

export default VoiceAssistantScreen;