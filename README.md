# mbmbam-search
A simple api that uses fuzzy search to search for MBMBAM episodes.



## To-Do

- Implement caching (redis?). I'm sure /u/Scootch_McGootch doesn't appreciate frivolous requests for mostly static data.
- Return link to the libsyn location of the episode in json
- better usage details?
- Sanitize input better.
- Add proper docs at the /api/ endpoint
- Add proper intro page at main page
- Separate /api/ routes into a specific file


## Issues

- No talking points/titles for earlier episodes.
- Doesn't handle special episodes (Bro's better/best, sponsored eps) or episodes without specific talking points well.
- Ranks bros' better bros best above the actual ep (ex. Bramblepelt, Peepums) May not be an issue?


## How to Run

- clone to local directory
- `yarn install` to install dependencies
- `npm install -g nodemon` if you don't already have it (used for the build step)
- `yarn run build` which should start the app at localhost:8085
- Navigate to `localhost:8085/api/searchTerm` to use search (replace searchTerm with your searchTerm)

Online at https://mbmbam-search.herokuapp.com/api/