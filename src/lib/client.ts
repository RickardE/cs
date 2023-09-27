import { createClient, type ClientConfig } from "@sanity/client";

const config: ClientConfig = {
  projectId: "vc3tgvjj",
  dataset: "production",
  apiVersion: "v2021-10-28",
  useCdn: false,
};

const client = createClient(config);

export default client;