// Utility functions for working with post collections
// Returns a random subset of the provided posts array
function getRandomPosts(posts, numPosts) {
  const shuffled = [...posts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPosts);
}
