import { ResizeMode, Video } from 'expo-av';
import React, { useRef } from 'react';

import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');


const consult = () => {
  const videoRef = useRef(null);
  const videoParams = {
    width: width * 0.8,
    height: 70,
    borderRadius: 15,
    topSpacing: 40,
  };
  return (
    <ImageBackground
      source={require('../../assets/images/bg.png')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.pageScrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.videoContainer, {
          width: videoParams.width,
          height: videoParams.height,
          top: videoParams.topSpacing,
          borderRadius: videoParams.borderRadius,
          zIndex: 2,
        }]}
        >
          <Video
            ref={videoRef}
            style={{
              width: videoParams.width,
              height: videoParams.height,
              borderRadius: videoParams.borderRadius,
            }}
            source={require('../../assets/images/calendarhearder.mp4')}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted={true}
          />
        </View>
        {/* Search box below the video */}
        <View style={styles.searchBoxWrapper}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search..."
            placeholderTextColor="#888"
          />
        </View>

        {/* Horizontal scrollable rectangles below search box */}
        <View style={styles.horizontalScrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {[
              require('../../assets/images/Bloom.png'),
              require('../../assets/images/8.png'),
              require('../../assets/images/9.jpg'),
              require('../../assets/images/activity.png'),
              require('../../assets/images/focus.jpeg'),
            ].map((imgSrc, idx) => (
              <View key={idx} style={styles.rectangle}>
                <Image source={imgSrc} style={styles.rectangleImage} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Two-section row: Doctor and Exercise Coach (moved below) */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionBox, { marginRight: 10 }]}> 
            <View style={styles.sectionTextWrapper}>
              <Text style={styles.sectionTitle}>Doctor</Text>
            </View>
          </View>
          <View style={styles.sectionBox}>
            <View style={styles.sectionTextWrapper}>
              <Text style={styles.sectionTitle}>Exercise Coach</Text>
            </View>
          </View>
        </View>

        {/* Square with border and blur background */}
        <View style={styles.blurSquareWrapper}>
          <View style={styles.blurSquare}>
            <ScrollView style={styles.innerScroll} contentContainerStyle={styles.innerScrollContent} showsVerticalScrollIndicator={false}>
              {[
                { name: 'Dr. Ayesha Khan', domain: 'Gynecologist', img: { uri: 'https://randomuser.me/api/portraits/women/44.jpg' } },
                { name: 'Dr. Rahul Mehta', domain: 'Endocrinologist', img: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' } },
                { name: 'Dr. Sara Ali', domain: 'Nutritionist', img: { uri: 'https://randomuser.me/api/portraits/women/65.jpg' } },
                { name: 'Dr. John Smith', domain: 'General Physician', img: { uri: 'https://randomuser.me/api/portraits/men/12.jpg' } },
                { name: 'Dr. Fatima Noor', domain: 'Psychologist', img: { uri: 'https://randomuser.me/api/portraits/women/68.jpg' } },
              ].map((doc, idx) => (
                <View key={doc.name} style={styles.innerSquareRow}>
                  <Image
                    source={doc.img}
                    style={styles.profilePhoto}
                  />
                  <View style={styles.doctorTextBlock}>
                    <Text style={styles.innerSquareText}>{doc.name}</Text>
                    <Text style={styles.domainText}>{doc.domain}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}


export default consult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.7,
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
  searchBoxWrapper: {
    marginTop: 130, // space below video (adjust as needed)
    alignItems: 'center',
    zIndex: 1,
  },
  searchBox: {
    width: width * 0.85,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalScrollWrapper: {
    marginTop: 30,
    paddingLeft: 20,
  },
  horizontalScrollContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
    zIndex: 1,
  },
  sectionBox: {
    width: width * 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  sectionTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  rectangle: {
    width: width * 0.9,
    height: 220,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    marginRight: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  rectangleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  blurSquareWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  blurSquare: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // For iOS, you can use backdropFilter: 'blur(10px)' in web, but for React Native, use expo-blur for real blur
  },
  innerScroll: {
    width: '100%',
    flex: 1,
  },
  innerScrollContent: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  innerSquareRow: {
    width: '90%',
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 18,
    backgroundColor: '#eee',
  },
  innerSquareText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  pageScrollContent: {
    paddingBottom: 120,
    paddingTop: 0,
  },
  doctorTextBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  domainText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '400',
  },
});