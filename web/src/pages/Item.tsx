import { useParams } from "react-router-dom";
import { List } from "../components/List";
import { assertIsDefined } from "../helper/assert";

export const ItemPage = () => {
  const { uniqueKey } = useParams<{ uniqueKey: string }>();
  assertIsDefined(uniqueKey);

  return <List />;
};
