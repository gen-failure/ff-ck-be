const { ApolloServer, gql } = require('apollo-server');
const LocalStorage = require('node-localstorage').LocalStorage;

let songs = [];
const localStorage = new LocalStorage('./songs');
const storedSongs = localStorage.getItem('songs');
if (storedSongs) songs = JSON.parse(storedSongs);

const typeDefs = gql`
    type NoteEvent {
      time: Float!,
      type: Int!,
      value: Int! 
    }

    input NoteEventInput {
      time: Float,
      type: Int,
      value: Int 
    }
    type Song {
        id: ID!
        title: String!
        noteEvents: [NoteEvent]!
    }

    type Query {
        songs: [Song]
        song(id: ID): Song
    }

    type Mutation {
        addSong(title: String, noteEvents: [NoteEventInput]): Song
    }
`

const resolvers = {
    Query: {
      songs: () => songs,
      song: (_, {id}) => {
        return songs.find((song) => { 
          return song.id === Number(id)
        })
      }
    },
    Mutation: {
        addSong: (_, { title, noteEvents }) => {
            const newSong = { 
                id: songs.length + 1,
                title,
                noteEvents,
            };
            songs.push(newSong);
            localStorage.setItem('songs', JSON.stringify(songs));
            return newSong;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Apollo server running: ${url}`);
});
