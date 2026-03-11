import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../../../src/constants/theme';
import { APIClient } from '../../../src/services/apiClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m the Smart Part-Time AI assistant. I can help you find jobs, answer questions about the platform, or give career advice. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await new APIClient<any>('/api/chat').post({
        sessionId,
        message: input.trim(),
      });
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res?.message || res?.response || 'I couldn\'t process that. Please try again.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant]}>
      {item.role === 'assistant' && (
        <View style={styles.botAvatar}>
          <Ionicons name="sparkles" size={16} color={Colors.secondary} />
        </View>
      )}
      <View style={[styles.messageBubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.messageText, item.role === 'user' ? styles.messageTextUser : styles.messageTextAssistant]}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerContent}>
          <View style={styles.botIcon}>
            <Ionicons name="sparkles" size={20} color={Colors.secondary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Job Assistant</Text>
            <Text style={styles.headerSub}>Powered by Smart Part-Time AI</Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={styles.typingIndicator}>
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={14} color={Colors.secondary} />
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={Colors.secondary} />
            <Text style={styles.typingText}>Thinking...</Text>
          </View>
        </View>
      )}

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything about jobs..."
          placeholderTextColor={Colors.textLight}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={18} color={input.trim() && !loading ? Colors.secondary : Colors.textLight} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  botIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.white },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  messageList: { padding: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing.md },
  messageRow: { flexDirection: 'row', marginBottom: Spacing.sm, maxWidth: '85%' },
  messageRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  messageRowAssistant: { alignSelf: 'flex-start' },
  botAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', margin: 4 },
  messageBubble: { borderRadius: BorderRadius.lg, padding: Spacing.md, maxWidth: '90%' },
  bubbleUser: { backgroundColor: Colors.secondary, borderBottomRightRadius: 4 },
  bubbleAssistant: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
  messageText: { fontSize: FontSize.sm, lineHeight: 20 },
  messageTextUser: { color: Colors.white },
  messageTextAssistant: { color: Colors.text },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.sm },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  typingText: { fontSize: FontSize.sm, color: Colors.textMuted },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.sm,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  input: {
    flex: 1, maxHeight: 100, fontSize: FontSize.base, color: Colors.text,
    backgroundColor: Colors.background, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.border },
});
