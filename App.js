import { StyleSheet, Text, SafeAreaView, Pressable, Image, View } from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from './Themes/colors'
import Images from './Themes/images'
import SongList from './components/SongList'

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

export default function App() {
  const topTracks = false;
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      if(topTracks) {
        myTopTracks(setTracks, token);
      } else {
        albumTracks(ALBUM_ID, setTracks, token);
      }
    }
  }, [token]);

  let contentDisplayed = null;

  let title = "My Top Tracks"
  if(!topTracks) {
    title = tracks[0] ? tracks[0].album.name : 'Loading...';
  }

  if(token) {
    contentDisplayed =
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image style={styles.headerImage} source={Images.spotify}/>
          <Text style={styles.headerText}>
            {title}
          </Text>
        </View>
      </View>
      <SongList tracks={tracks} style={styles.songList} />
    </SafeAreaView>;
  } else {
    contentDisplayed =
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.authButton} onPress={promptAsync}>
        <Image style={styles.authButtonImage} source={Images.spotify}/>
        <Text style={styles.authButtonText}>CONNECT WITH SPOTIFY</Text>
      </Pressable>
    </SafeAreaView>
    ;
  }

  return (
    contentDisplayed
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  authButton: {
    backgroundColor: Colors.spotify,
    borderRadius: 99999,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  authButtonImage: {
    height: undefined,
    width: 25,
    aspectRatio: 1,
    marginRight: 8
  },
  header: {
    height: '8%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%'
  },
  headerImage: {
    height: '100%',
    width: undefined,
    aspectRatio: 1
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8
  },
  songList: {
    flex: 1
  },
});