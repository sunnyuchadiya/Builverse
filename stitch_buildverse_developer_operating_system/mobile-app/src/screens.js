import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader, BottomTabs, Card, CardRow, Divider, Pill, PrimaryButton, RowLink, Screen, SecondaryButton, SectionTitle, StatCard, Avatar } from './components';
import {
  activeProjects,
  chatThreads,
  conversations,
  dashboardStats,
  featuredCommunities,
  issueItems,
  mainTabs,
  milestones,
  profileProjects,
  projectCards,
  trendingTags,
  teamMembers,
} from './data';
import { COLORS, RADIUS, SPACING, SHADOW } from './theme';

const remoteAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9H8Q2xk0l4u8vQ1uWqFJ3p7pXb4D8gQ9gQbL1uQ7Q9gQbL1uQ7Q9gQbL1uQ7Q9gQbL1uQ7Q9gQbL1uQ7Q9gQbL1uQ7Q9gQbL1uQ7Q9gQbL1uQ7Q9gQbL1uQ7Q';

function ProfileMini({ name = 'BuildVerse Member', title = 'Senior Systems Architect • Stockholm, SE' }) {
  return (
    <View style={styles.profileMini}>
      <Avatar uri={remoteAvatar} size={56} />
      <View style={{ flex: 1 }}>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileTitle}>{title}</Text>
      </View>
    </View>
  );
}

function AuthBackground() {
  return <View pointerEvents="none" style={styles.authGlow} />;
}

function AuthFooter({ navigation, submitLabel, onSubmit, secondaryLabel, secondaryTo }) {
  return (
    <View style={{ gap: 12 }}>
      <PrimaryButton label={submitLabel} onPress={onSubmit} icon="arrow-forward" />
      <View style={styles.authFooterRow}>
        <Text style={styles.authMuted}>Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate(secondaryTo)}>
          <Text style={styles.authLink}>{secondaryLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function LoginScreen({ navigation }) {
  return (
    <Screen scroll={false}>
      <AuthBackground />
      <View style={styles.authCenter}>
        <View style={styles.authCardWrap}>
          <View style={styles.authHero}>
            <Text style={styles.authBrand}>BuildVerse</Text>
            <Text style={styles.authTagline}>Architecting the future of development.</Text>
          </View>

          <Card style={styles.authCard}>
            <Text style={styles.authHeading}>Welcome back</Text>

            <View style={styles.socialStack}>
              <SecondaryButton label="Continue with Google" icon="google" onPress={() => navigation.navigate('Main')} />
              <SecondaryButton label="Continue with GitHub" icon="code" onPress={() => navigation.navigate('Main')} />
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.formStack}>
              <View>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput placeholder="name@company.com" placeholderTextColor={COLORS.tertiaryText} style={styles.input} />
              </View>
              <View>
                <View style={styles.inputLabelRow}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <Pressable>
                    <Text style={styles.smallLink}>Forgot?</Text>
                  </Pressable>
                </View>
                <TextInput placeholder="••••••••" placeholderTextColor={COLORS.tertiaryText} secureTextEntry style={styles.input} />
              </View>
              <PrimaryButton label="Sign in to Workspace" onPress={() => navigation.navigate('Main')} />
            </View>

            <View style={styles.authBottomRow}>
              <Text style={styles.authMuted}>New to the universe?</Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.authLink}>Create an account</Text>
              </Pressable>
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}

export function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(['Frontend', 'Backend']);

  const toggleInterest = (label) => {
    setSelected((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));
  };

  return (
    <Screen scroll={false}>
      <AuthBackground />
      <View style={styles.authCenter}>
        <View style={styles.authCardWrap}>
          <View style={styles.authHero}>
            <Text style={styles.authBrand}>BuildVerse</Text>
            <Text style={styles.authTagline}>The architecture of your developer journey begins here.</Text>
          </View>

          <Card style={styles.authCard}>
            <View style={styles.progressRow}>
              <View style={[styles.progressBar, styles.progressActive]} />
              <View style={[styles.progressBar, step === 2 && styles.progressActive]} />
            </View>

            {step === 1 ? (
              <View style={{ gap: 18 }}>
                <View>
                  <Text style={styles.authHeading}>Create your identity</Text>
                  <Text style={styles.authStep}>Step 1 of 2</Text>
                </View>

                <View style={styles.formStack}>
                  <View>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput placeholder="John Doe" placeholderTextColor={COLORS.tertiaryText} style={styles.input} />
                  </View>
                  <View>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput placeholder="john@company.com" placeholderTextColor={COLORS.tertiaryText} style={styles.input} />
                  </View>
                  <View>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput placeholder="Min. 8 characters" placeholderTextColor={COLORS.tertiaryText} secureTextEntry style={styles.input} />
                  </View>
                </View>

                <PrimaryButton label="Continue" onPress={() => setStep(2)} icon="arrow-forward" />
              </View>
            ) : (
              <View style={{ gap: 18 }}>
                <View>
                  <Text style={styles.authHeading}>Primary Interests</Text>
                  <Text style={styles.authStep}>Tailor your workspace experience</Text>
                </View>

                <View style={styles.chipsGrid}>
                  {['Frontend', 'Backend', 'Mobile', 'Data Science', 'Security', 'DevOps'].map((item) => {
                    const isActive = selected.includes(item);

                    return (
                      <Pressable key={item} onPress={() => toggleInterest(item)} style={[styles.interestChip, isActive && styles.interestChipActive]}>
                        <MaterialIcons name={interestIcon(item)} size={18} color={isActive ? COLORS.surface : COLORS.primary} />
                        <Text style={[styles.interestText, isActive && styles.interestTextActive]}>{item}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.authButtonRow}>
                  <SecondaryButton label="Back" onPress={() => setStep(1)} style={{ flex: 1 }} />
                  <PrimaryButton label="Join BuildVerse" onPress={() => navigation.navigate('Main')} style={{ flex: 2 }} />
                </View>
              </View>
            )}
          </Card>

          <View style={styles.authBottomRowCenter}>
            <Text style={styles.authMuted}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.authLink}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}

export function ProjectDashboardScreen({ navigation }) {
  return (
    <Screen>
      <AppHeader title="Welcome back, Developer" subtitle="You have 3 shipping goals today. Let's build something remarkable." />

      <View style={styles.sectionGap}>
        <SectionTitle title="Active Projects" action="View All" onAction={() => navigation.navigate('Projects')} />
        <View style={styles.horizontalCardRow}>
          {activeProjects.map((project) => (
            <Pressable key={project.id} onPress={() => navigation.navigate('ProjectDetails', { projectId: project.id })} style={styles.projectMiniCard}>
              <View style={styles.projectMiniTop}>
                <View style={styles.projectMiniIcon}>
                  <MaterialIcons name={project.icon} size={20} color={COLORS.surface} />
                </View>
                <View style={styles.tagPill}><Text style={styles.tagText}>{project.tag}</Text></View>
              </View>
              <Text style={styles.projectTitle}>{project.name}</Text>
              <Text style={styles.projectSubtitle}>{project.subtitle}</Text>
              {project.progress ? (
                <View style={styles.progressBlock}>
                  <View style={styles.progressMetaRow}>
                    <Text style={styles.progressMeta}>Progress</Text>
                    <Text style={styles.progressMetaStrong}>{project.progress}%</Text>
                  </View>
                  <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${project.progress}%` }]} /></View>
                </View>
              ) : (
                <View style={styles.taskNoteRow}>
                  <MaterialIcons name="notification-important" size={18} color={COLORS.amber} />
                  <Text style={styles.taskNote}>{project.tasks}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.sectionGap}>
        <View style={styles.statsGrid}>
          {dashboardStats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </View>
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Recent Activity" />
        <Card>
          <RowLink icon="git-branch" title="Sarah pushed 4 commits to main" subtitle="2 HOURS AGO" />
          <Divider />
          <RowLink icon="error" title="Alex opened a new issue: Auth redirect loop..." subtitle="5 HOURS AGO" />
          <Divider />
          <RowLink icon="event" title="New event in 'React Delhi' community" subtitle="YESTERDAY" />
        </Card>
      </View>

      <BottomTabs items={mainTabs} active="Home" onChange={(name) => navigation.navigate(name)} />
    </Screen>
  );
}

export function ProjectsScreen({ navigation }) {
  return (
    <Screen>
      <AppHeader title="Discover the future" subtitle="Browse the most innovative technical projects and connect with world-class engineering teams." />

      <View style={styles.sectionGap}>
        <TextInput placeholder="Search Projects (e.g., Rust engines, AI agents...)" placeholderTextColor={COLORS.tertiaryText} style={styles.searchInput} />
        <FlatList
          horizontal
          data={['All Tech', 'Rust', 'Next.js', 'AI & ML', 'Web3', 'Go']}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 24 }}
          renderItem={({ item, index }) => <Pill label={item} active={index === 0} />}
        />
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Your Teams" action="Manage Teams" />
        <View style={styles.teamsGrid}>
          <Card style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <View style={styles.teamIcon}><MaterialIcons name="terminal" size={20} color={COLORS.surface} /></View>
              <View style={styles.teamStatus}><Text style={styles.teamStatusText}>Active</Text></View>
            </View>
            <Text style={styles.projectTitle}>Core Architecture</Text>
            <Text style={styles.projectSubtitle}>Refining the build system for BuildVerse v2.0.</Text>
            <View style={styles.memberRow}><Text style={styles.memberCount}>6 Members</Text></View>
          </Card>

          <Card style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <View style={[styles.teamIcon, { backgroundColor: COLORS.amber }]}><MaterialIcons name="auto-awesome" size={20} color={COLORS.onSurface} /></View>
              <View style={styles.teamStatus}><Text style={styles.teamStatusText}>Reviewing</Text></View>
            </View>
            <Text style={styles.projectTitle}>LLM Integration</Text>
            <Text style={styles.projectSubtitle}>Open-source wrapper for large language models.</Text>
            <View style={styles.memberRow}><Text style={styles.memberCount}>3 Members</Text></View>
          </Card>

          <Pressable style={styles.createTeamCard} onPress={() => Alert.alert('BuildVerse', 'Create New Team flow can be linked here.')}> 
            <View style={styles.createTeamCircle}><MaterialIcons name="add" size={20} color={COLORS.tertiaryText} /></View>
            <Text style={styles.createTeamText}>Create New Team</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Trending Projects" />
        <View style={styles.featuredGrid}>
          <Pressable onPress={() => navigation.navigate('ProjectDetails', { projectId: 'phoenix' })} style={styles.featuredProject}>
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfym3NTWkz280JAJtGWCqfmZHa2AsOBJKqUcAmBEwu3kxzHrp3_Z9bXBxrXMIbwvnoBjU9I54cI78Z7n18MbcujzNniVqdt9NLOyXUPsfpzlECYeCx-LPGPLBjqDFhQCq1GdnGxSPXXaPU1kIa9bcXERhH7eaITTKbsX03kzhRBmMQICIvtaLV15U75o7pEvevaz8qRIUMNQHhAI4MPSq4mvLAykHP0QTLsuY_XwhI2zj6x9eZ2JRzyD_L1pQw2d3MDBtrbPl2NQ' }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay} />
            <View style={styles.featuredCopy}>
              <View style={styles.featuredTags}><Text style={styles.featuredTag}>AI Framework</Text><Text style={styles.featuredTag}>Python</Text></View>
              <Text style={styles.featuredTitle}>NeuralCanvas OS</Text>
              <Text style={styles.featuredText}>The world's first open-source operating system designed specifically for running localized AI agents with zero latency and complete privacy.</Text>
              <PrimaryButton label="View Project" onPress={() => navigation.navigate('ProjectDetails', { projectId: 'phoenix' })} style={{ marginTop: 10 }} />
            </View>
          </Pressable>
          <View style={styles.featuredSideColumn}>
            <Card>
              <Text style={styles.projectTitle}>EtherDB</Text>
              <Text style={styles.projectSubtitle}>Decentralized, high-throughput vector database for edge nodes.</Text>
              <View style={styles.joinRow}><SecondaryButton label="Join" onPress={() => navigation.navigate('Groups')} style={{ flex: 1 }} /></View>
            </Card>
            <Card>
              <Text style={styles.projectTitle}>Titan Engine</Text>
              <Text style={styles.projectSubtitle}>A 3D rendering engine built entirely in Rust for performance.</Text>
              <View style={styles.joinRow}><SecondaryButton label="Join" onPress={() => navigation.navigate('Projects')} style={{ flex: 1 }} /></View>
            </Card>
          </View>
        </View>
      </View>

      <BottomTabs items={mainTabs} active="Projects" onChange={(name) => navigation.navigate(name)} />
    </Screen>
  );
}

export function ProjectDetailsScreen({ navigation, route }) {
  const projectId = route.params?.projectId || 'phoenix';
  const projectName = projectId === 'phoenix' ? 'Project Phoenix' : 'Project Phoenix';

  return (
    <Screen>
      <AppHeader title={projectName} subtitle="Next-generation serverless architecture for automated infrastructure provisioning." onBack={() => navigation.goBack()} />

      <View style={styles.sectionGap}>
        <View style={styles.detailActionRow}>
          <View style={styles.statusChip}><View style={styles.statusDot} /><Text style={styles.statusChipText}>In Development</Text></View>
          <View style={styles.detailButtons}><PrimaryButton label="Sync GitHub" onPress={() => Alert.alert('BuildVerse', 'Sync action can be wired to backend later.')} icon="sync" style={{ flex: 1 }} /><SecondaryButton label="Settings" onPress={() => Alert.alert('BuildVerse', 'Project settings screen can be added here.')} icon="settings" style={{ flex: 1 }} /></View>
        </View>
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Milestones" subtitle="74% Complete" />
        <Card>
          {milestones.map((item, index) => (
            <View key={item.id}>
              <View style={styles.milestoneRow}>
                <MaterialIcons name={item.icon} size={20} color={item.done ? COLORS.success : COLORS.amber} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.milestoneTitle, item.done && styles.milestoneDone]}>{item.key}</Text>
                  <Text style={styles.milestoneSubtitle}>{item.detail}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={styles.milestoneMeta}>{item.status}</Text>
                </View>
              </View>
              {index < milestones.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Team Members" />
        <Card>
          {teamMembers.map((member, index) => (
            <View key={member.name}>
              <View style={styles.memberLine}>
                <Avatar uri={remoteAvatar} size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
              {index < teamMembers.length - 1 ? <Divider /> : null}
            </View>
          ))}
          <Pressable style={styles.addMemberRow} onPress={() => navigation.navigate('Groups')}>
            <Text style={styles.addMemberText}>Add team member</Text>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.tertiaryText} />
          </Pressable>
        </Card>
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Recent Issues" action="View All Tracker" />
        <Card>
          {issueItems.map((issue, index) => (
            <View key={issue.title}>
              <View style={styles.issueRow}>
                <MaterialIcons name={issue.icon} size={20} color={issue.badge === 'Critical' ? COLORS.danger : issue.badge === 'Next Sprint' ? COLORS.warning : COLORS.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.issueTitle}>{issue.title}</Text>
                  <Text style={styles.issueMeta}>{issue.meta}</Text>
                </View>
                <View style={styles.issueBadge}><Text style={styles.issueBadgeText}>{issue.badge}</Text></View>
              </View>
              {index < issueItems.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

export function CommunityScreen({ navigation }) {
  return (
    <Screen>
      <AppHeader title="Engineers are better, together." subtitle="Connect with local chapters, technology-specific squads, and global open-source collectives." />

      <View style={styles.sectionGap}>
        <PrimaryButton label="Create a chapter" onPress={() => navigation.navigate('Projects')} icon="add" />
      </View>

      <View style={styles.sectionGap}>
        <TextInput placeholder="Search by tech stack, city, or name..." placeholderTextColor={COLORS.tertiaryText} style={styles.searchInput} />
        <FlatList
          horizontal
          data={trendingTags}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 24 }}
          renderItem={({ item }) => <Pill label={item} />}
        />
      </View>

      <View style={styles.sectionGap}>
        <Card style={styles.featuredChapter}>
          <View style={styles.featuredBanner}>
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCiMa3csaszCxGS9pH46f7kHzGHQ1vqQxniOOOgyqzulyX-LgdV4MDCTBbCFeCyDryPMRRQr-oIdp0msu0d-_e0Neaz_v-INUmNta20QqJEuCyy2KRCghOZMloKCQX_OT7bvXpXZBcScWL85V3AJmkat42rw0I_Tvvxsx92vg3TMMBBjfLYwkbrjhUmUqa_AsFIILyXfUle4_emb6iD5GHNxkufsaPkVzZX-iItjosCkFVyMz8DqrQVrsmSxbO1A8wX2n7EsjBvg' }} style={styles.featuredBannerImage} />
            <View style={styles.featuredOverlay} />
            <View style={styles.featuredCopy}>
              <View style={styles.chapterTag}><Text style={styles.chapterTagText}>Featured Chapter</Text></View>
              <Text style={styles.featuredTitle}>React Delhi</Text>
            </View>
          </View>
          <View style={styles.chapterStatsRow}>
            <StatCard label="Members" value="4.2k" style={styles.chapterStatCard} />
            <StatCard label="Active Projects" value="128" style={styles.chapterStatCard} />
            <StatCard label="Next Meetup" value="Oct 24" style={styles.chapterStatCard} />
          </View>
          <View style={styles.chapterFooter}>
            <SecondaryButton label="Join Chapter" onPress={() => navigation.navigate('Chat')} style={{ flex: 1 }} />
          </View>
        </Card>
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Trending Conversations" action="View More" onAction={() => navigation.navigate('Chat')} />
        {featuredCommunities.map((community) => (
          <Card key={community.id} style={styles.communityCard}>
            <View style={styles.communityTop}>
              <View style={styles.communityIcon}><MaterialIcons name={community.icon} size={22} color={COLORS.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.projectTitle}>{community.name}</Text>
                <Text style={styles.projectSubtitle}>{community.description}</Text>
              </View>
            </View>
            <View style={styles.communityFooterRow}>
              <Text style={styles.memberCount}>{community.members}</Text>
              <SecondaryButton label="Open" onPress={() => navigation.navigate('Chat')} style={styles.communityButton} />
            </View>
          </Card>
        ))}
      </View>

      <BottomTabs items={mainTabs} active="Groups" onChange={(name) => navigation.navigate(name)} />
    </Screen>
  );
}

export function ChatScreen({ navigation }) {
  const activeConversation = useMemo(() => chatThreads[0], []);

  return (
    <Screen scroll={false}>
      <AppHeader title="Messages" subtitle="BuildVerse chat" />

      <View style={styles.chatLayout}>
        <Card style={styles.threadList}>
          <View style={styles.threadHeader}>
            <Text style={styles.threadHeaderTitle}>Messages</Text>
            <Pressable style={styles.composeButton}><MaterialIcons name="edit" size={18} color={COLORS.surface} /></Pressable>
          </View>
          <View style={styles.threadScroll}>
            {chatThreads.map((thread) => (
              <CardRow
                key={thread.id}
                active={thread.active}
                icon="forum"
                title={thread.name}
                subtitle={thread.preview}
                meta={thread.time}
                onPress={() => Alert.alert('BuildVerse', `Open chat thread with ${thread.name}.`)}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.chatPanel}>
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderLeft}>
              <Avatar uri={remoteAvatar} size={40} />
              <View>
                <Text style={styles.chatName}>{activeConversation.name}</Text>
                <Text style={styles.chatStatus}><View style={styles.onlineDot} /> Online now</Text>
              </View>
            </View>
            <View style={styles.chatActions}>
              <Pressable style={styles.chatAction}><MaterialIcons name="videocam" size={20} color={COLORS.primaryText} /></Pressable>
              <Pressable style={styles.chatAction}><MaterialIcons name="call" size={20} color={COLORS.primaryText} /></Pressable>
              <Pressable style={styles.chatAction}><MaterialIcons name="more-vert" size={20} color={COLORS.primaryText} /></Pressable>
            </View>
          </View>

          <View style={styles.messageArea}>
            <View style={styles.dateChip}><Text style={styles.dateChipText}>Today</Text></View>

            <View style={styles.receivedBubbleRow}>
              <Avatar uri={remoteAvatar} size={32} />
              <View style={styles.receivedBubble}>
                <Text style={styles.bubbleText}>The refactor for the auth module is live. Want me to share the PR diff and summary?</Text>
                <Text style={styles.bubbleTime}>10:14 AM</Text>
              </View>
            </View>

            <View style={styles.sentBubbleRow}>
              <View style={styles.sentBubble}>
                <Text style={styles.sentText}>Yes, send the branch details and relevant screenshots.</Text>
                <Text style={styles.sentTime}>10:15 AM</Text>
              </View>
            </View>

            <View style={styles.receivedBubbleRow}>
              <Avatar uri={remoteAvatar} size={32} />
              <View style={styles.receivedBubble}>
                <Text style={styles.bubbleText}>Done. Also linked the project notes and the latest issue references.</Text>
                <Text style={styles.bubbleTime}>10:16 AM</Text>
              </View>
            </View>
          </View>

          <View style={styles.chatComposer}>
            <View style={styles.composerInputWrap}><TextInput placeholder="Type a message..." placeholderTextColor={COLORS.tertiaryText} style={styles.composerInput} /></View>
            <Pressable style={styles.sendButton}><MaterialIcons name="send" size={18} color={COLORS.surface} /></Pressable>
          </View>
        </Card>
      </View>

      <BottomTabs items={mainTabs} active="Chat" onChange={(name) => navigation.navigate(name)} />
    </Screen>
  );
}

export function ProfileScreen({ navigation }) {
  return (
    <Screen>
      <AppHeader title="Developer Profile" subtitle="BuildVerse identity" />

      <View style={styles.sectionGap}>
        <View style={styles.profileHero}>
          <View style={styles.avatarWrap}>
            <Avatar uri={remoteAvatar} size={140} />
            <View style={styles.verifiedBadge}><MaterialIcons name="verified" size={18} color={COLORS.surface} /></View>
          </View>
          <View style={styles.profileHeroText}>
            <Text style={styles.profileHeroName}>Elias Thorne</Text>
            <Text style={styles.profileHeroRole}>Senior Systems Architect • Stockholm, SE</Text>
          </View>
          <View style={styles.profileHeroActions}>
            <PrimaryButton label="Edit Profile" onPress={() => navigation.navigate('Register')} icon="edit" style={{ flex: 1 }} />
            <SecondaryButton label="Share" onPress={() => Alert.alert('BuildVerse', 'Share profile flow can be connected here.')} icon="share" style={{ flex: 1 }} />
          </View>
        </View>
      </View>

      <View style={styles.sectionGap}>
        <View style={styles.profileStatsGrid}>
          <StatCard label="Projects" value="24" note="+3 this month" />
          <StatCard label="Commits" value="1.2k" note="Past year total" />
          <StatCard label="Ranking" value="Top 1%" note="Global contributor" />
        </View>
        <Card style={styles.techStackCard}>
          <SectionTitle title="Tech Stack" />
          <View style={styles.techPillRow}>
            {['Rust', 'TypeScript', 'WebAssembly', 'Go', 'PostgreSQL', 'Kubernetes', 'AWS', 'Next.js'].map((item) => (
              <View key={item} style={styles.techPill}><Text style={styles.techPillText}>{item}</Text></View>
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Featured Projects" action="View All" onAction={() => navigation.navigate('Projects')} />
        {profileProjects.map((project) => (
          <Card key={project.id} style={styles.profileProjectCard}>
            <View style={styles.profileProjectTop}>
              <Text style={styles.projectTitle}>{project.name}</Text>
              <View style={styles.starRow}><MaterialIcons name="star" size={18} color={COLORS.tertiaryText} /><Text style={styles.starText}>{project.stars}</Text></View>
            </View>
            <Text style={styles.projectSubtitle}>{project.description}</Text>
            <View style={styles.profileProjectFooter}>
              <View style={styles.projectTag}><Text style={styles.projectTagText}>{project.tag}</Text></View>
              <Text style={styles.projectUpdated}>{project.updated}</Text>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.sectionGap}>
        <SectionTitle title="Portfolio Links" />
        <Card>
          <RowLink icon="description" title="Curriculum Vitae" subtitle="Download PDF" onPress={() => navigation.navigate('Projects')} />
          <Divider />
          <RowLink icon="language" title="Personal Portfolio" subtitle="eliasthorne.dev" onPress={() => navigation.navigate('Projects')} />
          <Divider />
          <RowLink icon="alternate-email" title="Connect" subtitle="Inquiries & Networking" onPress={() => navigation.navigate('Chat')} />
        </Card>
      </View>

      <BottomTabs items={mainTabs} active="Profile" onChange={(name) => navigation.navigate(name)} />
    </Screen>
  );
}

function interestIcon(label) {
  const map = {
    Frontend: 'code',
    Backend: 'terminal',
    Mobile: 'smartphone',
    'Data Science': 'database',
    Security: 'shield',
    DevOps: 'cloud',
  };

  return map[label] || 'star';
}

const styles = StyleSheet.create({
  authCenter: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.page,
  },
  authCardWrap: {
    width: '100%',
    gap: 18,
  },
  authHero: {
    alignItems: 'center',
    gap: 6,
  },
  authBrand: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.4,
    color: COLORS.primaryText,
  },
  authTagline: {
    fontSize: 15,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  authCard: {
    padding: 24,
    gap: 18,
  },
  authHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryText,
    letterSpacing: -0.4,
  },
  authStep: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 13,
  },
  socialStack: {
    gap: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerLabel: {
    color: COLORS.secondaryText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formStack: {
    gap: 14,
  },
  inputLabel: {
    marginBottom: 8,
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: '600',
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallLink: {
    color: COLORS.secondaryText,
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    color: COLORS.primaryText,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  authFooterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  authBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  authBottomRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  authMuted: {
    color: COLORS.secondaryText,
    fontSize: 13,
  },
  authLink: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceMuted,
  },
  progressActive: {
    backgroundColor: COLORS.primary,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    width: '48%',
    minHeight: 84,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  interestChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  interestTextActive: {
    color: COLORS.surface,
  },
  authButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionGap: {
    marginTop: SPACING.section,
  },
  horizontalCardRow: {
    gap: 16,
  },
  projectMiniCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 14,
    ...SHADOW,
  },
  projectMiniTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  projectMiniIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPill: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: COLORS.primaryText,
  },
  projectSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 19,
  },
  progressBlock: {
    gap: 8,
    marginTop: 18,
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressMeta: {
    color: COLORS.secondaryText,
    fontSize: 12,
  },
  progressMetaStrong: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.amber,
    borderRadius: 999,
  },
  taskNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  taskNote: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionSpacing: {
    marginTop: 24,
  },
  teamsGrid: {
    gap: 14,
  },
  teamCard: {
    gap: 12,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  teamIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamStatus: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  teamStatusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: COLORS.secondaryText,
  },
  memberRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberCount: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: '700',
  },
  createTeamCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 28,
  },
  createTeamCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  createTeamText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: '600',
  },
  featuredGrid: {
    gap: 16,
  },
  featuredProject: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOW,
  },
  featuredImage: {
    width: '100%',
    height: 240,
  },
  featuredBanner: {
    height: 200,
  },
  featuredBannerImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  featuredCopy: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    gap: 8,
  },
  featuredTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  featuredTag: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  featuredTitle: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  featuredText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 19,
  },
  featuredSideColumn: {
    gap: 16,
  },
  joinRow: {
    marginTop: 14,
  },
  communityCard: {
    gap: 14,
    marginBottom: 14,
  },
  communityTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  communityButton: {
    minWidth: 100,
  },
  featuredChapter: {
    gap: 16,
  },
  chapterTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.amberSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chapterTagText: {
    color: COLORS.primaryText,
    fontSize: 11,
    fontWeight: '800',
  },
  chapterStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chapterStatCard: {
    flex: 1,
  },
  chapterFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  profileMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: COLORS.primaryText,
  },
  profileTitle: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 13,
  },
  profileHero: {
    alignItems: 'center',
    gap: 16,
  },
  avatarWrap: {
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    right: -4,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.amber,
    borderWidth: 4,
    borderColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeroText: {
    alignItems: 'center',
  },
  profileHeroName: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: COLORS.primaryText,
  },
  profileHeroRole: {
    marginTop: 6,
    fontSize: 15,
    color: COLORS.secondaryText,
  },
  profileHeroActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  profileStatsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  techStackCard: {
    gap: 12,
  },
  techPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  techPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E9C77A',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  techPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.amber,
  },
  profileProjectCard: {
    gap: 12,
    marginBottom: 14,
  },
  profileProjectTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starText: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: '600',
  },
  profileProjectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceMuted,
  },
  projectTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  projectUpdated: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: COLORS.primaryText,
    fontSize: 15,
  },
  detailActionRow: {
    gap: 14,
  },
  statusChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.amber,
  },
  statusChipText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: '700',
  },
  detailButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  milestoneDone: {
    textDecorationLine: 'line-through',
    color: COLORS.secondaryText,
  },
  milestoneSubtitle: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 12,
  },
  milestoneMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  memberLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  memberRole: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  addMemberText: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: '700',
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  issueMeta: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  issueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceMuted,
  },
  issueBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  chatLayout: {
    flex: 1,
    gap: 12,
    paddingHorizontal: SPACING.page,
    paddingBottom: 16,
  },
  threadList: {
    padding: 0,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  threadHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryText,
  },
  composeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  threadScroll: {
    padding: 16,
  },
  chatPanel: {
    flex: 1,
    padding: 0,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryText,
  },
  chatStatus: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  chatActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageArea: {
    flex: 1,
    padding: 20,
    gap: 16,
    backgroundColor: 'rgba(245,245,245,0.3)',
  },
  dateChip: {
    alignSelf: 'center',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  receivedBubbleRow: {
    flexDirection: 'row',
    gap: 10,
    maxWidth: '80%',
  },
  receivedBubble: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 14,
  },
  bubbleText: {
    color: COLORS.primaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTime: {
    marginTop: 8,
    color: COLORS.tertiaryText,
    fontSize: 11,
    fontWeight: '700',
  },
  sentBubbleRow: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  sentBubble: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 14,
  },
  sentText: {
    color: COLORS.surface,
    fontSize: 14,
    lineHeight: 20,
  },
  sentTime: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
  },
  chatComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  composerInputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  composerInput: {
    minHeight: 48,
    color: COLORS.primaryText,
    fontSize: 14,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMiniWrap: {
    marginBottom: 20,
  },
  featuredCardBorder: {
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
