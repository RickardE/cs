import { createClient, type ClientConfig } from "@sanity/client";

const config: ClientConfig = {
  projectId: "vc3tgvjj",
  dataset: "production",
  apiVersion: "v1",
  useCdn: false,
};

const client = createClient(config);

export default client;