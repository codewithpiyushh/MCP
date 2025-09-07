import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFlow, useDescope, useSession } from '@descope/react-native-sdk';

// Enhanced Authentication Screen with Beautiful UI from myapp
export default function AuthScreen() {
  const router = useRouter();
  const flow = useFlow();
  const { session, clearSession, manageSession } = useSession();
  const { logout } = useDescope();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    // Stay on auth page after logout
  }, [logout]);

  const startFlow = async () => {
    setIsLoading(true);
    try {
      const resp = await flow.start(
        'https://auth.descope.io/login/P32DkUA0pWtepx1OMHKokTnUEnJ2',
        'bloom://auth'
      );
      await manageSession(resp.data);
      // Navigate to main app after successful authentication
      router.replace('/(tabs)/home');
    } catch (e) {
      console.error('Authentication flow error:', e);
      Alert.alert('Authentication Error', 'Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated, show authenticated state with profile
  if (session) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#467496" />
        <LinearGradient
          colors={['#467496', '#764ba2']}
          style={styles.gradient}
        >
          <View style={styles.authenticatedContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {session.user?.name?.charAt(0)?.toUpperCase() || 
                     session.user?.email?.charAt(0)?.toUpperCase() || 'B'}
                  </Text>
                </View>
              </View>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.userNameText}>
                {session.user?.name || session.user?.email || 'Bloom User'}
              </Text>
            </View>

            {/* User Info Cards */}
            <View style={styles.infoCardsContainer}>
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Profile</Text>
                <Text style={styles.cardValue} numberOfLines={1} ellipsizeMode="middle">
                  {session.user?.email || 'N/A'}
                </Text>
                <Text style={styles.cardSubtitle}>Email Address</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Status</Text>
                <Text style={[styles.cardValue, styles.statusActive]}>Active</Text>
                <Text style={styles.cardSubtitle}>Account Status</Text>
              </View>
            </View>

            {/* Session Info */}
            <View style={styles.sessionCard}>
              <Text style={styles.sessionTitle}>Session Information</Text>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionLabel}>User ID:</Text>
                <Text style={styles.sessionValue} numberOfLines={1} ellipsizeMode="middle">
                  {session.user?.userId || 'N/A'}
                </Text>
              </View>
              {session.user?.name && (
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionLabel}>Display Name:</Text>
                  <Text style={styles.sessionValue}>{session.user.name}</Text>
                </View>
              )}
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionLabel}>Session:</Text>
                <Text style={styles.sessionValue}>
                  {session.sessionJwt ? '🟢 Active' : '🔴 Inactive'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={() => router.push('/(tabs)/home')}
              >
                <Text style={styles.buttonText}>Continue to App</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={() => Alert.alert('Coming Soon', 'Settings will be available soon!')}
              >
                <Text style={styles.secondaryButtonText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>

            {/* App Info */}
            <View style={styles.backendInfo}>
              <Text style={styles.backendInfoText}>Bloom - Menopause Wellness</Text>
              <Text style={styles.backendInfoText}>Secure Authentication Active</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Unauthenticated state - Beautiful onboarding UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#467496" />
      <LinearGradient
        colors={['#467496', '#764ba2']}
        style={styles.gradient}
      >
        <View style={styles.unauthenticatedContainer}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.appTitle}>🌸 Bloom</Text>
            <Text style={styles.appSubtitle}>Your Menopause Wellness Companion</Text>
            <Text style={styles.appDescription}>
              Navigate your menopause journey with AI-powered guidance, 
              personalized insights, and supportive community features.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>AI Assistant</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>Track Symptoms</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>Get Support</Text>
            </View>
          </View>

          {/* CTA Button */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={[styles.startFlowButton, isLoading && styles.disabledButton]} 
              onPress={startFlow}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.startFlowButtonText}>Get Started</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.ctaSubtext}>
              Sign in or create your account to begin your wellness journey
            </Text>
          </View>

          {/* Footer Info */}
          <View style={styles.backendInfo}>
            <Text style={styles.backendInfoText}>Powered by Descope Security</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#467496',
  },
  gradient: {
    flex: 1,
  },
  // Authenticated user styles
  authenticatedContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  userNameText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  // Info cards styles
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  statusActive: {
    color: '#4ade80',
  },
  // Session card styles
  sessionCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
  },
  sessionValue: {
    fontSize: 14,
    color: 'white',
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  // Actions container
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
  },
  // Unauthenticated styles
  unauthenticatedContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  appSubtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  appDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  // Features section
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '600',
  },
  // CTA section
  ctaContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  startFlowButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 180,
    minHeight: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  startFlowButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  // Backend info
  backendInfo: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  backendInfoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 3,
  },
});
