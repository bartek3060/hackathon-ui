import axios from "axios";

export const testGetEndpoint = async () =>
  await axios.get<any>(
    "https://api.sampleapis.com/beers/ale"
  );
