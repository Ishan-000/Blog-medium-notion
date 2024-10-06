import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { usePosts } from "../hooks";
import { BlogSkeleton } from "../components/BlogSkeleton";

export const Posts = () => {
    const { loading, posts } = usePosts();

    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }


    return <div>
    <Appbar />
    <div  className="flex justify-center">
        <div>
            {posts.map(post => <BlogCard
                id={String(post.id)} // Convert id to string
                authorName={post.author.name || "Anonymous"}
                title={post.title}
                content={post.content}
                publishedDate={"2nd Feb 2024"}
            />)}
        </div>
    </div>
</div>
}