import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n/i18n';

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      text: i18n.t('chatbotGreeting'),
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.locale = savedLanguage;
      }

      const savedHistory = await AsyncStorage.getItem('chatHistory');
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    };
    loadData();
  }, []);

  const saveChatHistory = async (updatedMessages) => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');

    // Save to history
    const newHistoryEntry = {
      id: userMessage.id,
      userQuery: inputText,
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [...chatHistory, newHistoryEntry];
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);

    // Mock bot response
    setTimeout(() => {
      let botResponse = '';
      const query = inputText.toLowerCase();

      if (query.includes('nitrogen') || query.includes('n')) {
        botResponse = i18n.t('nitrogenInfo');
      } else if (query.includes('phosphorus') || query.includes('p')) {
        botResponse = i18n.t('phosphorusInfo');
      } else if (query.includes('potassium') || query.includes('k')) {
        botResponse = i18n.t('potassiumInfo');
      } else if (query.includes('pest') || query.includes('disease')) {
        botResponse = i18n.t('pestInfo');
      } else if (query.includes('water') || query.includes('irrigation')) {
        botResponse = i18n.t('waterInfo');
      } else {
        botResponse = i18n.t('defaultBotResponse');
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      newHistoryEntry.botResponse = botResponse;
      saveChatHistory([...updatedHistory, newHistoryEntry]);
    }, 500);
  };

  const clearChat = () => {
    Alert.alert(i18n.t('clearChat'), i18n.t('confirmClear'), [
      {
        text: i18n.t('cancel'),
        onPress: () => {},
      },
      {
        text: i18n.t('clear'),
        onPress: () => {
          setMessages([
            {
              id: '1',
              type: 'bot',
              text: i18n.t('chatbotGreeting'),
              timestamp: new Date(),
            },
          ]);
        },
        style: 'destructive',
      },
    ]);
  };

  const viewHistory = () => {
    if (chatHistory.length === 0) {
      Alert.alert(i18n.t('history'), i18n.t('noHistory'));
      return;
    }

    const historyText = chatHistory
      .map(
        (entry, idx) =>
          `${idx + 1}. ${i18n.t('you')}: ${entry.userQuery}\n${i18n.t('bot')}: ${entry.botResponse || ''}`
      )
      .join('\n\n');

    Alert.alert(i18n.t('conversationHistory'), historyText, [
      {
        text: i18n.t('close'),
        onPress: () => {},
      },
      {
        text: i18n.t('clearHistory'),
        onPress: async () => {
          setChatHistory([]);
          await AsyncStorage.setItem('chatHistory', JSON.stringify([]));
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← {i18n.t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('chatbot')}</Text>
        <TouchableOpacity onPress={viewHistory}>
          <Text style={styles.historyButton}>📋</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.type === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.type === 'user' ? styles.userText : styles.botText,
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.timestamp,
                item.type === 'user' ? styles.userTimestamp : styles.botTimestamp,
              ]}
            >
              {item.timestamp.toLocaleTimeString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.messagesContainer}
        inverted
        scrollEnabled
        showsVerticalScrollIndicator={false}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('typeMessage')}
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={clearChat}
        >
          <Text style={styles.quickActionText}>{i18n.t('newChat')}</Text>
        </TouchableOpacity>
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
  historyButton: {
    fontSize: 18,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageBubble: {
    marginVertical: 6,
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
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#e0e0e0',
  },
  botTimestamp: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopColor: '#eee',
    borderTopWidth: 1,
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 18,
  },
  quickActionsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  quickActionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#2E8B57',
    borderRadius: 20,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChatbotScreen;