import React from 'react';
import axios from 'axios'

const TITLE = 'GraphQL GitGub Client'

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const App = (props) => {
  function handleChange() {

  }

  function handleSubmit() {

  }

  return (
    <div>
      <h1>{TITLE}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="url">
          Show open issues for https://github.com/
        </label>
        <input
          id="url"
          type="text"
          onChange={handleChange}
          style={{width: '300px'}}
        />
        <button type="submit">Search</button>
      </form>
      <hr/>

      {/* Result will go here */}
    </div>
  )
}

export default App;
