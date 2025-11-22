import {
  ArrowLeft,
  MessageCircle,
  Mic,
  Send,
  Volume2,
  VolumeX
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { speechToTextService } from '../services/speech-to-text-service';
import { textToSpeechService } from '../services/text-to-speech-service';
import { Message as AgentMessage, voiceAgentService } from '../services/voice-agent-service';

export interface VoiceAgentProps {
  userId: string;
  userRole: 'farmer' | 'buyer';
  language: string;
  onClose: () => void;
  onAction?: (action: { type: string; route?: string; params?: any }) => void;
}

const VoiceAgentChat: React.FC<VoiceAgentProps> = ({
  userId,
  userRole,
  language,
  onClose,
  onAction,
}) => {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    initializeVoiceAgent();
    return () => {
      speechToTextService.cancelRecording();
      textToSpeechService.stop();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const initializeVoiceAgent = () => {
    voiceAgentService.initializeContext({
      userId,
      userRole,
      language,
      conversationHistory: [],
    });

    // Add welcome message
    const welcomeMessage: AgentMessage = {
      id: '1',
      role: 'assistant',
      content: t('voiceAgent.greeting', {
        defaultValue: "Hello! I'm your farming assistant. How can I help you today?",
      }),
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  };

  const handleTextSubmit = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userInput = inputText.trim();
    setInputText('');

    // Add user message
    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    await processUserInput(userInput);
  };

  const handleVoiceInput = async () => {
    if (isListening || isProcessing) return;

    try {
      setIsListening(true);
      console.log('🎤 Voice input started on platform:', Platform.OS);

      if (Platform.OS === 'web') {
        console.log('🌐 Using web-based speech recognition');
        // Use web speech recognition API directly
        try {
          const transcript = await speechToTextService.startWebSpeechRecognition(language);

          if (transcript && transcript.trim()) {
            console.log('✅ Web speech recognition successful:', transcript);
            setIsListening(false);

            // Add transcribed message
            const userMessage: AgentMessage = {
              id: Date.now().toString(),
              role: 'user',
              content: transcript.trim(),
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, userMessage]);

            await processUserInput(transcript.trim());
          } else {
            console.log('⚠️ No speech detected or transcription empty');
            setIsListening(false);
            Alert.alert(t('voiceAgent.noSpeechDetected'), t('voiceAgent.trySpeakingAgain'));
          }
        } catch (webError: any) {
          console.error('❌ Web speech recognition error:', webError);
          setIsListening(false);
          Alert.alert(t('common.error'), `Speech recognition error: ${webError.message}`);
        }
      } else {
        console.log('📱 Using native audio recording');
        // Native audio recording for mobile
        await speechToTextService.startRecording({
          language,
          continuous: false,
        });

        // Stop recording after 5 seconds or when user taps again
        const timeoutId = setTimeout(async () => {
          await stopVoiceInput();
        }, 5000);

        // Store timeout ID to cancel if needed
        (global as any).voiceInputTimeout = timeoutId;
      }

    } catch (error) {
      console.error('❌ Error starting voice input:', error);
      setIsListening(false);

      Alert.alert(t('common.error'), t('voiceAgent.voiceError'));
    }
  };

  const stopVoiceInput = async () => {
    if (!(global as any).voiceInputTimeout) return;

    try {
      clearTimeout((global as any).voiceInputTimeout);
      (global as any).voiceInputTimeout = null;

      const audioUri = await speechToTextService.stopRecording();
      setIsListening(false);

      if (audioUri) {
        // Transcribe audio
        setIsProcessing(true);
        try {
          const transcribedText = await speechToTextService.transcribeAudio(audioUri, language);

          // Add transcribed message
          const userMessage: AgentMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: transcribedText,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, userMessage]);

          await processUserInput(transcribedText);
        } catch (transcriptionError) {
          console.error('Transcription error:', transcriptionError);
          Alert.alert(t('common.error'), t('voiceAgent.transcriptionError'));
        } finally {
          setIsProcessing(false);
        }
      } else {
        setIsListening(false);
      }
    } catch (error) {
      console.error('Error stopping voice input:', error);
      setIsListening(false);
      Alert.alert(t('common.error'), t('voiceAgent.voiceStopError'));
    }
  };

  const processUserInput = async (userInput: string) => {
    setIsProcessing(true);

    try {
      const response = await voiceAgentService.processUserInput(userInput);

      // Add assistant response
      const assistantMessage: AgentMessage = {
        id: Date.now().toString() + '_resp',
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Speak response if TTS is enabled
      if (ttsEnabled && response.text) {
        await speakResponse(response.text);
      }

      // Handle action
      if (response.action && onAction) {
        setTimeout(() => {
          onAction(response.action!);
        }, 1000); // Delay to allow user to see response
      }

    } catch (error) {
      console.error('Error processing user input:', error);

      // Add error message
      const errorMessage: AgentMessage = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: t('voiceAgent.errorMessage', {
          defaultValue: 'Sorry, I encountered an error. Please try again.',
        }),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = async (text: string) => {
    if (!ttsEnabled) return;

    try {
      setIsSpeaking(true);
      await textToSpeechService.speak(text, {
        language,
        rate: 0.9,
        pitch: 1.0,
      });
    } catch (error) {
      console.error('Error speaking response:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggleTTS = () => {
    if (isSpeaking) {
      textToSpeechService.stop();
      setIsSpeaking(false);
    }
    setTtsEnabled(!ttsEnabled);
  };

  const renderMessage = (message: AgentMessage) => {
    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';

    return (
      <View
        key={message.id}
        className={`flex-row mb-3 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}
      >
        <View
          className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-blue-500 ml-12'
              : 'bg-white mr-12 border border-gray-200'
          }`}
          style={{
            alignSelf: isUser ? 'flex-end' : 'flex-start'
          }}
        >
          {isAssistant && (
            <View className="flex-row items-center mb-2">
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-2">
                <MessageCircle size={12} color="white" />
              </View>
              <Text className="text-xs text-gray-500 font-medium">
                {t('voiceAgent.assistant')}
              </Text>
            </View>
          )}
          <Text
            className={`text-sm leading-5 ${
              isUser ? 'text-white' : 'text-gray-800'
            }`}
          >
            {message.content}
          </Text>
          <Text
            className={`text-xs mt-2 ${
              isUser ? 'text-blue-200' : 'text-gray-400'
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View
        className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center shadow-sm"
      >
        <TouchableOpacity
          onPress={onClose}
          className="p-2 -m-2 mr-3"
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {t('voiceAgent.title', { defaultValue: 'Voice Assistant' })}
          </Text>
          <Text className="text-sm text-gray-500">
            {t('voiceAgent.subtitle', {
              defaultValue: `Tap to speak in ${language.toUpperCase()}`,
            })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleTTS}
          className="p-2"
        >
          {ttsEnabled ? (
            <Volume2 size={20} color={isSpeaking ? "#10B981" : "#6B7280"} />
          ) : (
            <VolumeX size={20} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}

        {/* Processing Indicator */}
        {isProcessing && (
          <View className="flex-row items-center mb-3 justify-start">
            <View className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#10B981" />
                <Text className="text-sm text-gray-600 ml-2">
                  {t('voiceAgent.processing', { defaultValue: 'Thinking...' })}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Listening Indicator */}
        {isListening && (
          <View className="flex-row justify-center mb-4">
            <View className="bg-red-500 px-4 py-2 rounded-full flex-row items-center">
              <View className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              <Text className="text-white font-medium text-sm">
                {t('voiceAgent.listening', { defaultValue: 'Listening...' })}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row items-end space-x-2">
          {/* Text Input */}
          <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 flex-row items-end">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={t('voiceAgent.typeMessage', {
                defaultValue: 'Type a message...'
              })}
              className="flex-1 text-gray-900"
              multiline={true}
              maxLength={500}
              onSubmitEditing={handleTextSubmit}
            />
            {!inputText && (
              <TouchableOpacity
                onPress={isListening ? stopVoiceInput : handleVoiceInput}
                disabled={isProcessing}
                className="ml-2"
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isListening ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                >
                  <Mic size={20} color="white" />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Send Button */}
          {inputText && (
            <TouchableOpacity
              onPress={handleTextSubmit}
              disabled={isProcessing}
              className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center ml-2"
            >
              <Send size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Status Indicators */}
        <View className="flex-row justify-between items-center mt-3">
          <Text className="text-xs text-gray-500">
            {isSpeaking && t('voiceAgent.speaking', { defaultValue: 'Speaking...' })}
          </Text>
          <Text className="text-xs text-gray-500">
            {language.toUpperCase()}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VoiceAgentChat;
