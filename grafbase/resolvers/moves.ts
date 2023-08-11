import { Dev } from "@/lib/services/devs";

export default async function MovesResolver(
  { _id, username, name, numPosts, numReactions, numFollowers }: Dev,
  {}
) {
  const test1 = await fetch(
    process.env.NEXT_PUBLIC_GRAFBASE_API_URL as string,
    {
      method: "POST",
      body: JSON.stringify({
        query: `query GetDev($username: String!) {
                    hashnode {
                      user(username: $username) {
                        _id
                        username
                        name
                        numFollowers
                        numReactions
                        numPosts
                        numFollowing
                        photo
                        stats
                      }
                    }
                  }`,
        variables: { username: "ansellmax" },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const json = await test1.json();

  return { test: json };
}
