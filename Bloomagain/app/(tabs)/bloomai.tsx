import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSession } from '@descope/react-native-sdk'; // Import Descope session hook

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
export default function BloomAI() {
  // Manual safe area - using fixed values instead of useSafeAreaInsets
  const insets = {
    top: Platform.OS === 'ios' ? 44 : 24,
    bottom: Platform.OS === 'ios' ? 34 : 0,
    left: 0,
    right: 0,
  };
  
  const videoRef = useRef(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { session } = useSession(); // Get Descope session
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m BloomAI. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Video parameters
  const videoParams = {
    width: width * 0.8,    // 80% of screen width
    height: 70,           // Same height as home screen header
    topSpacing: 0,        // Space from top
    borderRadius: 15      // Corner roundness
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');

    try {
      console.log('Sending message to backend:', inputText);
      
      const requestBody: any = {
        query: inputText,
        user_id: session?.user?.userId || 'mobile_user_123', // Use Descope user ID
      };

      // Add session token if available from Descope
      if (session?.sessionJwt) {
        requestBody.session_token = session.sessionJwt;
      }
      
      // Include Authorization header with Descope session token
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (session?.sessionJwt) {
        headers.Authorization = `Bearer ${session.sessionJwt}`;
      }
      
      const response = await fetch('http://192.168.1.7:5000/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.response) {
        const aiMessage: Message = {
          id: Date.now().toString() + 'ai',
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else if (data.error) {
        const errorMessage: Message = {
          id: Date.now().toString() + 'error',
          text: `Backend error: ${data.error}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + 'error',
        text: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/bg.png')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      {/* Fixed Header with Video */}
      <View style={[styles.headerContainer, {
        paddingTop: insets.top + videoParams.topSpacing,
        height: insets.top + videoParams.height + 20
      }]}>
        <View style={[styles.videoContainer, {
          width: videoParams.width,
          height: videoParams.height,
          borderRadius: videoParams.borderRadius,
        }]}>
          <Video
            ref={videoRef}
            style={[styles.video, {
              width: videoParams.width,
              height: videoParams.height,
              borderRadius: videoParams.borderRadius
            }]}
            source={require('../../assets/images/calendarhearder.mp4')}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted={true}
          />
        </View>
      </View>

      {/* Chat Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.mainScroll}
        contentContainerStyle={{ 
          paddingTop: insets.top + videoParams.height + 40,
          paddingHorizontal: 15
        }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isUser ? styles.userMessageText : styles.aiMessageText,
            ]}>
              {message.text}
            </Text>
            <Text style={[
              styles.timestamp,
              message.isUser ? styles.userTimestamp : styles.aiTimestamp,
            ]}>
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Message Box */}

      <View style={[styles.inputContainer, { 
        paddingBottom: Math.max(insets.bottom, 15),
        marginBottom: isInputFocused ? -20 : 80 // Add margin when keyboard is active to stay above keyboard
      }]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim() === '' ? '#666' : '#007AFF'}
          />
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.7,
  },
  mainScroll: {
    flex: 1,
  },
  videoContainer: {
    position: 'absolute',
    overflow: 'hidden',
    left: (width - (width * 0.8)) / 2, // Center horizontally
    zIndex: 2,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  video: {
    width: '100%',
    height: '100%',
    
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesList: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 20,
    marginBottom: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(229, 229, 229, 0.8)',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#000000',
  },
  aiMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
  aiTimestamp: {
    color: '#666666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 229, 229, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomMessageBox: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(248, 248, 248, 0.95)',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bottomMessageText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
});