import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    backgroundColor: '#3b8aad',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row', // Adiciona direção de linha
  },
  backButton: {
    position: 'absolute',
    left: 10, // Alinha a seta à esquerda
    top: '50%', // Alinha verticalmente ao centro
    transform: [{ translateY: 13}], // Ajusta a posição vertical
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Centraliza o texto
    flex: 1, // Expande o texto para preencher o espaço disponível
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: -10,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 140,
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 10,
    borderColor: '#3b8aad',
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: 'transparent'
  },

  errorMessage: {
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'flex',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b8aad',
    borderRadius: 25,
    width: '90%',
  },
  pickerContainer: {
    borderColor: '#3b8aad',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 45,
    width: '100%',
    color: '#000',
  }
});

export default styles;
