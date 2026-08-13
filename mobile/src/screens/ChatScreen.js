import React, { useState } from "react";
import {
  Image,
  Modal,
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
import CustomButton from "../components/CustomButton";
import { darkColors, lightColors, theme, useThemeMode } from "../theme";

const AVAILABLE_MEMBERS = [
  { id: "m1", name: "Erik Solberg", role: "Lead Architect", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" },
  { id: "m2", name: "Astrid Lind", role: "DevOps Engineer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120" },
  { id: "m3", name: "Sarah Chen", role: "Frontend Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
  { id: "m4", name: "Marcus Thorne", role: "Backend Engineer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120" },
];

const INITIAL_GROUPS_DATA = [
  { id: "g1", name: "Rust Systems", members: "862 Members", icon: "hardware-chip-outline", desc: "Low-level optimization, memory safety enthusiasts, and WASM builders.", joined: false },
  { id: "g2", name: "Go Collective", members: "1.2k Members", icon: "cube-outline", desc: "Cloud-native development, microservices, and distributed systems architecture.", joined: false },
  { id: "g3", name: "AI Ethics Node", members: "540 Members", icon: "flask-outline", desc: "Discussion and building of responsible AI, model transparency, and safety protocols.", joined: false },
];

const INITIAL_DISCUSSIONS = [
  {
    id: "d1",
    title: "State management in Next.js 14: Is Jotai the new standard?",
    tag: "Started in #frontend",
    repliesCount: 24,
    time: "12 mins ago",
    author: "Alex Chen",
    icon: "chatbox-ellipses-outline",
    replies: [
      { id: "r1", author: "Sarah Chen", text: "Jotai's atomic state works wonders with Next.js App Router server components!", time: "10 mins ago" },
      { id: "r2", author: "Erik Solberg", text: "Agreed, much less boilerplate compared to Redux Toolkit.", time: "5 mins ago" },
    ],
  },
  {
    id: "d2",
    title: "Building a Rust-based DB engine: Seeking contributors.",
    tag: "Started in #rustsystems",
    repliesCount: 8,
    time: "1 hour ago",
    author: "Marcus Thorne",
    icon: "rocket-outline",
    replies: [
      { id: "r3", author: "Astrid Lind", text: "I can contribute to the LSM tree storage engine!", time: "45 mins ago" },
    ],
  },
];

const INITIAL_DIRECT_MESSAGES = [
  { id: "dm1", name: "Sarah Chen", time: "NOW", text: "The refactor for the auth module is live!", online: true, selected: true, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120", isGroup: false },
  { id: "dm2", name: "Marcus Thorne", time: "12M", text: "Did you check the PR #442?", online: false, selected: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120", isGroup: false },
  { id: "dm3", name: "Elena Rodriguez", time: "2H", text: "The new design tokens are looking great.", online: true, selected: false, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120", isGroup: false },
];

export default function ChatScreen({ route, navigation }) {
  const { isDarkMode, themeColors } = useThemeMode();
  const colors = themeColors || (isDarkMode ? darkColors : lightColors);

  const [activeTab, setActiveTab] = useState("chats");
  const [directMessages, setDirectMessages] = useState(INITIAL_DIRECT_MESSAGES);
  const [groups, setGroups] = useState(INITIAL_GROUPS_DATA);
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);

  // ACTIVE CHAT SCREEN MODAL STATE
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const [chatInputText, setChatInputText] = useState("");

  // TRENDING CONVERSATIONS FORUM MODAL STATE
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [forumReplyInput, setForumReplyInput] = useState("");
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadTag, setNewThreadTag] = useState("#general");

  // START & MANAGE GROUP MODAL STATE (CREATE / UPDATE / DELETE)
  const [showStartGroupModal, setShowStartGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState(["m1", "m3"]);
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");

  const handleOpenChat = (dm) => {
    setActiveChatRoom(dm);
    setRoomMessages([
      { id: "m1", sender: dm.name, text: dm.text || "Hello team!", time: dm.time || "NOW", isMe: false },
      { id: "m2", sender: "You", text: "Hey! Ready to collaborate.", time: "Just now", isMe: true },
    ]);
  };

  const handleSendChatMessage = () => {
    if (!chatInputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: "You",
      text: chatInputText.trim(),
      time: "Just now",
      isMe: true,
    };
    setRoomMessages((prev) => [...prev, newMsg]);
    setChatInputText("");
  };

  // CREATE NEW GROUP & ADD TO MESSAGES LIST
  const handleCreateGroupSubmit = () => {
    if (!newGroupName.trim()) return;

    const chosenMembers = AVAILABLE_MEMBERS.filter((m) =>
      selectedGroupMembers.includes(m.id)
    );

    const groupChatId = `group_${Date.now()}`;
    const newGroupObj = {
      id: groupChatId,
      name: `${newGroupName.trim()} Group`,
      time: "NOW",
      text: `Group created with ${chosenMembers.length + 1} members`,
      online: true,
      selected: false,
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120",
      isGroup: true,
      members: chosenMembers,
    };

    setDirectMessages((prev) => [newGroupObj, ...prev]);
    setNewGroupName("");
    setNewGroupDesc("");
    setShowStartGroupModal(false);

    // Open chat automatically
    handleOpenChat(newGroupObj);
  };

  // UPDATE GROUP NAME
  const handleUpdateGroupSubmit = () => {
    if (!editGroupName.trim() || !activeChatRoom) return;
    const updatedName = editGroupName.trim();
    setDirectMessages((prev) =>
      prev.map((dm) => (dm.id === activeChatRoom.id ? { ...dm, name: updatedName } : dm))
    );
    setActiveChatRoom((prev) => ({ ...prev, name: updatedName }));
    setShowGroupSettingsModal(false);
  };

  // DELETE GROUP CHAT
  const handleDeleteGroupChat = () => {
    if (!activeChatRoom) return;
    const targetId = activeChatRoom.id;
    setDirectMessages((prev) => prev.filter((dm) => dm.id !== targetId));
    setShowGroupSettingsModal(false);
    setActiveChatRoom(null);
  };

  const toggleGroupMemberSelection = (id) => {
    setSelectedGroupMembers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleJoinGroup = (group) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, joined: !g.joined } : g))
    );

    if (!group.joined) {
      const newGroupChat = {
        id: group.id,
        name: `${group.name} Group`,
        time: "NOW",
        text: `Welcome to ${group.name} group chat!`,
        online: true,
        selected: false,
        avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120",
        isGroup: true,
      };

      setDirectMessages((prev) => [newGroupChat, ...prev]);
      setActiveTab("chats");
      handleOpenChat(newGroupChat);
    }
  };

  const handlePostForumReply = () => {
    if (!forumReplyInput.trim() || !selectedDiscussion) return;
    const newReply = {
      id: `r_${Date.now()}`,
      author: "Elias Thorne (You)",
      text: forumReplyInput.trim(),
      time: "Just now",
    };

    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === selectedDiscussion.id
          ? {
              ...d,
              repliesCount: d.repliesCount + 1,
              replies: [...d.replies, newReply],
            }
          : d
      )
    );

    setSelectedDiscussion((prev) => ({
      ...prev,
      repliesCount: prev.repliesCount + 1,
      replies: [...prev.replies, newReply],
    }));

    setForumReplyInput("");
  };

  const handleCreateNewThread = () => {
    if (!newThreadTitle.trim()) return;
    const newDisc = {
      id: `d_${Date.now()}`,
      title: newThreadTitle.trim(),
      tag: `Started in ${newThreadTag}`,
      repliesCount: 0,
      time: "Just now",
      author: "Elias Thorne (You)",
      icon: "chatbox-ellipses-outline",
      replies: [],
    };
    setDiscussions((prev) => [newDisc, ...prev]);
    setNewThreadTitle("");
    setShowNewThreadModal(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* BRAND HEADER & TOP NAV */}
        <View style={styles.headerRow}>
          <Text style={[styles.brandTitle, { color: colors.foreground }]}>BuildVerse</Text>
          <View style={styles.headerRightRow}>
            <TouchableOpacity style={[styles.iconHeaderBtn, { backgroundColor: colors.elevated }]}>
              <Ionicons name="search" size={18} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarHeaderBtn} onPress={() => navigation.navigate("ProfileTab")}>
              <Image source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" }} style={styles.avatarHeaderImg} />
            </TouchableOpacity>
          </View>
        </View>

        {/* TAB TOGGLE */}
        <View style={[styles.tabToggleBox, { backgroundColor: colors.elevated, marginBottom: 16 }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("chats")}
            style={[styles.toggleBtn, activeTab === "chats" && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.toggleText, { color: colors.muted }, activeTab === "chats" && { color: isDarkMode ? "#000" : "#FFF" }]}>Messages & Chats ({directMessages.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("hub")}
            style={[styles.toggleBtn, activeTab === "hub" && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.toggleText, { color: colors.muted }, activeTab === "hub" && { color: isDarkMode ? "#000" : "#FFF" }]}>Groups & Hub</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "chats" ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* MESSAGES LIST CARD MATCHING IMAGE 1 */}
            <GlassCard elevated style={styles.messagesListCard}>
              <View style={styles.messagesHeaderRow}>
                <Text style={[styles.messagesHeading, { color: colors.foreground }]}>Messages & Groups</Text>
                <TouchableOpacity
                  style={[styles.editPillBtn, { backgroundColor: colors.primary }]}
                  onPress={() => setShowStartGroupModal(true)}
                >
                  <Ionicons name="add" size={16} color={isDarkMode ? "#000" : "#FFF"} />
                </TouchableOpacity>
              </View>

              {directMessages.map((dm) => (
                <TouchableOpacity
                  key={dm.id}
                  activeOpacity={0.7}
                  onPress={() => handleOpenChat(dm)}
                  style={[
                    styles.dmRowItem,
                    dm.selected && { backgroundColor: colors.elevated, borderLeftWidth: 4, borderLeftColor: colors.foreground },
                  ]}
                >
                  <View style={styles.dmAvatarWrapper}>
                    <Image source={{ uri: dm.avatar }} style={styles.dmAvatarImg} />
                    {dm.online && <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.dmNameRow}>
                      <Text style={[styles.dmNameText, { color: colors.foreground }]}>{dm.name}</Text>
                      <Text style={[styles.dmTimeText, { color: colors.subtle }]}>{dm.time}</Text>
                    </View>
                    <Text style={[styles.dmSnippetText, { color: colors.muted }]} numberOfLines={1}>{dm.text}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.subtle} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              ))}
            </GlassCard>
          </ScrollView>
        ) : (
          /* COMMUNITY HUB */
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* HERO SECTION */}
            <View style={styles.heroBox}>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>Engineers are better, together.</Text>
              <Text style={[styles.heroSub, { color: colors.muted }]}>
                Connect with local chapters, technology-specific squads, and global open-source collectives.
              </Text>
              <CustomButton
                title="+ Start a Group"
                variant="primary"
                size="md"
                style={{ alignSelf: "flex-start", marginTop: 12 }}
                onPress={() => setShowStartGroupModal(true)}
              />
            </View>

            {/* SQUAD CARDS */}
            {groups.map((group) => (
              <GlassCard key={group.id} elevated style={styles.groupCard}>
                <View style={styles.groupHeaderRow}>
                  <View style={[styles.groupIconBox, { backgroundColor: colors.elevated }]}>
                    <Ionicons name={group.icon} size={20} color={colors.foreground} />
                  </View>
                  <CustomButton
                    title={group.joined ? "Joined ✓" : "Join"}
                    variant={group.joined ? "outline" : "primary"}
                    size="sm"
                    onPress={() => handleJoinGroup(group)}
                  />
                </View>
                <Text style={[styles.groupName, { color: colors.foreground }]}>{group.name}</Text>
                <Text style={[styles.groupDesc, { color: colors.muted }]}>{group.desc}</Text>
              </GlassCard>
            ))}

            {/* TRENDING CONVERSATIONS */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Trending Conversations</Text>
              <TouchableOpacity onPress={() => setShowNewThreadModal(true)}>
                <Text style={[styles.viewForumText, { color: colors.amber }]}>+ New Topic</Text>
              </TouchableOpacity>
            </View>

            {discussions.map((disc) => (
              <TouchableOpacity
                key={disc.id}
                activeOpacity={0.7}
                onPress={() => setSelectedDiscussion(disc)}
              >
                <GlassCard elevated style={styles.discCard}>
                  <View style={styles.discHeaderRow}>
                    <View style={[styles.discIconBox, { backgroundColor: colors.elevated }]}>
                      <Ionicons name={disc.icon} size={18} color={colors.foreground} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.discTitle, { color: colors.foreground }]}>{disc.title}</Text>
                      <Text style={[styles.discTag, { color: colors.subtle }]}>{disc.tag} • By {disc.author}</Text>
                      <Text style={[styles.discReplies, { color: colors.amber }]}>{disc.repliesCount} replies • {disc.time} ›</Text>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* FULL ACTIVE CHAT ROOM MODAL (OPENS ON MESSAGES LIST CLICK) */}
      <Modal visible={!!activeChatRoom} transparent animationType="slide">
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: colors.background }]}>
          <View style={[styles.chatModalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setActiveChatRoom(null)} style={{ padding: 4 }}>
              <Ionicons name="arrow-back" size={24} color={colors.foreground} />
            </TouchableOpacity>

            <Image source={{ uri: activeChatRoom?.avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginLeft: 8 }} />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.modalChatName, { color: colors.foreground }]}>{activeChatRoom?.name}</Text>
              <Text style={[styles.modalOnlineSub, { color: colors.success }]}>● Active Now • BuildVerse Encrypted</Text>
            </View>

            {activeChatRoom?.isGroup && (
              <TouchableOpacity
                onPress={() => {
                  setEditGroupName(activeChatRoom.name);
                  setShowGroupSettingsModal(true);
                }}
                style={{ padding: 6 }}
              >
                <Ionicons name="settings-outline" size={20} color={colors.foreground} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            <View style={{ alignItems: "center", marginVertical: 12 }}>
              <View style={[styles.dateBadge, { backgroundColor: colors.elevated }]}>
                <Text style={[styles.dateText, { color: colors.muted }]}>TODAY</Text>
              </View>
            </View>

            {roomMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.msgBubble,
                  msg.isMe
                    ? { backgroundColor: colors.primary, alignSelf: "flex-end" }
                    : { backgroundColor: colors.elevated, alignSelf: "flex-start" },
                ]}
              >
                {!msg.isMe && (
                  <Text style={{ fontSize: 10, fontWeight: "700", color: colors.amber, marginBottom: 2 }}>
                    {msg.sender}
                  </Text>
                )}
                <Text style={[styles.msgText, { color: msg.isMe ? (isDarkMode ? "#000" : "#FFF") : colors.foreground }]}>
                  {msg.text}
                </Text>
                <Text style={{ fontSize: 9, color: msg.isMe ? (isDarkMode ? "#444" : "#DDD") : colors.subtle, alignSelf: "flex-end", marginTop: 4 }}>
                  {msg.time}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* CHAT INPUT BAR */}
          <View style={[styles.chatInputBarModal, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.chatTextInputModal, { backgroundColor: colors.elevated, color: colors.foreground }]}
              placeholder={`Message ${activeChatRoom?.name}...`}
              placeholderTextColor={colors.subtle}
              value={chatInputText}
              onChangeText={setChatInputText}
            />
            <TouchableOpacity onPress={handleSendChatMessage} style={[styles.sendBtnModal, { backgroundColor: colors.primary }]}>
              <Ionicons name="send" size={16} color={isDarkMode ? "#000" : "#FFF"} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* MANAGE / DELETE GROUP CHAT MODAL */}
      <Modal visible={showGroupSettingsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Group Chat Settings</Text>
              <TouchableOpacity onPress={() => setShowGroupSettingsModal(false)}>
                <Ionicons name="close" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.muted }]}>Group Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
              value={editGroupName}
              onChangeText={setEditGroupName}
            />

            <CustomButton
              title="Save Group Changes"
              variant="primary"
              size="md"
              style={{ marginBottom: 12 }}
              onPress={handleUpdateGroupSubmit}
            />

            <CustomButton
              title="Delete Group Chat"
              variant="outline"
              size="md"
              style={{ borderColor: colors.danger }}
              textStyle={{ color: colors.danger }}
              icon={<Ionicons name="trash-outline" size={16} color={colors.danger} />}
              onPress={handleDeleteGroupChat}
            />
          </GlassCard>
        </View>
      </Modal>

      {/* START NEW GROUP MODAL WITH MEMBER SELECTION */}
      <Modal visible={showStartGroupModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.createGroupModalCard, { backgroundColor: colors.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>Create Group Chat</Text>
                <TouchableOpacity onPress={() => setShowStartGroupModal(false)}>
                  <Ionicons name="close" size={24} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.inputLabel, { color: colors.muted }]}>Group Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
                placeholder="e.g. Frontend Squad"
                placeholderTextColor={colors.subtle}
                value={newGroupName}
                onChangeText={setNewGroupName}
              />

              <Text style={[styles.inputLabel, { color: colors.muted }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Describe group chat purpose..."
                placeholderTextColor={colors.subtle}
                multiline
                numberOfLines={2}
                value={newGroupDesc}
                onChangeText={setNewGroupDesc}
              />

              <Text style={[styles.subHeading, { color: colors.foreground, marginTop: 8, marginBottom: 8 }]}>
                Select Group Members to Add:
              </Text>
              {AVAILABLE_MEMBERS.map((m) => {
                const isSelected = selectedGroupMembers.includes(m.id);
                return (
                  <TouchableOpacity
                    key={m.id}
                    activeOpacity={0.7}
                    onPress={() => toggleGroupMemberSelection(m.id)}
                    style={[styles.memberSelectRow, isSelected && { backgroundColor: colors.elevated }]}
                  >
                    <View style={[styles.checkbox, isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color={isDarkMode ? "#000" : "#FFF"} />}
                    </View>
                    <Image source={{ uri: m.avatar }} style={{ width: 28, height: 28, borderRadius: 14, marginLeft: 8 }} />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={[styles.memberNameText, { color: colors.foreground }]}>{m.name}</Text>
                      <Text style={[styles.memberRoleText, { color: colors.muted }]}>{m.role}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.modalActions}>
                <CustomButton title="Cancel" variant="outline" size="md" onPress={() => setShowStartGroupModal(false)} />
                <CustomButton title="Create Group Chat" variant="primary" size="md" style={{ marginLeft: 12 }} onPress={handleCreateGroupSubmit} />
              </View>
            </ScrollView>
          </GlassCard>
        </View>
      </Modal>

      {/* TRENDING FORUM DISCUSSION DETAIL MODAL */}
      <Modal visible={!!selectedDiscussion} transparent animationType="slide">
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: colors.background }]}>
          <View style={[styles.chatModalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setSelectedDiscussion(null)} style={{ padding: 4 }}>
              <Ionicons name="arrow-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.modalChatName, { color: colors.foreground }]} numberOfLines={1}>
                {selectedDiscussion?.title}
              </Text>
              <Text style={[styles.modalOnlineSub, { color: colors.muted }]}>
                {selectedDiscussion?.tag} • {selectedDiscussion?.repliesCount} Replies
              </Text>
            </View>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            <GlassCard elevated style={{ padding: 16, marginBottom: 16 }}>
              <Text style={[styles.discTitle, { color: colors.foreground, fontSize: 18 }]}>{selectedDiscussion?.title}</Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>Posted by {selectedDiscussion?.author} • {selectedDiscussion?.time}</Text>
            </GlassCard>

            <Text style={[styles.subHeading, { color: colors.foreground, marginBottom: 12 }]}>Community Discussion Replies ({selectedDiscussion?.replies.length})</Text>

            {selectedDiscussion?.replies.map((r) => (
              <GlassCard key={r.id} style={{ padding: 12, marginBottom: 8, backgroundColor: colors.card }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.foreground }}>{r.author}</Text>
                  <Text style={{ fontSize: 10, color: colors.subtle }}>{r.time}</Text>
                </View>
                <Text style={{ fontSize: 13, color: colors.muted }}>{r.text}</Text>
              </GlassCard>
            ))}
          </ScrollView>

          <View style={[styles.chatInputBarModal, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.chatTextInputModal, { backgroundColor: colors.elevated, color: colors.foreground }]}
              placeholder="Write a reply in this discussion..."
              placeholderTextColor={colors.subtle}
              value={forumReplyInput}
              onChangeText={setForumReplyInput}
            />
            <TouchableOpacity onPress={handlePostForumReply} style={[styles.sendBtnModal, { backgroundColor: colors.primary }]}>
              <Ionicons name="send" size={16} color={isDarkMode ? "#000" : "#FFF"} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* CREATE NEW THREAD MODAL */}
      <Modal visible={showNewThreadModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard elevated style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Start New Discussion Topic</Text>
              <TouchableOpacity onPress={() => setShowNewThreadModal(false)}>
                <Ionicons name="close" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.muted }]}>Topic Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.elevated, borderColor: colors.border, color: colors.foreground }]}
              placeholder="e.g. Best practices for WASM in 2026"
              placeholderTextColor={colors.subtle}
              value={newThreadTitle}
              onChangeText={setNewThreadTitle}
            />

            <View style={styles.modalActions}>
              <CustomButton title="Cancel" variant="outline" size="md" onPress={() => setShowNewThreadModal(false)} />
              <CustomButton title="Post Topic" variant="primary" size="md" style={{ marginLeft: 12 }} onPress={handleCreateNewThread} />
            </View>
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 16 },
  brandTitle: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  headerRightRow: { flexDirection: "row", alignItems: "center" },
  iconHeaderBtn: { padding: 6, borderRadius: 9999, marginRight: 8 },
  avatarHeaderBtn: { width: 28, height: 28, borderRadius: 14, overflow: "hidden" },
  avatarHeaderImg: { width: "100%", height: "100%" },
  tabToggleBox: { flexDirection: "row", borderRadius: 9999, padding: 3 },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 9999, alignItems: "center" },
  toggleText: { fontSize: 12, fontWeight: "600" },
  scrollContent: { paddingBottom: 48 },
  messagesListCard: { padding: 16, marginBottom: 20 },
  messagesHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  messagesHeading: { fontSize: 20, fontWeight: "800" },
  editPillBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dmRowItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, marginBottom: 6 },
  dmAvatarWrapper: { position: "relative" },
  dmAvatarImg: { width: 44, height: 44, borderRadius: 22 },
  onlineDot: { position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: "#FFFFFF" },
  dmNameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dmNameText: { fontSize: 15, fontWeight: "700" },
  dmTimeText: { fontSize: 10 },
  dmSnippetText: { fontSize: 13, marginTop: 2 },
  heroBox: { marginBottom: 20 },
  heroTitle: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 6 },
  heroSub: { fontSize: 14, lineHeight: 20 },
  groupCard: { padding: 16, marginBottom: 12 },
  groupHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  groupIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  groupName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  groupDesc: { fontSize: 12, lineHeight: 16 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "800" },
  viewForumText: { fontSize: 12, fontWeight: "600" },
  discCard: { padding: 14, marginBottom: 8 },
  discHeaderRow: { flexDirection: "row", alignItems: "flex-start" },
  discIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  discTitle: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  discTag: { fontSize: 11, marginBottom: 2 },
  discReplies: { fontSize: 11 },
  modalSafeArea: { flex: 1 },
  chatModalHeader: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1 },
  modalChatName: { fontSize: 16, fontWeight: "800" },
  modalOnlineSub: { fontSize: 11, marginTop: 1 },
  subHeading: { fontSize: 14, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.75)", justifyContent: "center", padding: 20 },
  modalContent: { padding: 24 },
  createGroupModalCard: { padding: 20, maxHeight: "85%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: "800" },
  inputLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, marginBottom: 12 },
  textArea: { height: 60, textAlignVertical: "top" },
  memberSelectRow: { flexDirection: "row", alignItems: "center", padding: 8, borderRadius: 10, marginBottom: 4 },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  memberNameText: { fontSize: 13, fontWeight: "700" },
  memberRoleText: { fontSize: 11 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  chatInputBarModal: { flexDirection: "row", alignItems: "center", padding: 12, borderTopWidth: 1 },
  chatTextInputModal: { flex: 1, borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, marginRight: 8 },
  sendBtnModal: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  msgBubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, marginBottom: 8, maxWidth: "80%" },
  msgText: { fontSize: 14 },
  dateBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  dateText: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
});
