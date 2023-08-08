import { g, auth, config, connector } from "@grafbase/sdk";

// Welcome to Grafbase!
// Define your data models, integrate auth, permission rules, custom resolvers, search, and more with Grafbase.
// Integrate Auth
// https://grafbase.com/docs/auth
//
// const authProvider = auth.OpenIDConnect({
//   issuer: process.env.ISSUER_URL ?? ''
// })
//
// Define Data Models
// https://grafbase.com/docs/database

// const user = g.model('User', {
//   name: g.string(),
//   email: g.email().optional(),

//   // Extend models with resolvers
//   // https://grafbase.com/docs/edge-gateway/resolvers
//   // gravatar: g.url().resolver('user/gravatar')
// })

const hashnode = connector.GraphQL({
  url: g.env("HASHNODE_API_URL"),
});

g.datasource(hashnode, { namespace: "hashnode" });

const statsType = g.type("Stats", {
  strength: g.int(),
  defense: g.int(),
  speed: g.int(),
});

g.extend("HashnodeUser", {
  stats: {
    args: { myArg: g.string().optional() },
    returns: g.json(),
    resolver: "stats",
  },
});

const provider = auth.JWT({
  issuer: "nextauth",
  secret: g.env("NEXTAUTH_SECRET"),
});

export default config({
  schema: g,
  auth: {
    providers: [provider],
    rules: (rules) => {
      rules.public();
    },
  },
  // Integrate Auth
  // https://grafbase.com/docs/auth
  // auth: {
  //   providers: [authProvider],
  //   rules: (rules) => {
  //     rules.private()
  //   }
  // }
});
