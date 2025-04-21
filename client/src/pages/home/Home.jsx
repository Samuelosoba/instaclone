import { lazy, Suspense } from "react";
import { usePost } from "../../store";
import MetaArgs from "../../components/MetaArgs";
import Container from "../../components/Container";
import Skeleton from "../../components/Skeleton";
const Card = lazy(() => import("./componenets/Card"));

export default function Home() {
  const { posts, error, loading } = usePost();
  return (
    <>
      <MetaArgs title="Your Instashot feed" content="Discover posts" />
      <Container classname="container">
        <div className="grid grid-cols-12 gap-4 justify-between">
          {/* post card div */}
          <div className="col-span-12 lg:col-span-8">
            <div className="w-full md:max-w-[450px] mx-auto">
              {loading ? (
                <Skeleton />
              ) : (
                <>
                  {posts?.length > 0 ? (
                    <Suspense fallback={<Skeleton />}>
                      {posts?.map((post) => (
                        <Card key={post._id} post={post} />
                      ))}
                    </Suspense>
                  ) : (
                    <p className="my-8 text-center text-lg font-bold">
                      No posts to display
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
