import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Fetch quotes from the API
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch(
          'http://192.168.100.49/RandomQuote/api/Quotes/GetAllQuotes'
        ); // Use your local IP
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setQuotes(data);
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
        Alert.alert('Error', 'Failed to fetch quotes from the API.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const handleAnimation = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const getNextQuote = () => {
    if (quotes.length === 0) return;
    handleAnimation(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    });
  };

  const getPreviousQuote = () => {
    if (quotes.length === 0) return;
    handleAnimation(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? quotes.length - 1 : prevIndex - 1
      );
    });
  };

  const shareQuote = async () => {
    if (!quotes[currentIndex]) return;

    try {
      const message = `"${quotes[currentIndex].quoteText}" — ${quotes[currentIndex].authorName}`;
      await Share.share({
        message,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the quote.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.quoteCard}>
        <Text style={styles.header}>Quote of the Day</Text>

        {quotes[currentIndex] && (
          <Animated.View
            style={[
              styles.animatedContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.quoteText}>
              “{quotes[currentIndex].quoteText}”
            </Text>
            <Text style={styles.author}>
              — {quotes[currentIndex].authorName}
            </Text>
          </Animated.View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={getPreviousQuote}>
            <Text style={styles.iconText}>◀ Previous</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.newQuoteButton} onPress={getNextQuote}>
            <Text style={styles.newQuoteButtonText}>Next ▶</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={shareQuote}>
            <Text style={styles.iconText}>📤 Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  animatedContainer: {
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    
  },
  iconButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  iconText: {
    fontSize: 16,
    color: '#fff',
  },
  newQuoteButton: {
    backgroundColor: '#34A853',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  newQuoteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
