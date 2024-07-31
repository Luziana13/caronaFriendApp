import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header:{    
    height:180,
    justifyContent:"center",
    alignItems:"center",
    alignContent:"center"
  },
  profileCircle:{
    width:100,
    height:100,
    backgroundColor: '#d3d3d3',
    borderRadius:100,
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center"
  },
  profileText:{
    color:"#fff",
    fontSize:42
  },
  text:{
    marginTop:15,
    fontSize:20,
    fontWeight: 'bold'
  },
  email: {
    fontSize:15
  },
   image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  }
});

export default styles;