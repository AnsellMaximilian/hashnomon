import { g, auth, config, connector } from "@grafbase/sdk";

const hashnode = connector.GraphQL({
  url: g.env("HASHNODE_API_URL"),
});

g.datasource(hashnode, { namespace: "hashnode" });

const moveTypeEnum = g.enum("MoveType", [
  "ATTACK",
  "DEFENSE",
  "POWER_UP",
  "VIRUS",
]);
const targetStatEnum = g.enum("TargetStat", ["STRENGTH", "DEFENSE", "SPEED"]);

const move = g.model("Move", {
  name: g.string(),
  description: g.string(),
  type: g.enumRef(moveTypeEnum),
  targetStat: g.enumRef(targetStatEnum),
  power: g.int(),
  reflective: g.boolean(),
  continuous: g.boolean(),
});

const userMoves = g.model("UserMoves", {
  userId: g.string().unique(),
  moves: g.relation(move).list(),
});

g.model("UserDevs", {
  userId: g.string().unique(),
  devs: g.string().list(),
});

g.extend("HashnodeUser", {
  stats: {
    args: { myArg: g.string().optional() },
    returns: g.json(),
    resolver: "stats",
  },
  // moves: {
  //   args: { myArg: g.string().optional() },
  //   returns: g.json(),
  //   resolver: "moves",
  // },
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
      rules.private();
    },
  },
});
