import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, Animated, Easing } from 'react-native';

const quotes = [
  {
    text: 'This is why I loved technology: If you used it right, it could give you the power & privacy.',
    author: 'Cory Doctorow',
  },
  {
    text: 'Life is what happens when you’re busy making other plans.',
    author: 'John Lennon',
  },
  {
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
  },
  {
    text: 'Your time is limited, so don’t waste it living someone else’s life.',
    author: 'Steve Jobs',
  },
  { 
    text: 'The best way to predict the future is to invent it.',
     author: 'Alan Kay' },
  { 
    text: 'Life is 10% what happens to us and 90% how we react to it.',
     author: 'Charles R. Swindoll'
     },
  { 
    text: 'The only limit to our realization of tomorrow is our doubts of today.', 
    author: 'Franklin D. Roosevelt' },

];

export default function App() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const slideAnim = useRef(new Animated.Value(0)).current;

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const newQuote = quotes[randomIndex];

   
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
    
      setCurrentQuote(newQuote);

      
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

  const shareQuote = async () => {
    try {
      const message = `"${currentQuote.text}" — ${currentQuote.author}`;
      await Share.share({
        message,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the quote.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.quoteCard}>
        <Text style={styles.header}>Quote of the Day</Text>

       
        <Animated.View
          style={[
            styles.animatedContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.quoteText}>
            “{currentQuote.text}”
          </Text>
          <Text style={styles.author}>— {currentQuote.author}</Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={shareQuote}>
            <Text style={styles.iconText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.newQuoteButton} onPress={getRandomQuote}>
            <Text style={styles.newQuoteButtonText}>New Quote</Text>
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
    width: '100%',
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
