import { View, Text, FlatList, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import millisToMinutesAndSeconds from '../utils/millisToMinuteSeconds';
import Colors from '../Themes/colors'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SongList(props) {
  const navigation = useNavigation();

  let renderTrack = function({item, index}) {
    const name = item.name;
    const albumImageUrl = item.album.images[0].url;
    const albumName = item.album.name;
    const artists = item.artists.map(artist => artist.name);
    const detailsUrl = item.external_urls.spotify;
    const previewUrl = item.preview_url;
    let artistsString = artists[0]
    for(let i = 1; i < artists.length; i++) {
      artistsString += ', ' + artists[i]
    }
    const duration = millisToMinutesAndSeconds(item.duration_ms);

    const navigateToWebView = (destination, name) => {
      navigation.navigate("WebViewScreen", {url: destination, name: name})
    }

    return (
      <Pressable onPress={() => navigateToWebView(detailsUrl, "Song Details")}>
        <View style={styles.trackContainer}>
          <Pressable style={styles.trackIndex} onPress={() => navigateToWebView(previewUrl, "Song Preview")}>
            <Ionicons style={styles.playIcon} name='play-circle' color={Colors.spotify} size={30}/>
          </Pressable>
          <View style={styles.trackArt}>
            <Image style={styles.trackArtImage} source={{uri: albumImageUrl}}/>
          </View>
          <View style={styles.trackName}>
            <Text numberOfLines={1} style={styles.text}>{name}</Text>
            <Text numberOfLines={1} style={[styles.text, {color: Colors.gray}]}>{artistsString}</Text>
          </View>
          <View style={styles.trackAlbumName}>
            <Text numberOfLines={1} style={styles.text}>{albumName}</Text>
          </View>
          <View style={styles.trackDuration}>
            <Text style={styles.text}>{duration}</Text>
          </View>
        </View>
        <View style={styles.divider}/>
      </Pressable>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList data={props.tracks} renderItem={renderTrack}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.background,
    padding: 2
  },
  listContainer: {
    flex: 1
  },
  trackContainer: {
    width: '100%',
    height: undefined,
    aspectRatio: 1/.16,
    backgroundColor: Colors.background,
    display: 'flex',
    flexDirection: 'row',
  },
  trackIndex: {
    width: '12%',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playIcon: {
    textAlign: 'center'
  },
  trackArt: {
    padding: 4,
    width: '16%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  trackArtImage: {
    width: '100%',
    height: '100%'
  },
  trackName: {
    padding: 7,
    width: '33%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  trackAlbumName: {
    padding: 5,
    width: Dimensions.get('screen').width < 600 ? '25%' : '31%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  trackDuration: {
    padding: 2,
    width: Dimensions.get('screen').width < 600 ? '14%' : '8%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  divider: {
    height: 10,
    width: '100%'
  },
  text: {
    color: 'white',
    fontSize: Dimensions.get('screen').width < 600 ? 14 : 18
  }
});
