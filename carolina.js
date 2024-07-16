editPost(id, updatedContent, updatedTags) {
    const post = this.posts.find(p => p.id === id);
    if (post) {
        post.content = updatedContent || post.content;
        post.tags = updatedTags || post.tags;
        return post;
    } else {
        return null;
    }
}

deletePost(id) {
    const index = this.posts.findIndex(p => p.id === id);
    if (index !== -1) {
        this.posts.splice(index, 1);
        return true;
    } else {
        return false;
    }
}

getAllPosts() {
    return this.posts;
}