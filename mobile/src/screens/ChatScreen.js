import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import { fetchChatMessages, sendChatMessageApi } from "../lib/api";
import { theme } from "../theme";

export default function ChatScreen() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch messages strictly for the active channel when channel changes
  const loadChannelMessages = async (channel) => {
    setLoading(true);
    const data = await fetchChatMessages(channel);
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadChannelMessages(activeChannel);
  }, [activeChannel]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    setInput("");

    // Optimistic UI update for current channel
    const localMsg = {
      id: `m_${Date.now()}`,
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      text: messageText,
      time: "Just now",
      channel: activeChannel,
    };

    setMessages((prev) => [...prev, localMsg]);

    // Send to MongoDB Backend API
    await sendChatMessageApi({
      sender: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      text: messageText,
      channel: activeChannel,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>10,000+ Designers</Text>
          <Text style={styles.title}>Community Chat</Text>

          {/* CHANNELS SELECTOR */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.channelsRow}>
            {["general", "design", "engineering", "showcase"].map((channel) => (
              <TouchableOpacity
                key={channel}
                activeOpacity={0.7}
                onPress={() => setActiveChannel(channel)}
                style={[
                  styles.channelBadge,
                  activeChannel === channel && styles.channelBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.channelText,
                    activeChannel === channel && styles.channelTextActive,
                  ]}
                >
                  #{channel}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* MESSAGES LIST ISOLATED BY CHANNEL */}
        <ScrollView
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isMe = msg.sender === "You";
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isMe ? styles.messageRowMe : styles.messageRowOther,
                ]}
              >
                {!isMe && (
                  <Image source={{ uri: msg.avatar }} style={styles.avatar} />
                )}

                <View style={{ flex: 1 }}>
                  {!isMe && (
                    <View style={styles.senderHeader}>
                      <Text style={styles.senderName}>{msg.sender}</Text>
                      <Text style={styles.messageTime}>{msg.time}</Text>
                    </View>
                  )}

                  <GlassCard
                    elevated={isMe}
                    style={[
                      styles.messageBubble,
                      isMe ? styles.bubbleMe : styles.bubbleOther,
                    ]}
                  >
                    <Text style={[styles.messageText, isMe && styles.textMe]}>
                      {msg.text}
                    </Text>
                  </GlassCard>

                  {isMe && (
                    <Text style={[styles.messageTime, styles.timeMe]}>
                      {msg.time}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* INPUT BAR */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={`Message #${activeChannel}...`}
            placeholderTextColor={theme.colors.subtle}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSend}
            style={styles.sendButton}
          >
            <Ionicons name="send" size={18} color="#000000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing(2.5),
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  title: {
    ...theme.font.h1,
    fontSize: 24,
    marginBottom: theme.spacing(1.5),
  },
  channelsRow: {
    flexDirection: "row",
  },
  channelBadge: {
    paddingHorizontal: theme.spacing(1.8),
    paddingVertical: theme.spacing(0.8),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing(1),
  },
  channelBadgeActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: theme.colors.primary,
  },
  channelText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  channelTextActive: {
    color: theme.colors.primary,
  },
  messagesList: {
    paddingHorizontal: theme.spacing(2.5),
    paddingBottom: theme.spacing(2),
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: theme.spacing(1),
  },
  messageRowMe: {
    justifyContent: "flex-end",
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing(1.5),
    marginTop: 4,
  },
  senderHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.foreground,
    marginRight: theme.spacing(1),
  },
  messageTime: {
    fontSize: 11,
    color: theme.colors.subtle,
  },
  timeMe: {
    textAlign: "right",
    marginTop: 2,
    marginRight: 4,
  },
  messageBubble: {
    padding: theme.spacing(1.8),
    maxWidth: "85%",
  },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.indigo,
    borderColor: theme.colors.indigo,
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.card,
  },
  messageText: {
    fontSize: 14,
    color: theme.colors.foreground,
    lineHeight: 20,
  },
  textMe: {
    color: "#ffffff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(2),
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.2),
    color: theme.colors.foreground,
    fontSize: 14,
    marginRight: theme.spacing(1.5),
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.glow,
  },
});
