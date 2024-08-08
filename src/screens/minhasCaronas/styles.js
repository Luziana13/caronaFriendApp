import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b8aad',
    },
    vagasDisponiveis: {
        fontWeight: 'bold',
    },
    expandedContent: {
        paddingTop: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#ff6f6f',
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    completeButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    linkText: {
        color: '#3b8aad',
        textDecorationLine: 'underline',
        marginTop: 10,
        fontWeight: 'bold',
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
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '60%',
    },
    emptyListText: {
        color: '#666',
        fontSize: 18,
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        marginHorizontal: 30,
        maxHeight: '60%',
        marginTop: '50%',
    },
    modalHeader: {
        width: '100%',
        backgroundColor: '#3b8aad',
        padding: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: '#6c757d',
        borderRadius: 15,
        padding: 5,
    },
    closeModalButton: {
        backgroundColor: '#3b8aad',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    closeModalText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    friendImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 10,
    },
    friendImage: {
        width: '100%',
        height: '100%',
    },
    defaultImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ccc',
        borderRadius: 25,
    },
    friendDetails: {
        flex: 1,
    },
    friendName: {
        fontWeight: 'bold',
    },
    friendEmail: {
        color: '#555',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        color: '#999',
        fontSize: 18,
        fontWeight: 'bold',
    },
    personDetails: {
        alignItems: 'center',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    acceptButton: {
        backgroundColor: '#3b8aad',
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 15,
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    acceptButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    }

});

export default styles;
