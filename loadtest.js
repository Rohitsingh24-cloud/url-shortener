import http from "k6/http";
import { Counter } from "k6/metrics";

const status200 = new Counter("status200");
const status302 = new Counter("status302");
const status404 = new Counter("status404");
const status429 = new Counter("status429");
const status500 = new Counter("status500");

export const options = {
  vus: 1000,
  duration: "20s",
};

export default function () {
  const res = http.get(
    "http://localhost:3000/ch034r3",
    {
      redirects: 0,
    }
  );

  switch (res.status) {
    case 200:
      status200.add(1);
      break;

    case 302:
      status302.add(1);
      break;

    case 404:
      status404.add(1);
      break;

    case 429:
      status429.add(1);
      break;

    case 500:
      status500.add(1);
      break;
  }
}