export default {
  baseURL: "http://localhost:8000/api/v1/",
  nouns: [
    { path: "admin/login", name: "login" },
    { path: "admin/delete", name: "deletePost" },
    { path: "post_count", name: "postCount" },
    { path: "admin/posts", name: "adminPosts" }
  ]
};
