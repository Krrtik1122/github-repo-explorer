import axios from 'axios'


// api to interact with github through axios using token 
const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
  },
})

//function to get details of user and export that to other files
export async function getUser(username) {
  const { data } = await githubClient.get(`/users/${username}`)
  return data
}
// another function to get details of user repositories and export that to other files
export async function getUserRepos(username) {
  const { data } = await githubClient.get(`/users/${username}/repos`, {
    params: { sort: 'updated', per_page: 30 },
  })
  return data
}