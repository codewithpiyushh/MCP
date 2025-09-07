import { ResizeMode, Video } from 'expo-av';
import { useRef } from 'react';
import { Dimensions, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Home() {
  // Manual safe area - using fixed values instead of useSafeAreaInsets
  const insets = {
    top: Platform.OS === 'ios' ? 44 : 24,
    bottom: Platform.OS === 'ios' ? 34 : 0,
    left: 0,
    right: 0,
  };

  const firstVideoRef = useRef(null);
  const secondVideoRef = useRef(null);
  
  // Separate parameters for each video
  const firstVideoParams = {
    width: width * 0.8,    // 80% of screen width
    height: 70,    
    topSpacing: 0,        // Space from top
    borderRadius: 15      // Corner roundness
  };

  const secondVideoParams = {
    width: width * 0.9,    // 80% of screen width
    height: 340,          // Adjust second video height
    spacing: 20,          // Space between videos
    borderRadius: 15      // Corner roundness
  };
  
  return (
    <ImageBackground 
      source={require('../../assets/images/bg.png')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >

      {/* Fixed Header Video */}
      <View style={[styles.videoContainer, {
        width: firstVideoParams.width,
        height: firstVideoParams.height,
        top: insets.top + firstVideoParams.topSpacing,
        borderRadius: firstVideoParams.borderRadius,
        zIndex: 2
      }]}>
        <Video
          ref={firstVideoRef}
          style={[styles.video, {
            width: firstVideoParams.width,
            height: firstVideoParams.height,
            borderRadius: firstVideoParams.borderRadius
          }]}
          source={require('../../assets/images/calendarhearder.mp4')}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay
          isMuted={true}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.mainScroll}
        contentContainerStyle={{ paddingTop: insets.top + firstVideoParams.height + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Second Video */}
        <View style={[styles.mainVideoContainer, {
          width: secondVideoParams.width,
          height: secondVideoParams.height,
        }]}>
          <Video
            ref={secondVideoRef}
            style={[styles.mainVideo, {
              width: secondVideoParams.width,
              height: secondVideoParams.height,
              borderRadius: secondVideoParams.borderRadius,
            }]}
            source={require('../../assets/images/Bloom.mp4')}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted={true}
          />
        </View>

        {/* Insights section */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Your Insights</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.insightSquare}>
              <Image 
                source={require('../../assets/images/download.jpeg')}
                style={styles.insightImage}
                resizeMode="cover"
              />
              
            </View>
            <View style={styles.insightSquare}>
              <Image 
                source={require('../../assets/images/9.jpg')}
                style={styles.insightImage}
                resizeMode="cover"
              />
              
            </View>
            <View style={styles.insightSquare}>
              <Image 
                source={require('../../assets/images/activity.png')}
                style={styles.insightImage}
                resizeMode="cover"
              />
              
            </View>
            <View style={styles.insightSquare}>
              <Image 
                source={require('../../assets/images/focus.jpeg')}
                style={styles.insightImage}
                resizeMode="cover"
              />
              
            </View>
          </ScrollView>
          
          {/* Single full-width square below */}
          <View style={styles.fullWidthSquare}>
            <View style={styles.fullWidthHeader}>
              <Text style={styles.insightText}>Break the tabu</Text>
              <View style={styles.headerLine} />
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gridScrollContent}
            >
              <View style={styles.gridSquare}>
                <Image 
                  source={require('../../assets/images/10.png')}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.gridSquare}>
                <Image 
                  source={require('../../assets/images/8.png')}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.gridSquare}>
                <Image 
                  source={require('../../assets/images/7.png')}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.gridSquare}>
                <Image 
                  source={require('../../assets/images/focus.jpeg')}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 15,
  },
  mainVideoContainer: {
    overflow: 'hidden',
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  insightsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  insightsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  scrollContent: {
    paddingRight: 15,
  },
  insightSquare: {
    width: width * 0.35,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightImage: {
    width: '100%',
    height: '100%',
  },
  insightText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fullWidthSquare: {
    width: '112%',
    height: 400,
    left: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 40,
    paddingTop: 20,
    shadowColor: '#9E9E9E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidthHeader: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  gridScrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  gridSquare: {
    width: width * 0.70,
    height: width * 0.70,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  headerLine: {
    width: '90%',
    height: 1,
    backgroundColor: '#333333',
    marginTop: 15,
    opacity: 0.3,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  videoContainer: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 2,
    alignSelf: 'center',
    shadowColor: '#000000',
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
  }
});