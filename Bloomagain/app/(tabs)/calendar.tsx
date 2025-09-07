import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import moment from 'moment';
import { useMemo, useRef, useState } from 'react';
import { Dimensions, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Calendar() {
  // Manual safe area - using fixed values instead of useSafeAreaInsets
  const insets = {
    top: Platform.OS === 'ios' ? 44 : 24,
    bottom: Platform.OS === 'ios' ? 34 : 0,
    left: 0,
    right: 0,
  };
  const videoRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [periodStart, setPeriodStart] = useState<moment.Moment | null>(null);
  const [periodEnd, setPeriodEnd] = useState<moment.Moment | null>(null);
  const [tempSelectedDate, setTempSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptoms = [
    "Hot flashes",
    "Night sweats",
    "Cold flashes or shivering",
    "Vaginal dryness, itching, and burning"
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleDateClick = (date: moment.Moment) => {
    setTempSelectedDate(date);
    setShowDateOptions(true);
  };

  // Generate calendar months view
  const generateCalendarMonths = useMemo(() => {
    const months = [];
    const startDate = moment().subtract(12, 'months');
    const endDate = moment().add(12, 'months');
    
    let currentMonth = startDate.clone().startOf('month');
    
    while (currentMonth.isBefore(endDate)) {
      const firstDayOfMonth = currentMonth.clone().startOf('month');
      const startOfWeek = firstDayOfMonth.clone().subtract(firstDayOfMonth.day(), 'days');
      const weeks = [];

      for (let week = 0; week < 6; week++) {
        const days = [];
        for (let day = 0; day < 7; day++) {
          const currentDate = startOfWeek.clone().add(week * 7 + day, 'days');
          days.push({
            date: currentDate,
            isCurrentMonth: currentDate.month() === currentMonth.month(),
          });
        }
        weeks.push(days);
      }

      months.push({
        month: currentMonth.format('MMMM YYYY'),
        weeks: weeks
      });

      currentMonth.add(1, 'month');
    }

    return months;
  }, []);

  // Video parameters
  const videoParams = {
    width: width * 0.8,    // 80% of screen width
    height: 70,           // Same height as home screen header
    topSpacing: 0,        // Space from top
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
        width: videoParams.width,
        height: videoParams.height,
        top: insets.top + videoParams.topSpacing,
        borderRadius: videoParams.borderRadius,
        zIndex: 2
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

      <ScrollView 
        style={styles.mainScroll}
        contentContainerStyle={{ 
          paddingTop: insets.top + videoParams.height + 20,
          paddingHorizontal: 15 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.calendarView}>
            <ScrollView 
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={[styles.embeddedCalendarScroll]}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                {generateCalendarMonths.map((monthData, monthIndex) => (
                <View key={monthIndex} style={styles.monthCalendarContainer}>
                  <Text style={styles.monthHeaderText}>{monthData.month}</Text>
                  <View style={styles.daysHeader}>
                    <Text style={styles.dayHeaderText}>Sun</Text>
                    <Text style={styles.dayHeaderText}>Mon</Text>
                    <Text style={styles.dayHeaderText}>Tue</Text>
                    <Text style={styles.dayHeaderText}>Wed</Text>
                    <Text style={styles.dayHeaderText}>Thu</Text>
                    <Text style={styles.dayHeaderText}>Fri</Text>
                    <Text style={styles.dayHeaderText}>Sat</Text>
                  </View>
                  {monthData.weeks.map((week: DayInfo[], weekIndex: number) => (
                    <View key={weekIndex} style={styles.weekRow}>
                      {week.map((day: DayInfo, dayIndex: number) => (
                        <TouchableOpacity
                          key={dayIndex}
                          style={[
                            styles.dayButton,
                            !day.isCurrentMonth ? styles.otherMonthDay : styles.currentMonthDay,
                            day.date.isSame(selectedDate, 'day') && styles.selectedDay,
                            day.date.isSame(moment(), 'day') && styles.today,
                            periodStart && day.date.isSame(periodStart, 'day') && styles.periodStart,
                            periodEnd && day.date.isSame(periodEnd, 'day') && styles.periodEnd,
                            periodStart && periodEnd && 
                            day.date.isBetween(periodStart, periodEnd) && styles.periodRange,
                          ]}
                          onPress={() => {
                            if (day.isCurrentMonth) {
                              setSelectedDate(day.date);
                              setTempSelectedDate(day.date);
                              setShowDateOptions(true);
                            }
                          }}
                          disabled={!day.isCurrentMonth}
                        >
                          <Text style={[
                            styles.dayText,
                            !day.isCurrentMonth ? styles.otherMonthDayText : styles.currentMonthDayText,
                            day.date.isSame(selectedDate, 'day') && styles.selectedDayText,
                            day.date.isSame(moment(), 'day') && styles.todayText,
                          ]}>
                            {day.date.date()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={styles.legendDot} />
                <Text style={styles.legendText}>Today</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF69B4' }]} />
                <Text style={styles.legendText}>Period Start</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFB6C1' }]} />
                <Text style={styles.legendText}>Period End</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFE4E9' }]} />
                <Text style={styles.legendText}>Period Days</Text>
              </View>
            </View>
          </View>


        </View>

        <View style={styles.contentContainer}>
          

          <View style={styles.symptomsContainer}>
            <Text style={styles.symptomsTitle}>How are you feeling today?</Text>
            <View style={styles.symptomsGrid}>
              {symptoms.map((symptom, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.symptomButton,
                    selectedSymptoms.includes(symptom) && styles.symptomButtonSelected
                  ]}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text style={[
                    styles.symptomButtonText,
                    selectedSymptoms.includes(symptom) && styles.symptomButtonTextSelected
                  ]}>
                    {symptom}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.dietContainer}>
            <Text style={styles.dietTitle}>Today's Diet</Text>
            <View style={styles.dietContentContainer}>
              <Text style={styles.mealTitle}>Breakfast:</Text>
              <Text style={styles.mealContent}>
                Oatmeal made with low-fat milk, topped with berries and a tablespoon of ground flaxseeds.
              </Text>

              <Text style={styles.mealTitle}>Lunch:</Text>
              <Text style={styles.mealContent}>
                Grilled chicken salad with mixed greens, cherry tomatoes, cucumber, and a light vinaigrette dressing.
              </Text>

              <Text style={styles.mealTitle}>Dinner:</Text>
              <Text style={styles.mealContent}>
                Baked salmon with roasted asparagus and quinoa.
              </Text>

              <Text style={styles.mealTitle}>Snack:</Text>
              <Text style={styles.mealContent}>
                A handful of almonds.
              </Text>
            </View>
          </View>

          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseTitle}>Today's Exercise</Text>
            <View style={styles.exerciseContentContainer}>
              <View style={styles.exerciseBlock}>
                <View style={styles.exerciseTimeContainer}>
                  <Ionicons name="sunny" size={24} color="#FFA500" />
                  <Text style={styles.exerciseTime}>Morning</Text>
                  <Text style={styles.exerciseDuration}>(30 mins)</Text>
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseActivity}>
                    Brisk walk or cycling
                  </Text>
                  <Text style={styles.exerciseNote}>
                    Aim for an intensity where you can still hold a conversation.
                  </Text>
                </View>
              </View>

              <View style={styles.exerciseDivider} />

              <View style={styles.exerciseBlock}>
                <View style={styles.exerciseTimeContainer}>
                  <Ionicons name="moon" size={24} color="#4B0082" />
                  <Text style={styles.exerciseTime}>Evening</Text>
                  <Text style={styles.exerciseDuration}>(10 mins)</Text>
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseActivity}>Core work:</Text>
                  <View style={styles.exerciseSet}>
                    <Text style={styles.exerciseSetText}>• 3 sets of planks (holding for 30-60 seconds)</Text>
                    <Text style={styles.exerciseSetText}>• 3 sets of 15-20 bird-dog exercises</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

        {/* Date Options Modal */}
        <Modal
          visible={showDateOptions}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDateOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.dateOptionsModal}>
              <View style={styles.dateOptionsHeader}>
                <Text style={styles.dateOptionsTitle}>
                  {tempSelectedDate?.format('MMMM DD, YYYY')}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDateOptions(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.dateOptionButton,
                  tempSelectedDate?.isSame(periodStart, 'day') && styles.selectedOption
                ]}
                onPress={() => {
                  setPeriodStart(tempSelectedDate);
                  setSelectedDate(tempSelectedDate!);
                  setShowDateOptions(false);
                }}
              >
                <View style={styles.optionContent}>
                  <Ionicons name="water" size={24} color="#FF69B4" />
                  <Text style={styles.dateOptionText}>Period Start</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateOptionButton,
                  tempSelectedDate?.isSame(periodEnd, 'day') && styles.selectedOption
                ]}
                onPress={() => {
                  setPeriodEnd(tempSelectedDate);
                  setSelectedDate(tempSelectedDate!);
                  setShowDateOptions(false);
                }}
              >
                <View style={styles.optionContent}>
                  <Ionicons name="water-outline" size={24} color="#FF69B4" />
                  <Text style={styles.dateOptionText}>Period End</Text>
                </View>
              </TouchableOpacity>

              {(periodStart || periodEnd) && (
                <View style={styles.periodInfo}>
                  {periodStart && (
                    <Text style={styles.periodInfoText}>
                      Start: {periodStart.format('MMM DD, YYYY')}
                    </Text>
                  )}
                  {periodEnd && (
                    <Text style={styles.periodInfoText}>
                      End: {periodEnd.format('MMM DD, YYYY')}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>
    </ImageBackground>
  );
}

interface DayInfo {
  date: moment.Moment;
  isCurrentMonth: boolean;
}

interface MonthData {
  month: string;
  weeks: DayInfo[][];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    // background image things
  },
  mainScroll: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 120, // Extra space at bottom
  },
  headerSection: {
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  calendarView: {
    marginBottom: 15,
  },
  embeddedCalendarScroll: {
    maxHeight: 400,
    width: width,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#EBCB90',
    borderRadius: 50,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
  },
  videoContainer: {
    position: 'absolute',
    overflow: 'hidden',
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
  calendarContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  calendarContentContainer: {
    paddingBottom: 120, // Extra space at the bottom
    flexGrow: 1,
  },
  calendarStripContainer: {
    backgroundColor: '#FFFFFF',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
  },

  eventContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
  },
  dietContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginHorizontal: -30, // Extend beyond the parent padding
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dietTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
  },
  dietContentContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
    marginBottom: 5,
  },
  mealContent: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 15,
  },
  monthCalendarContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    paddingHorizontal: 30,
    width: width - 20,
    marginHorizontal: -15,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  dayHeaderText: {
    width: 35,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  dayButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17.5,
    margin: 2,
  },
  currentMonthDay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  otherMonthDay: {
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
  otherMonthDayText: {
    color: '#ccc',
    opacity: 0.5,
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  today: {
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dayText: {
    fontSize: 14,
    color: '#999',
  },
  currentMonthDayText: {
    color: '#000',
  },
  selectedDayText: {
    color: '#fff',
  },
  todayText: {
    color: '#007AFF',
  },
  calendarScrollView: {
    maxHeight: height * 0.6,
  },
  monthHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  dateOptionsModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: width * 0.8,
    alignItems: 'center',
  },
  dateOptionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  periodStart: {
    backgroundColor: '#FF69B4',
    borderWidth: 2,
    borderColor: '#FF1493',
  },
  periodEnd: {
    backgroundColor: '#FFB6C1',
    borderWidth: 2,
    borderColor: '#FF1493',
  },
  periodRange: {
    backgroundColor: '#FFE4E9',
    borderRadius: 0,
  },
  dateOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  closeButton: {
    padding: 5,
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
    borderColor: '#FF69B4',
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    width: '100%',
  },
  periodInfoText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  symptomsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    left: -30, // Extend beyond the parent padding
    width: '120%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  symptomsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  symptomsGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  symptomButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  symptomButtonSelected: {
    backgroundColor: '#FFE4E9',
    borderColor: '#FF69B4',
  },
  symptomButtonText: {
    fontSize: 16,
    color: '#666',
  },
  symptomButtonTextSelected: {
    color: '#FF1493',
    fontWeight: '500',
  },
  exerciseContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginHorizontal: -30, // Extend beyond the parent padding
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  exerciseContentContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  exerciseBlock: {
    marginBottom: 10,
  },
  exerciseTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  exerciseDetails: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginLeft: 32,
  },
  exerciseActivity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 5,
  },
  exerciseNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  exerciseDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  exerciseSet: {
    marginTop: 8,
  },
  exerciseSetText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
});