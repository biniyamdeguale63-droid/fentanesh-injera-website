export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      const target = "https://fentanesh-injera-website.onrender.com" + url.pathname + url.search;
      return fetch(target, request);
    }
    return env.ASSETS.fetch(request);
  }
};
