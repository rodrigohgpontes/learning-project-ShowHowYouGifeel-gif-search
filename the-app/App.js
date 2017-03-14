import React from 'react';
import { StyleSheet, Text, View, ListView, Image, TextInput } from 'react-native';
import Relay, { 
  Route,
  RootContainer,
  DefaultNetworkLayer
} from 'react-relay'

Relay.injectNetworkLayer(new DefaultNetworkLayer('https://www.graphqlhub.com/graphql'))

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
                <Text style={styles.header}>
                    Hallellujah
                </Text>
                <TextInput style={styles.input} placeholder="(sorry, no idea how to make search works... yet.)" onChangeText={(text) => this.setState({text})} />
				<Relay.Renderer
                    environment={Relay.Store}
					Container={ResultsComponent}
					queryConfig={new GiphyRoute()}
                    
                />


        </View>
    );
  }
}

export class ResultsComponent extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['https://s-media-cache-ak0.pinimg.com/originals/35/43/79/3543790945c4d7be166234d424a3b6e5.gif']),
        };

    }

	componentWillMount(){
				var store = this.props.store;
		
		const results = [];
		store.search.map(gif => results.push(gif.images.fixed_width.url));
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({
			dataSource: ds.cloneWithRows(results),
		});
	}
	
    render() {
		
        return (

            <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData) => <Image style={styles.images} source={{uri: rowData}} />}
            />

        );
    }
}

ResultsComponent = Relay.createContainer(ResultsComponent, {

  fragments: {
    store: () => Relay.QL`fragment on GiphyAPI {search(query:"happy"){url,images{fixed_width{url}}}}`,
  },
});

class GiphyRoute extends Relay.Route {
  static routeName = 'GiphyRoute';
  static queries = {
    store: ((Component) => {
      return Relay.QL`query root {giphy {${Component.getFragment('store')}}}`
      })
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#DCF777',
    flexDirection: 'column',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#D9244F',

  },
  input: {
    fontSize: 16,
    height: 50,
    textAlign: 'center',
  },
  images: {
    flex: 1,
    height: 400,
    backgroundColor: '#D9244F',
    margin: 5,

  },


});
