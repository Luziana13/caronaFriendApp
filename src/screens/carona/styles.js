import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#3b8aad',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 50, // Circular border
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    webView: {
        width: '100%',
        height: '100%',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#ff6f6f',
        borderRadius: 50,
        padding: 15,
        elevation: 5,
    },
    floatingButtonDetalhe: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#3b8aad',
        borderRadius: 50,
        padding: 15,
        elevation: 5,
        marginRight: '65%'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
