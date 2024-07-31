import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginTop: '40%'
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
    borderColor: '#3b8aad',
    borderRadius: 25, // Arredondar todas as bordas
    backgroundColor: 'transparent',
    paddingVertical: 10
  },
  
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#3b8aad',
    borderRadius: 25,
    width: '100%',
  },
});

export default styles;
