import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16
  },
  rideCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default styles;
